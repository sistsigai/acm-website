import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  admin?: any;
}

const verifyAdminToken = (
  req: any,
  res: any,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

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
