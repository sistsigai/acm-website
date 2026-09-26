import { Router } from "express";
import { getMembers } from "../controllers/memberController";

const router = Router();

router.get("/getallmem", getMembers);

export default router;