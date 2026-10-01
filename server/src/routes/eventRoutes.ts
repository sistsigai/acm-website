import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import {
  getAllEvents,
  registerForEvent,
  uploadEventRegistrationFile,
  deleteEventRegistrationFile,
} from "../controllers/webEventController";
import {
  getEventRegistrations,
  scanAttendanceQr,
  batchScanAttendance,
  toggleRegistrationAttendance,
} from "../controllers/eventAttendanceController";
import { uploadRegistrationFile } from "../middleware/upload";
import verifyAdminToken from "../middleware/verifyAdminToken";
import { validateBody } from "../middleware/validateRequest";
import { eventRegistrationSchema, batchScanAttendanceSchema } from "../validations/eventValidation";
import { cacheResponse } from "../middleware/cacheMiddleware";

const router = Router();

// Registration rate limiter: allows up to 60 registrations per 5 minutes per IP (supports campus NAT/Wi-Fi while preventing bot flooding)
const registrationRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  message: {
    success: false,
    message: "Too many registration requests from this network. Please wait a few minutes before trying again.",
    code: "REGISTRATION_RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware to handle registration file upload with clear error responses
const handleRegistrationFileUpload = (req: Request, res: Response, next: NextFunction) => {
  uploadRegistrationFile.single("file")(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File exceeds the 25MB maximum upload limit.",
          });
        }
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`,
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || "Failed to process uploaded file",
      });
    }
    next();
  });
};

/* --- Public Website Endpoints --- */
router.get("/getallmem", cacheResponse(180), getAllEvents);
router.post("/register", registrationRateLimiter, validateBody(eventRegistrationSchema), registerForEvent);
router.post("/upload-file", handleRegistrationFileUpload, uploadEventRegistrationFile);
router.post("/delete-file", deleteEventRegistrationFile);

/* --- Attendance Scanner Endpoints --- */
router.put("/registration/:registrationId/attendance", verifyAdminToken, toggleRegistrationAttendance);
router.get("/:eventId/registrations", verifyAdminToken, getEventRegistrations);
router.post("/:eventId/attendance/scan", scanAttendanceQr);
router.post("/:eventId/attendance/batch-scan", validateBody(batchScanAttendanceSchema), batchScanAttendance);

export default router;
