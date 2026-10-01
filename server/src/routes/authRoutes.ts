import { Router } from "express";
import { adminLogin, adminLogout, verifyAuth } from "../controllers/authController";
import verifyAdminToken from "../middleware/verifyAdminToken";
import { validateBody } from "../middleware/validateRequest";
import { adminLoginSchema } from "../validations/authValidation";

const router = Router();

router.post("/login", validateBody(adminLoginSchema), adminLogin);
router.post("/logout", adminLogout);
router.get("/me", verifyAdminToken, verifyAuth);

export default router;