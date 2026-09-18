import { Router } from "express";
import verifyAdminToken from "../middleware/verifyAdminToken";
import { getDashboardData, markContactAsRead, syncDashboardData } from "../controllers/dashboardController";

const router = Router();

router.get("/getData", verifyAdminToken, getDashboardData);
router.post("/sync", verifyAdminToken, syncDashboardData);
router.patch("/contact/:id/read", verifyAdminToken, markContactAsRead);


export default router;
