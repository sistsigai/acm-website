import express from "express";
import { addEvent, deleteEvent, getAllEvents, toggleEventDisplay, updateEvent } from "../controllers/eventController";
import verifyAdminToken from "../middleware/verifyAdminToken";

const router = express.Router();

router.post("/add", verifyAdminToken, addEvent);
router.get("/getAll", verifyAdminToken, getAllEvents)
router.delete("/:id", verifyAdminToken, deleteEvent);
router.put('/:id', verifyAdminToken, updateEvent)
router.put("/:id/display", verifyAdminToken, toggleEventDisplay);

export default router;
