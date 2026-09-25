import { Router } from "express";
import { adminLogin, adminLogout, verifyAuth } from "../controllers/authController";
import verifyAdminToken from "../middleware/verifyAdminToken";

const router = Router();

router.post("/login", adminLogin);
router.post("/logout", adminLogout);
router.get("/me", verifyAdminToken, verifyAuth);

export default router;