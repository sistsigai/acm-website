import { z } from "zod";

export const updateAdminSettingsSchema = z.object({
  orgName: z.string().min(1, "Organization name is required").trim().optional(),
  about: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  ideology: z.string().optional(),
  contact: z.object({
    location: z.string().optional().default(""),
    email: z.string().email("Invalid contact email").or(z.literal("")).optional().default(""),
    phone: z.string().optional().default(""),
  }).optional(),
  socials: z.object({
    instagram: z.string().url("Invalid URL").or(z.literal("")).optional().default(""),
    linkedin: z.string().url("Invalid URL").or(z.literal("")).optional().default(""),
    twitter: z.string().url("Invalid URL").or(z.literal("")).optional().default(""),
  }).optional(),
});
