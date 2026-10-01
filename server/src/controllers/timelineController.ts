import { Request, Response } from "express";
import Timeline from "../models/Timeline";
import { invalidateCache } from "../middleware/cacheMiddleware";

/**
 * Public: Get all active timeline batches sorted by order
 */
export const getPublicTimeline = async (req: Request, res: Response) => {
  try {
    const timeline = await Timeline.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      success: true,
      timeline,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch timeline items",
      error: error.message,
    });
  }
};

/**
 * Admin: Get all timeline batches (active and inactive)
 */
export const getAllTimelineAdmin = async (req: Request, res: Response) => {
  try {
    const timeline = await Timeline.find().sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      success: true,
      timeline,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch timeline items for admin",
      error: error.message,
    });
  }
};

/**
 * Admin: Create a new timeline batch item
 */
export const createTimelineItem = async (req: Request, res: Response) => {
  try {
    const { year, title, description, link, order, isActive, achievements } = req.body;

    const newItem = await Timeline.create({
      year,
      title,
      description,
      link: link || `/about?batch=${encodeURIComponent(year)}`,
      order: order ?? 0,
      isActive: isActive ?? true,
      achievements: achievements || [],
    });

    invalidateCache("/api/timeline");

    return res.status(201).json({
      success: true,
      message: "Timeline item created successfully",
      item: newItem,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to create timeline item",
      error: error.message,
    });
  }
};

/**
 * Admin: Update an existing timeline batch item
 */
export const updateTimelineItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedItem = await Timeline.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Timeline item not found",
      });
    }

    invalidateCache("/api/timeline");

    return res.status(200).json({
      success: true,
      message: "Timeline item updated successfully",
      item: updatedItem,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to update timeline item",
      error: error.message,
    });
  }
};

/**
 * Admin: Delete a timeline batch item
 */
export const deleteTimelineItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Timeline.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Timeline item not found",
      });
    }

    invalidateCache("/api/timeline");

    return res.status(200).json({
      success: true,
      message: "Timeline item deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete timeline item",
      error: error.message,
    });
  }
};

/**
 * Admin: Reorder timeline batches
 */
export const reorderTimelineItems = async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // Array of { id: string, order: number }

    const updatePromises = items.map((item: { id: string; order: number }) =>
      Timeline.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updatePromises);
    invalidateCache("/api/timeline");

    return res.status(200).json({
      success: true,
      message: "Timeline items reordered successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to reorder timeline items",
      error: error.message,
    });
  }
};
