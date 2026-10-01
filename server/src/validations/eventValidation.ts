import { z } from "zod";

export const eventRegistrationSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  name: z.string().min(2, "Name must be 2-100 characters").max(100).trim(),
  register: z.string().regex(/^\d{8}$/, "Register number must be exactly 8 digits"),
  department: z.string().min(2, "Department is required").max(100).trim(),
  year: z.string().regex(/^[1-4]$/, "Year must be between 1-4"),
  section: z.string().regex(/^[A-Z][1-9]$/i, "Section must be a letter followed by a number (e.g. A1)").transform(v => v.toUpperCase()),
  email: z.string().email("Enter a valid email address").trim().toLowerCase(),
  phone: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  customAnswers: z.record(z.string(), z.any()).optional().default({}),
});

export const scanAttendanceSchema = z.object({
  qrData: z.string().min(1, "QR code data is required"),
  eventId: z.string().min(1, "Event ID is required"),
});

export const batchScanAttendanceSchema = z.object({
  scans: z.array(
    z.object({
      qrData: z.string().min(1, "QR code data is required"),
      eventId: z.string().min(1, "Event ID is required"),
      scannedAt: z.string().optional(),
    })
  ).min(1, "At least one scan is required"),
});
