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

const router = express.Router();

router.post("/upload-image", verifyAdminToken, upload.single("image"), uploadMemberImage);
router.post("/delete-image", verifyAdminToken, deleteMemberImage);
router.post("/add", verifyAdminToken, upload.single("profilePic"), createMember);
router.get("/getAll", verifyAdminToken, getMembers);
router.delete("/:id", verifyAdminToken, deleteMember);
router.put("/:id", verifyAdminToken, upload.single("profilePic"), updateMember);
router.delete("/:id/social/:platform", verifyAdminToken, deleteMemberSocial);

export default router;