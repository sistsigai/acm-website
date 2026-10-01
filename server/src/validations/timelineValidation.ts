import { z } from "zod";

export const createTimelineItemSchema = z.object({
  year: z.string().min(1, "Year or batch span is required (e.g. 2024-2025)").trim(),
  title: z.string().min(2, "Title is required (e.g. The Founding Batch)").max(150).trim(),
  description: z.string().min(5, "Description must be at least 5 characters").trim(),
  link: z.string().optional().default(""),
  order: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
  achievements: z.array(z.string()).optional().default([]),
});

export const updateTimelineItemSchema = createTimelineItemSchema.partial();

export const reorderTimelineSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      order: z.number().int(),
    })
  ).min(1, "Timeline items array cannot be empty"),
});
