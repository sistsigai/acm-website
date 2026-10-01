import { Router } from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/adminSettingsController";
import verifyAdminToken from "../middleware/verifyAdminToken";
import { validateBody } from "../middleware/validateRequest";
import { updateAdminSettingsSchema } from "../validations/settingsValidation";

const router = Router();

router.get("/get", verifyAdminToken, getSettings);
router.put("/update", verifyAdminToken, validateBody(updateAdminSettingsSchema), updateSettings);

export default router;
