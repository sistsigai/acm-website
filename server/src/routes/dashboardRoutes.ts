import { Router } from "express";
import verifyAdminToken from "../middleware/verifyAdminToken";
import { getDashboardData, syncDashboardData } from "../controllers/dashboardController";

const router = Router();

router.get("/getData", verifyAdminToken, getDashboardData);
router.post("/sync", verifyAdminToken, syncDashboardData);

export default router;
