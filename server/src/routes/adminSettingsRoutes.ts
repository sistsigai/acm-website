import { Router } from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/adminSettingsController";
import verifyAdminToken from "../middleware/verifyAdminToken";
import { requireSuperAdmin } from "../middleware/requirePermission";
import { validateBody } from "../middleware/validateRequest";
import { updateAdminSettingsSchema } from "../validations/settingsValidation";

const router = Router();

router.use(verifyAdminToken, requireSuperAdmin);

router.get("/get", getSettings);
router.put("/update", validateBody(updateAdminSettingsSchema), updateSettings);

export default router;

