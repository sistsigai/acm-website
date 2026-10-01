import { getEventRegistrations, type AttendeeRecord } from "../services/admin/eventService";

interface CachedManifest {
  eventId: string;
  updatedAt: number;
  totalCount: number;
  attendeesById: Record<string, AttendeeRecord>;
  attendeesByEmail: Record<string, AttendeeRecord>;
  attendeesByRegNo: Record<string, AttendeeRecord>;
}

export interface LocalVerificationResult {
  status: "success" | "already_checked_in" | "invalid" | "mismatch";
  message: string;
  registration?: AttendeeRecord;
  name?: string;
  registerNo?: string;
  email?: string;
  phone?: string;
  dept?: string;
  year?: string;
  section?: string;
  answers?: Record<string, any>;
  checkedInAt?: string;
}

const STORAGE_PREFIX = "acm_manifest_";

class ScannerManifestManager {
  private cache: Map<string, CachedManifest> = new Map();

  constructor() {
    this.loadAllFromStorage();
  }

  private loadAllFromStorage() {
    if (typeof window === "undefined") return;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const data: CachedManifest = JSON.parse(raw);
            this.cache.set(data.eventId, data);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to load manifests from storage", e);
    }
  }

  private saveToStorage(manifest: CachedManifest) {
    if (typeof window === "undefined") return;
    try {
      const key = `${STORAGE_PREFIX}${manifest.eventId}`;
      localStorage.setItem(key, JSON.stringify(manifest));
    } catch (e) {
      console.warn("Failed to save manifest to storage", e);
    }
  }

  /**
   * Pre-fetches and locally caches the attendee list for an event.
   */
  async prefetchEventManifest(eventId: string): Promise<{ success: boolean; count: number }> {
    try {
      const res = await getEventRegistrations(eventId);
      if (res?.success && Array.isArray(res.registrations)) {
        const attendeesById: Record<string, AttendeeRecord> = {};
        const attendeesByEmail: Record<string, AttendeeRecord> = {};
        const attendeesByRegNo: Record<string, AttendeeRecord> = {};

        for (const reg of res.registrations) {
          if (reg._id) attendeesById[reg._id] = reg;
          if (reg.email) attendeesByEmail[reg.email.toLowerCase().trim()] = reg;
          if (reg.registerNo && reg.registerNo !== "N/A") {
            attendeesByRegNo[reg.registerNo.toLowerCase().trim()] = reg;
          }
        }

        const manifest: CachedManifest = {
          eventId,
          updatedAt: Date.now(),
          totalCount: res.registrations.length,
          attendeesById,
          attendeesByEmail,
          attendeesByRegNo,
        };

        this.cache.set(eventId, manifest);
        this.saveToStorage(manifest);

        return { success: true, count: res.registrations.length };
      }
      return { success: false, count: 0 };
    } catch (err) {
      console.error("Failed to prefetch event manifest:", err);
      const existing = this.cache.get(eventId);
      return { success: false, count: existing ? existing.totalCount : 0 };
    }
  }

  getManifest(eventId: string): CachedManifest | null {
    return this.cache.get(eventId) || null;
  }

  getAttendeeCount(eventId: string): number {
    return this.cache.get(eventId)?.totalCount || 0;
  }

  /**
   * Extract potential ticket identifiers (ID, registerNo, email) from QR payload
   */
  private parseQrIdentifiers(qrData: string): {
    id?: string;
    email?: string;
    registerNo?: string;
    eventId?: string;
  } {
    let clean = qrData.trim();

    // URI decode
    if (clean.includes("%7B") || clean.includes("%22") || clean.includes("%3A")) {
      try {
        clean = decodeURIComponent(clean);
      } catch { }
    }

    // URL format with params
    if (clean.includes("?") || clean.startsWith("http://") || clean.startsWith("https://")) {
      try {
        const url = new URL(clean, "https://sistsigai.acm.org");
        const id = url.searchParams.get("id") || url.searchParams.get("registrationId") || url.searchParams.get("regId");
        const email = url.searchParams.get("email");
        const regNo = url.searchParams.get("registerNo") || url.searchParams.get("regno");
        const eventId = url.searchParams.get("eventId");
        if (id || email || regNo || eventId) {
          return {
            id: id || undefined,
            email: email?.toLowerCase().trim(),
            registerNo: regNo?.toLowerCase().trim(),
            eventId: eventId || undefined,
          };
        }
      } catch { }
    }

    // JSON format
    if (clean.startsWith("{") && clean.endsWith("}")) {
      try {
        const parsed = JSON.parse(clean);
        return {
          id: parsed.registrationId || parsed._id || parsed.id,
          email: parsed.email ? String(parsed.email).toLowerCase().trim() : undefined,
          registerNo: parsed.registerNo || parsed.regNo ? String(parsed.registerNo || parsed.regNo).toLowerCase().trim() : undefined,
          eventId: parsed.eventId ? String(parsed.eventId) : undefined,
        };
      } catch { }
    }

    // Plain ID or Register Number
    return {
      id: clean.length === 24 ? clean : undefined,
      registerNo: clean.length < 20 ? clean.toLowerCase() : undefined,
    };
  }

  /**
   * Instantly verify a ticket against the local on-device manifest.
   * Prevents duplicates immediately even without internet.
   */
  verifyTicketLocally(eventId: string, qrData: string): LocalVerificationResult {
    const manifest = this.cache.get(eventId);

    if (!manifest || manifest.totalCount === 0) {
      return {
        status: "invalid",
        message: "No local attendee roster found. Please download event roster first.",
      };
    }

    const parsed = this.parseQrIdentifiers(qrData);

    // Check for Event ID mismatch if present in QR
    if (parsed.eventId && parsed.eventId !== eventId) {
      return {
        status: "mismatch",
        message: "Ticket belongs to a different event! Entry denied.",
      };
    }

    // Find attendee by ID, Register Number, or Email
    let attendee: AttendeeRecord | undefined;

    if (parsed.id && manifest.attendeesById[parsed.id]) {
      attendee = manifest.attendeesById[parsed.id];
    } else if (parsed.registerNo && manifest.attendeesByRegNo[parsed.registerNo]) {
      attendee = manifest.attendeesByRegNo[parsed.registerNo];
    } else if (parsed.email && manifest.attendeesByEmail[parsed.email]) {
      attendee = manifest.attendeesByEmail[parsed.email];
    } else {
      // Direct raw string match against IDs
      const rawTrim = qrData.trim();
      if (manifest.attendeesById[rawTrim]) {
        attendee = manifest.attendeesById[rawTrim];
      }
    }

    // 🔴 Not found in manifest
    if (!attendee) {
      return {
        status: "invalid",
        message: "Invalid ticket! Attendee is not registered for this event.",
      };
    }

    // 🟡 Already Checked In -> STOP AT GATE
    if (attendee.entry) {
      return {
        status: "already_checked_in",
        message: `Attendee already entered at ${attendee.checkedInAt ? new Date(attendee.checkedInAt).toLocaleTimeString() : "earlier"}!`,
        registration: attendee,
        name: attendee.name,
        registerNo: attendee.registerNo,
        email: attendee.email,
        phone: attendee.phone,
        dept: attendee.dept,
        year: attendee.year,
        section: attendee.section,
        answers: attendee.answers,
        checkedInAt: attendee.checkedInAt || undefined,
      };
    }

    // 🟢 Valid Ticket -> Mark locally & allow entry
    const nowIso = new Date().toISOString();
    attendee.entry = true;
    attendee.checkedInAt = nowIso;

    // Update internal maps and persist
    manifest.attendeesById[attendee._id] = attendee;
    if (attendee.email) manifest.attendeesByEmail[attendee.email.toLowerCase().trim()] = attendee;
    if (attendee.registerNo && attendee.registerNo !== "N/A") {
      manifest.attendeesByRegNo[attendee.registerNo.toLowerCase().trim()] = attendee;
    }
    this.saveToStorage(manifest);

    return {
      status: "success",
      message: "Attendance verified & marked!",
      registration: attendee,
      name: attendee.name,
      registerNo: attendee.registerNo,
      email: attendee.email,
      phone: attendee.phone,
      dept: attendee.dept,
      year: attendee.year,
      section: attendee.section,
      answers: attendee.answers,
      checkedInAt: nowIso,
    };
  }

  /**
   * Update local status if server reports a different state
   */
  markAttendeeAsPresent(eventId: string, registrationId: string, checkedInAt?: string) {
    const manifest = this.cache.get(eventId);
    if (!manifest) return;
    const attendee = manifest.attendeesById[registrationId];
    if (attendee) {
      attendee.entry = true;
      attendee.checkedInAt = checkedInAt || new Date().toISOString();
      this.saveToStorage(manifest);
    }
  }
}

export const scannerManifest = new ScannerManifestManager();
