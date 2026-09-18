import { Router } from "express";
import { getAllEvents, registerForEvent } from "../controllers/webeventController";

const router = Router();

router.get("/getallmem", getAllEvents);
router.post("/register", registerForEvent)

export default router;
