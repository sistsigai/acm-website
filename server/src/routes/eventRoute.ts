import { Router } from "express";
import { getAllEvents, registerForEvent, uploadEventRegistrationFile } from "../controllers/webeventController";
import { upload } from "../middleware/upload";

const router = Router();

router.get("/getallmem", getAllEvents);
router.post("/register", registerForEvent);
router.post("/upload-file", upload.single("file"), uploadEventRegistrationFile);

export default router;
