import { Request, Response } from "express";
import mongoose from "mongoose";
import Registration from "../models/Registration";
import Event from "../models/events";

/**
 * Helper to get the active registration MongoDB collection(s) dynamically
 */
const getRegistrationCollections = async (): Promise<mongoose.mongo.Collection[]> => {
  const db = mongoose.connection.db;
  if (!db) {
    return [mongoose.connection.collection("Eventregistrations")];
  }

  try {
    const list = await db.listCollections().toArray();
    const names = list.map((c) => c.name);

    // Candidates in priority order
    const candidates = [
      "Eventregistrations",
      "eventregistrations",
      "registrations",
      "EventRegistrations",
      "event_registrations",
    ];

    const matched = candidates.filter((cand) => names.includes(cand));
    if (matched.length > 0) {
      return matched.map((name) => db.collection(name));
    }
  } catch (e) {
    console.warn("Could not list collections:", e);
  }

  return [mongoose.connection.collection("Eventregistrations")];
};

/**
 * Normalize an attendee document to ensure all standard fields are populated
 */
const normalizeAttendeeDoc = (doc: any) => {
  const answersMap =
    doc.answers instanceof Map
      ? Object.fromEntries(doc.answers)
      : typeof doc.answers === "object" && doc.answers !== null
        ? doc.answers
        : {};

  const name =
    doc.name ||
    answersMap["Full Name"] ||
    answersMap["Name"] ||
    answersMap["fullname"] ||
    answersMap["name"] ||
    "Attendee";

  const registerNo =
    doc.registerNo ||
    answersMap["Register Number"] ||
    answersMap["Register No"] ||
    answersMap["regno"] ||
    answersMap["regNumber"] ||
    "N/A";

  const email =
    doc.email ||
    answersMap["Email ID"] ||
    answersMap["Email Address"] ||
    answersMap["email"] ||
    "N/A";

  const phone =
    doc.phone ||
    answersMap["Mobile Number"] ||
    answersMap["Phone Number"] ||
    answersMap["phone"] ||
    "N/A";

  const dept =
    doc.dept ||
    answersMap["Department"] ||
    answersMap["dept"] ||
    "N/A";

  const year = doc.year || answersMap["Year"] || answersMap["year"] || "";
  const section = doc.section || answersMap["Section"] || answersMap["section"] || "";

  return {
    _id: String(doc._id),
    eventId: String(doc.eventId),
    name,
    registerNo,
    dept,
    year,
    section,
    email,
    phone,
    answers: answersMap,
    entry: Boolean(doc.entry),
    checkedInAt: doc.checkedInAt || null,
    qrUrl: doc.qrUrl || null,
    createdAt: doc.createdAt || new Date().toISOString(),
    updatedAt: doc.updatedAt || new Date().toISOString(),
  };
};

