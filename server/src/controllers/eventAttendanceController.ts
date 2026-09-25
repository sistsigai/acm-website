import { Request, Response } from "express";
import mongoose from "mongoose";
import Registration from "../models/Registration";
import Event from "../models/events";

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

    // Build base filter
    const filter: any = { eventId };

    if (status === "present") {
      filter.entry = true;
    } else if (status === "absent") {
      filter.entry = { $ne: true };
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { registerNo: searchRegex },
        { phone: searchRegex },
        { dept: searchRegex },
      ];
    }

    // Fetch registrations
    const registrations = await Registration.find(filter).sort({ createdAt: -1 }).lean();

    // Calculate overall stats for this event (ignoring search / status filters)
    const [totalRegistered, totalPresent] = await Promise.all([
      Registration.countDocuments({ eventId }),
      Registration.countDocuments({ eventId, entry: true }),
    ]);

    const totalAbsent = Math.max(0, totalRegistered - totalPresent);
    const attendanceRate =
      totalRegistered > 0 ? Math.round((totalPresent / totalRegistered) * 100) : 0;

    return res.status(200).json({
      success: true,
      registrations,
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
      if (cleanData.includes("%7B") || cleanData.includes("%22") || cleanData.includes("%3A")) {
        try {
          cleanData = decodeURIComponent(cleanData);
        } catch {}
      }

      // 1. Try parsing raw JSON
      try {
        const parsed = JSON.parse(cleanData);
        if (parsed.registrationId) {
          resolvedRegistrationId = parsed.registrationId;
        } else if (parsed._id) {
          resolvedRegistrationId = parsed._id;
        } else if (parsed.id) {
          resolvedRegistrationId = parsed.id;
        }
      } catch {
        // 2. Try base64 decoded JSON / string
        try {
          const decoded = Buffer.from(cleanData, "base64").toString("utf-8");
          const parsed = JSON.parse(decoded);
          if (parsed.registrationId) {
            resolvedRegistrationId = parsed.registrationId;
          } else if (parsed._id) {
            resolvedRegistrationId = parsed._id;
          } else if (parsed.id) {
            resolvedRegistrationId = parsed.id;
          }
        } catch {
          // 3. Try regex match for ObjectId in URLs or query strings
          const objectIdMatch = cleanData.match(/[0-9a-fA-F]{24}/);
          if (objectIdMatch) {
            resolvedRegistrationId = objectIdMatch[0];
          }
        }
      }
    }

    if (!resolvedRegistrationId || !mongoose.Types.ObjectId.isValid(resolvedRegistrationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid QR code format. Could not extract valid registration ticket data.",
      });
    }

    // Find the attendee registration
    const registration = await Registration.findById(resolvedRegistrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration ticket record not found in system.",
      });
    }

    // Ensure the ticket belongs to THIS specific event
    if (registration.eventId.toString() !== eventId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Ticket Mismatch: This QR code belongs to a different event!",
      });
    }

    // Check if attendee is already checked in
    if (registration.entry === true) {
      return res.status(200).json({
        success: true,
        alreadyCheckedIn: true,
        message: "Attendee has already been checked in!",
        registration,
        checkedInAt: registration.checkedInAt,
      });
    }

    // Mark attendance
    registration.entry = true;
    registration.checkedInAt = new Date();
    await registration.save();

    return res.status(200).json({
      success: true,
      alreadyCheckedIn: false,
      message: "Attendance marked successfully!",
      registration,
      checkedInAt: registration.checkedInAt,
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

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ success: false, message: "Registration not found" });
    }

    registration.entry = Boolean(entry);
    registration.checkedInAt = Boolean(entry) ? (registration.checkedInAt || new Date()) : null;
    await registration.save();

    return res.status(200).json({
      success: true,
      message: `Attendee marked as ${registration.entry ? "Present" : "Absent"}`,
      registration,
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

    const registrations = await Registration.find({ eventId }).sort({ createdAt: 1 }).lean();

    // Build CSV header with exact requested columns
    const headers = [
      "Full Name",
      "Register No",
      "Email Address",
      "Attendance Status",
      "Checked-In Timestamp",
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = [headers.map(escapeCsv).join(",")];

    for (const r of registrations as any[]) {
      const answersMap =
        r.answers instanceof Map
          ? Object.fromEntries(r.answers)
          : typeof r.answers === "object"
          ? r.answers
          : {};

      const fullName = r.name || answersMap["Full Name"] || answersMap["fullname"] || "N/A";
      const registerNo = r.registerNo || answersMap["Register Number"] || answersMap["Register No"] || answersMap["regno"] || "N/A";
      const email = r.email || answersMap["Email ID"] || answersMap["Email Address"] || answersMap["email"] || "N/A";
      const attendanceStatus = r.entry ? "Present" : "Absent";
      const checkedInTime = r.checkedInAt
        ? new Date(r.checkedInAt).toLocaleString()
        : "N/A";

      const row = [
        escapeCsv(fullName),
        escapeCsv(registerNo),
        escapeCsv(email),
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

    const registration = await Registration.findByIdAndDelete(registrationId);
    if (!registration) {
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

