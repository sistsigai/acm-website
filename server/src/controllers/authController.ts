import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin";
import { createAdminToken } from "../utils/jwt";

/* ---------------- VALIDATION CONSTANTS ---------------- */

const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_.-]+$/,
    PATTERN_DESC: "letters, numbers, dots, hyphens, and underscores"
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 100
  }
} as const;

/* ---------------- ERROR CODES ---------------- */

const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTH_ERROR: "AUTHENTICATION_ERROR",
  ACCOUNT_DISABLED: "ACCOUNT_DISABLED",
  SERVER_ERROR: "SERVER_ERROR"
} as const;

/* ---------------- SANITIZE INPUT ---------------- */

const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .trim();
};

/* ---------------- ADMIN LOGIN CONTROLLER ---------------- */

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    /* ---------- BASIC INPUT CHECK ---------- */

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
        code: ERROR_CODES.VALIDATION_ERROR
      });
    }

    /* ---------- USERNAME VALIDATION ---------- */

    const sanitizedUsername = sanitizeInput(username);

    if (sanitizedUsername.length < VALIDATION.USERNAME.MIN_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Username must be at least ${VALIDATION.USERNAME.MIN_LENGTH} characters`,
        code: ERROR_CODES.VALIDATION_ERROR,
        field: "username"
      });
    }

    if (sanitizedUsername.length > VALIDATION.USERNAME.MAX_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Username must be less than ${VALIDATION.USERNAME.MAX_LENGTH} characters`,
        code: ERROR_CODES.VALIDATION_ERROR,
        field: "username"
      });
    }

    if (!VALIDATION.USERNAME.PATTERN.test(sanitizedUsername)) {
      return res.status(400).json({
        success: false,
        message: `Username can only contain ${VALIDATION.USERNAME.PATTERN_DESC}`,
        code: ERROR_CODES.VALIDATION_ERROR,
        field: "username"
      });
    }

    /* ---------- PASSWORD VALIDATION ---------- */

    if (password.length < VALIDATION.PASSWORD.MIN_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters`,
        code: ERROR_CODES.VALIDATION_ERROR,
        field: "password"
      });
    }

    if (password.length > VALIDATION.PASSWORD.MAX_LENGTH) {
      return res.status(400).json({
        success: false,
        message: "Password is too long",
        code: ERROR_CODES.VALIDATION_ERROR,
        field: "password"
      });
    }

    /* ---------- FIND ADMIN (Case-Insensitive) ---------- */
    const escapedUsername = sanitizedUsername.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const admin = await Admin.findOne({
      username: { $regex: new RegExp(`^${escapedUsername}$`, "i") }
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        code: ERROR_CODES.AUTH_ERROR
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Admin account is disabled",
        code: ERROR_CODES.ACCOUNT_DISABLED
      });
    }

    /* ---------- PASSWORD CHECK & BCRYPT VERIFICATION ---------- */

    const isPasswordValid = await admin.comparePassword(password);

    if (isPasswordValid && !/^\$2[aby]\$\d{2}\$/.test(admin.password)) {
      // If legacy plaintext, trigger model pre-save hook to hash
      admin.password = password;
      await admin.save();
    }

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        code: ERROR_CODES.AUTH_ERROR
      });
    }

    /* ---------- ROLE NORMALIZATION & JWT SECRET HANDLING ---------- */
    const normalizedRole = (admin.role || "admin").toLowerCase() === "superadmin" ? "superadmin" : "admin";
    const permissions = normalizedRole === "superadmin" 
      ? ["dashboard", "members", "events"] 
      : (admin.permissions || ["dashboard", "events"]);

    const token = createAdminToken({
      id: admin._id.toString(),
      role: normalizedRole,
      permissions
    });

    /* ---------- SET HTTP-ONLY COOKIE ---------- */
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    /* ---------- SUCCESS RESPONSE ---------- */

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email || "",
        name: admin.name || admin.username,
        role: normalizedRole,
        permissions
      }
    });

  } catch (error) {
    console.error("Admin login error:", error);

    const message =
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error instanceof Error
          ? error.message
          : "Unexpected error";

    return res.status(500).json({
      success: false,
      message,
      code: ERROR_CODES.SERVER_ERROR,
      timestamp: new Date().toISOString()
    });
  }
};

/* ---------------- ADMIN LOGOUT CONTROLLER ---------------- */

export const adminLogout = async (_req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax"
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

/* ---------------- VERIFY AUTH CONTROLLER ---------------- */

export const verifyAuth = async (req: Request, res: Response) => {
  try {
    const adminPayload = (req as any).admin;
    if (!adminPayload || !adminPayload.id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }

    const admin = await Admin.findById(adminPayload.id).select("-password");
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is inactive or not found"
      });
    }

    const normalizedRole = (admin.role || "admin").toLowerCase() === "superadmin" ? "superadmin" : "admin";
    const permissions = normalizedRole === "superadmin"
      ? ["dashboard", "members", "events"]
      : (admin.permissions || []);

    return res.status(200).json({
      success: true,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email || "",
        name: admin.name || admin.username,
        role: normalizedRole,
        permissions
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Authentication verification failed"
    });
  }
};

/* ---------------- GET PROFILE CONTROLLER ---------------- */

export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    const adminPayload = (req as any).admin;
    if (!adminPayload || !adminPayload.id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const admin = await Admin.findById(adminPayload.id)
      .select("-password")
      .populate("memberId", "name imageUrl designation batch");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found",
      });
    }

    const normalizedRole = (admin.role || "admin").toLowerCase() === "superadmin" ? "superadmin" : "admin";
    const permissions = normalizedRole === "superadmin"
      ? ["dashboard", "members", "events"]
      : (admin.permissions || []);

    return res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email || "",
        name: admin.name || admin.username,
        role: normalizedRole,
        permissions,
        createdAt: (admin as any).createdAt,
        member: admin.memberId,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to load profile details",
    });
  }
};

/* ---------------- UPDATE PROFILE CONTROLLER ---------------- */

export const updateAdminProfile = async (req: Request, res: Response) => {
  try {
    const adminPayload = (req as any).admin;
    if (!adminPayload || !adminPayload.id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const { username, name, email } = req.body;

    const admin = await Admin.findById(adminPayload.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found",
      });
    }

    if (username && username.trim()) {
      const sanitizedUsername = sanitizeInput(username).toLowerCase();
      if (sanitizedUsername.length < 3) {
        return res.status(400).json({
          success: false,
          message: "Username must be at least 3 characters",
        });
      }

      // Check uniqueness against other admins
      const existing = await Admin.findOne({
        username: sanitizedUsername,
        _id: { $ne: admin._id },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "This username is already in use by another account",
        });
      }

      admin.username = sanitizedUsername;
    }

    if (name !== undefined) admin.name = sanitizeInput(name);
    if (email !== undefined) admin.email = sanitizeInput(email);

    await admin.save();

    const normalizedRole = (admin.role || "admin").toLowerCase() === "superadmin" ? "superadmin" : "admin";
    const permissions = normalizedRole === "superadmin"
      ? ["dashboard", "members", "events"]
      : (admin.permissions || []);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email || "",
        name: admin.name || admin.username,
        role: normalizedRole,
        permissions,
      },
    });
  } catch (err: any) {
    console.error("Update Admin Profile error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

/* ---------------- CHANGE PASSWORD CONTROLLER ---------------- */

export const changeAdminPassword = async (req: Request, res: Response) => {
  try {
    const adminPayload = (req as any).admin;
    if (!adminPayload || !adminPayload.id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const admin = await Admin.findById(adminPayload.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found",
      });
    }

    // Verify current password if provided
    if (currentPassword) {
      const isValid = await admin.comparePassword(currentPassword);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }
    }

    admin.password = newPassword;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err: any) {
    console.error("Change Password error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update password",
    });
  }
};

