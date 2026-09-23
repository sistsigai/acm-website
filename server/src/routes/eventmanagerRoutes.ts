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

const router = express.Router();

router.post("/upload-image", upload.single("image"), verifyAdminToken, uploadEventImage);
router.post("/delete-image", verifyAdminToken, deleteEventImage);
router.post("/add", verifyAdminToken, addEvent);
router.get("/getAll", verifyAdminToken, getAllEvents);
router.delete("/:id", verifyAdminToken, deleteEvent);
router.put("/:id", verifyAdminToken, updateEvent);
router.put("/:id/display", verifyAdminToken, toggleEventDisplay);

export default router;

