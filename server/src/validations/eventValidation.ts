import { z } from "zod";

export const eventRegistrationSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  answers: z.record(z.string(), z.any()).optional().default({}),
}).passthrough();


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
