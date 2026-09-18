import { Router } from "express";
import {
    createRecruitment,
    deleteRecruitment,
    getAllRecruitments,
    toggleRecruitmentStatus,
    updateRecruitment
} from "../controllers/recruitmentController";
import verifyAdminToken from "../middleware/verifyAdminToken";


const router = Router();

/* CRUD */
router.get("/getall", verifyAdminToken, getAllRecruitments);
router.post("/add", verifyAdminToken, createRecruitment);
router.put("/:id/update", verifyAdminToken, updateRecruitment);
router.delete("/:id/delete", verifyAdminToken, deleteRecruitment);

/* Open / Close */
router.patch("/:id/status", verifyAdminToken, toggleRecruitmentStatus);

export default router;
