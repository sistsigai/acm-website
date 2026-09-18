import { Request, Response } from "express";
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

    /* ---------- FIND ADMIN ---------- */

    const admin = await Admin.findOne({ username: sanitizedUsername });

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

    /* ---------- PASSWORD CHECK ---------- */

    if (admin.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        code: ERROR_CODES.AUTH_ERROR
      });
    }

    /* ---------- JWT SECRET HANDLING ---------- */
    const token = createAdminToken({
      id: admin._id.toString(),
      role: admin.role
    });
    /* ---------- SUCCESS RESPONSE ---------- */

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: admin._id,
        username: admin.username,
        role: admin.role
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
