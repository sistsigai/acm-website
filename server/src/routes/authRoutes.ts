import { Router } from "express";
import {
  adminLogin,
  adminLogout,
  verifyAuth,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
} from "../controllers/authController";
import verifyAdminToken from "../middleware/verifyAdminToken";
import { validateBody } from "../middleware/validateRequest";
import { adminLoginSchema } from "../validations/authValidation";

const router = Router();

router.post("/login", validateBody(adminLoginSchema), adminLogin);
router.post("/logout", adminLogout);
router.get("/me", verifyAdminToken, verifyAuth);
router.get("/profile", verifyAdminToken, getAdminProfile);
router.put("/profile", verifyAdminToken, updateAdminProfile);
router.put("/change-password", verifyAdminToken, changeAdminPassword);

export default router;