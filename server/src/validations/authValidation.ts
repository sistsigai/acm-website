import { z } from "zod";

export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required").trim(),
  password: z.string().min(1, "Password is required"),
});

export const updateCredentialsSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newUsername: z.string().min(3, "New username must be at least 3 characters").optional(),
  newPassword: z.string().min(6, "New password must be at least 6 characters").optional(),
});