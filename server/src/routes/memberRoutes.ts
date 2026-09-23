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

router.post("/upload-image", upload.single("image"), verifyAdminToken, uploadMemberImage);
router.post("/delete-image", verifyAdminToken, deleteMemberImage);
router.post("/add", upload.single("profilePic"), verifyAdminToken, createMember);
router.get("/getAll", verifyAdminToken, getMembers);
router.delete("/:id", verifyAdminToken, deleteMember);
router.put("/:id", upload.single("profilePic"), verifyAdminToken, updateMember);
router.delete("/:id/social/:platform", verifyAdminToken, deleteMemberSocial);

export default router;