import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AdminJwtPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export interface AuthRequest extends Request {
  admin?: AdminJwtPayload;
}

const verifyAdminToken = (
  req: Request & { admin?: AdminJwtPayload },
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined = req.cookies?.adminToken;

    if (!token) {
      const authHeader = req.headers?.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    const decoded = jwt.verify(token, jwtSecret, {
      issuer: "acm-sigai-admin",
      audience: "admin-panel"
    }) as AdminJwtPayload;

    // attach admin info to request
    req.admin = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default verifyAdminToken;
