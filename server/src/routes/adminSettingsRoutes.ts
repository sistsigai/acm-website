import { Router } from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/adminSettingsController";
import verifyAdminToken from "../middleware/verifyAdminToken";

const router = Router();

router.get("/get", verifyAdminToken, getSettings);
router.put("/update", verifyAdminToken, updateSettings);

export default router;
