import { Request, Response, NextFunction } from "express";
import { AdminJwtPayload } from "./verifyAdminToken";
import { AdminPermission } from "../models/Admin";

export interface AuthRequestWithAdmin extends Request {
  admin?: AdminJwtPayload;
}

/**
 * Middleware to require a specific page/module permission.
 * Superadmins automatically bypass all permission checks.
 */
export const requirePermission = (permission: AdminPermission) => {
  return (req: AuthRequestWithAdmin, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Authorization required",
      });
    }

    // Superadmin has full access across all modules
    if ((req.admin.role || "").toLowerCase() === "superadmin") {
      return next();
    }

    // Regular admin check
    const permissions = req.admin.permissions || [];
    if (permissions.includes(permission)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access Denied: You do not have permission to access the '${permission}' module.`,
      requiredPermission: permission,
    });
  };
};

/**
 * Middleware to strictly require Superadmin role.
 */
export const requireSuperAdmin = (
  req: AuthRequestWithAdmin,
  res: Response,
  next: NextFunction
) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: "Authorization required",
    });
  }

  if ((req.admin.role || "").toLowerCase() !== "superadmin") {
    return res.status(403).json({
      success: false,
      message: "Access Denied: Superadmin privileges required for this action.",
    });
  }

  next();
};
