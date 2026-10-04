import express from "express";
import {
  addEvent,
  deleteEvent,
  getAllEvents,
  toggleEventDisplay,
  updateEvent,
  uploadEventImage,
  deleteEventImage,
} from "../controllers/eventController";
import { upload } from "../middleware/upload";
import verifyAdminToken from "../middleware/verifyAdminToken";
import { requirePermission } from "../middleware/requirePermission";

import {
  getEventRegistrations,
  scanAttendanceQr,
  toggleRegistrationAttendance,
  deleteEventRegistration,
  exportEventRegistrationsCsv,
} from "../controllers/eventAttendanceController";

const router = express.Router();

router.use(verifyAdminToken, requirePermission("events"));

router.post("/upload-image", upload.single("image"), uploadEventImage);
router.post("/delete-image", deleteEventImage);
router.post("/add", addEvent);
router.get("/getAll", getAllEvents);

/* --- Event Attendance & Registrations (Defined before generic :id routes) --- */
router.put("/registration/:registrationId/attendance", toggleRegistrationAttendance);
router.delete("/registration/:registrationId", deleteEventRegistration);
router.get("/:eventId/registrations/export", exportEventRegistrationsCsv);
router.get("/:eventId/registrations", getEventRegistrations);
router.post("/:eventId/attendance/scan", scanAttendanceQr);

/* --- Generic Event CRUD with :id --- */
router.delete("/:id", deleteEvent);
router.put("/:id", updateEvent);
router.put("/:id/display", toggleEventDisplay);

export default router;


