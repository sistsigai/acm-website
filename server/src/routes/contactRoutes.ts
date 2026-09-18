import express from "express";
import { deleteMessage, getMessages, sendAutoReply, toggleMessageRead } from "../controllers/contactController";
import verifyAdminToken from "../middleware/verifyAdminToken";

const router = express.Router();

router.get("/getMess", verifyAdminToken, getMessages);
router.patch("/:id/read", verifyAdminToken, toggleMessageRead);
router.delete("/:id/delete", verifyAdminToken, deleteMessage);
router.post("/:id/reply", verifyAdminToken, sendAutoReply);

export default router;
