import { Router } from "express";
import { getAdminSettings, submitContactForm } from "../controllers/homeController";

const router = Router();

router.post("/submit", submitContactForm);
router.get("/settings", getAdminSettings);

export default router;
