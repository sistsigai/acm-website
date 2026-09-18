import { Router } from "express";
import { getAllRecruitments, getRecruitmentById, submitApplication, uploadFiles, uploadMiddleware } from "../controllers/joinusController";

const router = Router();

router.get("/getall", getAllRecruitments);
router.get("/recruitments/:id", getRecruitmentById);
router.post("/upload-files", uploadMiddleware, uploadFiles);
router.post("/applications/submit", submitApplication);

export default router;