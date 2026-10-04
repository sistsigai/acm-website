import { Router } from "express";
import verifyAdminToken from "../middleware/verifyAdminToken";
import { requireSuperAdmin } from "../middleware/requirePermission";
import {
  getAdminUsers,
  getCurrentBatchMembers,
  createAdminUser,
  updateAdminUser,
  toggleAdminStatus,
  resetAdminPassword,
  deleteAdminUser,
} from "../controllers/adminUserController";

const router = Router();

// All routes strictly require superadmin credentials
router.use(verifyAdminToken, requireSuperAdmin);

router.get("/batch-members", getCurrentBatchMembers);
router.get("/getAll", getAdminUsers);
router.post("/create", createAdminUser);
router.put("/:id", updateAdminUser);
router.put("/:id/status", toggleAdminStatus);
router.put("/:id/reset-password", resetAdminPassword);
router.delete("/:id", deleteAdminUser);

export default router;