/* ---------------- GET EVENT REGISTRATIONS & METRICS ---------------- */
export const getEventRegistrations = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { search = "", status = "all" } = req.query as {
      search?: string;
      status?: "all" | "present" | "absent";
    };

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: "Invalid event ID format" });
    }

    const eventObjId = new mongoose.Types.ObjectId(eventId);
    const eventStrId = eventId.toString();

    const collections = await getRegistrationCollections();
    let allDocs: any[] = [];
    let totalRegistered = 0;
    let totalPresent = 0;

    for (const coll of collections) {
      // 1. Fetch all docs for this event
      const rawDocs = await coll
        .find({
          $or: [{ eventId: eventObjId }, { eventId: eventStrId }],
        })
        .sort({ createdAt: -1 })
        .toArray();

      if (rawDocs && rawDocs.length > 0) {
        allDocs.push(...rawDocs);
      }
    }

    // De-duplicate by _id
    const seenIds = new Set<string>();
    const uniqueRawDocs: any[] = [];
    for (const doc of allDocs) {
      const idStr = String(doc._id);
      if (!seenIds.has(idStr)) {
        seenIds.add(idStr);
        uniqueRawDocs.push(doc);
      }
    }

    // Normalize docs
    const normalizedList = uniqueRawDocs.map(normalizeAttendeeDoc);

    // Calculate metrics
    totalRegistered = normalizedList.length;
    totalPresent = normalizedList.filter((d) => d.entry).length;
    const totalAbsent = Math.max(0, totalRegistered - totalPresent);
    const attendanceRate =
      totalRegistered > 0 ? Math.round((totalPresent / totalRegistered) * 100) : 0;

    // Apply filtering on normalized data
    let filteredList = normalizedList;

    if (status === "present") {
      filteredList = filteredList.filter((d) => d.entry);
    } else if (status === "absent") {
      filteredList = filteredList.filter((d) => !d.entry);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filteredList = filteredList.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.registerNo.toLowerCase().includes(q) ||
          d.phone.toLowerCase().includes(q) ||
          d.dept.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      registrations: filteredList,
      metrics: {
        totalRegistered,
        totalPresent,
        totalAbsent,
        attendanceRate,
      },
    });
  } catch (error: any) {
    console.error("Error fetching event registrations:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch event registrations",
    });
  }
};

