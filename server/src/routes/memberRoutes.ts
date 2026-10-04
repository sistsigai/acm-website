import express from "express";
import {
  createMember,
  getMembers,
  deleteMember,
  updateMember,
  deleteMemberSocial,
  uploadMemberImage,
  deleteMemberImage,
} from "../controllers/memberController";
import { upload } from "../middleware/upload";
import verifyAdminToken from "../middleware/verifyAdminToken";
import { requirePermission } from "../middleware/requirePermission";

const router = express.Router();

router.use(verifyAdminToken, requirePermission("members"));

router.post("/upload-image", upload.single("image"), uploadMemberImage);
router.post("/delete-image", deleteMemberImage);
router.post("/add", upload.single("profilePic"), createMember);
router.get("/getAll", getMembers);
router.delete("/:id", deleteMember);
router.put("/:id", upload.single("profilePic"), updateMember);
router.delete("/:id/social/:platform", deleteMemberSocial);

export default router;