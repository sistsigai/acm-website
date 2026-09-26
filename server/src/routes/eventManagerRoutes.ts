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

import {
  getEventRegistrations,
  scanAttendanceQr,
  toggleRegistrationAttendance,
  deleteEventRegistration,
  exportEventRegistrationsCsv,
} from "../controllers/eventAttendanceController";

const router = express.Router();

router.post("/upload-image", verifyAdminToken, upload.single("image"), uploadEventImage);
router.post("/delete-image", verifyAdminToken, deleteEventImage);
router.post("/add", verifyAdminToken, addEvent);
router.get("/getAll", verifyAdminToken, getAllEvents);

/* --- Event Attendance & Registrations (Defined before generic :id routes) --- */
router.put("/registration/:registrationId/attendance", verifyAdminToken, toggleRegistrationAttendance);
router.delete("/registration/:registrationId", verifyAdminToken, deleteEventRegistration);
router.get("/:eventId/registrations/export", verifyAdminToken, exportEventRegistrationsCsv);
router.get("/:eventId/registrations", verifyAdminToken, getEventRegistrations);
router.post("/:eventId/attendance/scan", verifyAdminToken, scanAttendanceQr);

/* --- Generic Event CRUD with :id --- */
router.delete("/:id", verifyAdminToken, deleteEvent);
router.put("/:id", verifyAdminToken, updateEvent);
router.put("/:id/display", verifyAdminToken, toggleEventDisplay);

export default router;

