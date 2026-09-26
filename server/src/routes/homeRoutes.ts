import { Router } from "express";
import { getAdminSettings } from "../controllers/homeController";

const router = Router();

router.get("/settings", getAdminSettings);

export default router;