/* ---------------- SCAN ATTENDANCE QR CODE ---------------- */
export const scanAttendanceQr = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { qrData, registrationId: directRegId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    let resolvedRegistrationId = directRegId;

    if (!resolvedRegistrationId && qrData) {
      let cleanData = String(qrData).trim();

      // Handle URI encoded strings
      if (cleanData.includes("%7B") || cleanData.includes("%22") || cleanData.includes("%3A") || cleanData.includes("%2F")) {
        try {
          cleanData = decodeURIComponent(cleanData);
        } catch { }
      }

      // Check if data is a URL with query parameters (e.g. ?data=... or ?ticket=... or ?id=...)
      if (cleanData.includes("?") || cleanData.startsWith("http://") || cleanData.startsWith("https://")) {
        try {
          const urlObj = new URL(cleanData, "https://sistsigai.acm.org");
          const ticketParam = urlObj.searchParams.get("ticket") || urlObj.searchParams.get("data") || urlObj.searchParams.get("payload");
          const idParam = urlObj.searchParams.get("id") || urlObj.searchParams.get("registrationId") || urlObj.searchParams.get("regId");
          if (idParam && mongoose.Types.ObjectId.isValid(idParam)) {
            resolvedRegistrationId = idParam;
          } else if (ticketParam) {
            cleanData = ticketParam;
          }
        } catch { }
      }

      // 1. Try parsing raw JSON
      if (!resolvedRegistrationId) {
        try {
          const parsed = JSON.parse(cleanData);
          if (parsed.registrationId && mongoose.Types.ObjectId.isValid(parsed.registrationId)) {
            resolvedRegistrationId = parsed.registrationId;
          } else if (parsed._id && mongoose.Types.ObjectId.isValid(parsed._id)) {
            resolvedRegistrationId = parsed._id;
          } else if (parsed.id && mongoose.Types.ObjectId.isValid(parsed.id)) {
            resolvedRegistrationId = parsed.id;
          }
        } catch { }
      }

      // 2. Try base64 decoded JSON / string
      if (!resolvedRegistrationId) {
        try {
          const decoded = Buffer.from(cleanData, "base64").toString("utf-8");
          const parsed = JSON.parse(decoded);
          if (parsed.registrationId && mongoose.Types.ObjectId.isValid(parsed.registrationId)) {
            resolvedRegistrationId = parsed.registrationId;
          } else if (parsed._id && mongoose.Types.ObjectId.isValid(parsed._id)) {
            resolvedRegistrationId = parsed._id;
          } else if (parsed.id && mongoose.Types.ObjectId.isValid(parsed.id)) {
            resolvedRegistrationId = parsed.id;
          }
        } catch { }
      }

      // 3. Try regex match for ObjectId in URLs or raw strings
      if (!resolvedRegistrationId) {
        const objectIdMatch = cleanData.match(/[0-9a-fA-F]{24}/);
        if (objectIdMatch) {
          resolvedRegistrationId = objectIdMatch[0];
        }
      }
    }

    if (!resolvedRegistrationId || !mongoose.Types.ObjectId.isValid(resolvedRegistrationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid QR code format. Could not extract valid registration ticket data.",
      });
    }

    const targetRegObjId = new mongoose.Types.ObjectId(resolvedRegistrationId);
    const collections = await getRegistrationCollections();

    let targetDoc: any = null;
    let targetColl: mongoose.mongo.Collection | null = null;

    for (const coll of collections) {
      const doc = await coll.findOne({
        $or: [{ _id: targetRegObjId }, { _id: resolvedRegistrationId as any }],
      });
      if (doc) {
        targetDoc = doc;
        targetColl = coll;
        break;
      }
    }

    if (!targetDoc || !targetColl) {
      return res.status(404).json({
        success: false,
        message: "Registration ticket record not found in system.",
      });
    }

    // Ensure the ticket belongs to THIS specific event
    if (String(targetDoc.eventId) !== String(eventId)) {
      let ticketEventName = "Another Event";
      let scanningEventName = "Current Event";

      try {
        const [ticketEv, scanningEv] = await Promise.all([
          Event.findById(targetDoc.eventId).select("name"),
          Event.findById(eventId).select("name"),
        ]);
        if (ticketEv?.name) ticketEventName = ticketEv.name;
        if (scanningEv?.name) scanningEventName = scanningEv.name;
      } catch { }

      const normalized = normalizeAttendeeDoc(targetDoc);

      return res.status(400).json({
        success: false,
        mismatch: true,
        ticketEventId: String(targetDoc.eventId),
        ticketEventName,
        currentEventName: scanningEventName,
        attendeeName: normalized.name,
        message: `Ticket Mismatch: This ticket is for "${ticketEventName}", but you are scanning for "${scanningEventName}".`,
      });
    }

    // Check if attendee is already checked in
    if (targetDoc.entry === true) {
      const normalized = normalizeAttendeeDoc(targetDoc);
      return res.status(200).json({
        success: true,
        alreadyCheckedIn: true,
        message: "Attendee has already been checked in!",
        registration: normalized,
        checkedInAt: targetDoc.checkedInAt,
      });
    }

    // Mark attendance
    const checkedInAt = new Date();
    await targetColl.updateOne(
      { _id: targetDoc._id },
      { $set: { entry: true, checkedInAt } }
    );

    targetDoc.entry = true;
    targetDoc.checkedInAt = checkedInAt;
    const normalized = normalizeAttendeeDoc(targetDoc);

    return res.status(200).json({
      success: true,
      alreadyCheckedIn: false,
      message: "Attendance marked successfully!",
      registration: normalized,
      checkedInAt,
    });
  } catch (error: any) {
    console.error("Error processing QR check-in:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process QR check-in",
    });
  }
};

