import { Router } from "express";
import {
  getPublicTimeline,
  getAllTimelineAdmin,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
  reorderTimelineItems,
} from "../controllers/timelineController";
import verifyAdminToken from "../middleware/verifyAdminToken";
import { validateBody } from "../middleware/validateRequest";
import {
  createTimelineItemSchema,
  updateTimelineItemSchema,
  reorderTimelineSchema,
} from "../validations/timelineValidation";
import { cacheResponse } from "../middleware/cacheMiddleware";

const router = Router();

// Public route (cached for 10 minutes)
router.get("/", cacheResponse(600), getPublicTimeline);

// Admin routes (protected)
router.get("/admin/all", verifyAdminToken, getAllTimelineAdmin);
router.post("/admin", verifyAdminToken, validateBody(createTimelineItemSchema), createTimelineItem);
router.put("/admin/reorder", verifyAdminToken, validateBody(reorderTimelineSchema), reorderTimelineItems);
router.put("/admin/:id", verifyAdminToken, validateBody(updateTimelineItemSchema), updateTimelineItem);
router.delete("/admin/:id", verifyAdminToken, deleteTimelineItem);

export default router;
