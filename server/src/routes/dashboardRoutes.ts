import { Router } from "express";
import verifyAdminToken from "../middleware/verifyAdminToken";
import { requirePermission } from "../middleware/requirePermission";
import { getDashboardData, syncDashboardData } from "../controllers/dashboardController";

const router = Router();

router.use(verifyAdminToken, requirePermission("dashboard"));

router.get("/getData", getDashboardData);
router.post("/sync", syncDashboardData);

export default router;