/* ---------------- TOGGLE ATTENDANCE MANUALLY ---------------- */
export const toggleRegistrationAttendance = async (req: Request, res: Response) => {
  try {
    const { registrationId } = req.params;
    const { entry } = req.body;

    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      return res.status(400).json({ success: false, message: "Invalid registration ID" });
    }

    const targetRegObjId = new mongoose.Types.ObjectId(registrationId);
    const collections = await getRegistrationCollections();

    let targetDoc: any = null;
    let targetColl: mongoose.mongo.Collection | null = null;

    for (const coll of collections) {
      const doc = await coll.findOne({
        $or: [{ _id: targetRegObjId }, { _id: registrationId as any }],
      });
      if (doc) {
        targetDoc = doc;
        targetColl = coll;
        break;
      }
    }

    if (!targetDoc || !targetColl) {
      return res.status(404).json({ success: false, message: "Registration not found" });
    }

    const isEntry = Boolean(entry);
    const checkedInAt = isEntry ? targetDoc.checkedInAt || new Date() : null;

    await targetColl.updateOne(
      { _id: targetDoc._id },
      { $set: { entry: isEntry, checkedInAt } }
    );

    targetDoc.entry = isEntry;
    targetDoc.checkedInAt = checkedInAt;
    const normalized = normalizeAttendeeDoc(targetDoc);

    return res.status(200).json({
      success: true,
      message: `Attendee marked as ${isEntry ? "Present" : "Absent"}`,
      registration: normalized,
    });
  } catch (error: any) {
    console.error("Error toggling attendance:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update attendance status",
    });
  }
};

/* ---------------- EXPORT ATTENDANCE CSV ---------------- */
export const exportEventRegistrationsCsv = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    const event = await Event.findById(eventId).lean();
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const eventObjId = new mongoose.Types.ObjectId(eventId);
    const eventStrId = eventId.toString();
    const collections = await getRegistrationCollections();

    let allDocs: any[] = [];
    for (const coll of collections) {
      const rawDocs = await coll
        .find({
          $or: [{ eventId: eventObjId }, { eventId: eventStrId }],
        })
        .sort({ createdAt: 1 })
        .toArray();

      if (rawDocs && rawDocs.length > 0) {
        allDocs.push(...rawDocs);
      }
    }

    // De-duplicate
    const seenIds = new Set<string>();
    const uniqueRawDocs: any[] = [];
    for (const doc of allDocs) {
      const idStr = String(doc._id);
      if (!seenIds.has(idStr)) {
        seenIds.add(idStr);
        uniqueRawDocs.push(doc);
      }
    }

    const normalizedRegistrations = uniqueRawDocs.map(normalizeAttendeeDoc);

    // Build CSV
    const headers = [
      "Full Name",
      "Register No",
      "Email Address",
      "Department",
      "Attendance Status",
      "Checked-In Timestamp",
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = [headers.map(escapeCsv).join(",")];

    for (const r of normalizedRegistrations) {
      const attendanceStatus = r.entry ? "Present" : "Absent";
      const checkedInTime = r.checkedInAt
        ? new Date(r.checkedInAt).toLocaleString()
        : "N/A";

      const row = [
        escapeCsv(r.name),
        escapeCsv(r.registerNo),
        escapeCsv(r.email),
        escapeCsv([r.dept, r.year, r.section].filter(Boolean).join(" • ") || "N/A"),
        escapeCsv(attendanceStatus),
        escapeCsv(checkedInTime),
      ];
      rows.push(row.join(","));
    }

    const csvContent = rows.join("\r\n");
    const sanitizedEventName = event.name.replace(/[^a-zA-Z0-9_-]/g, "_");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${sanitizedEventName}_attendees.csv"`
    );

    return res.status(200).send(csvContent);
  } catch (error: any) {
    console.error("Error exporting registrations CSV:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to export attendance CSV",
    });
  }
};

/* ---------------- DELETE REGISTRATION ---------------- */
export const deleteEventRegistration = async (req: Request, res: Response) => {
  try {
    const { registrationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      return res.status(400).json({ success: false, message: "Invalid registration ID" });
    }

    const targetRegObjId = new mongoose.Types.ObjectId(registrationId);
    const collections = await getRegistrationCollections();

    let deleted = false;
    for (const coll of collections) {
      const result = await coll.deleteOne({
        $or: [{ _id: targetRegObjId }, { _id: registrationId as any }],
      });
      if (result.deletedCount && result.deletedCount > 0) {
        deleted = true;
        break;
      }
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Registration record not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Attendee registration deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting attendee registration:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete attendee registration",
    });
  }
};

