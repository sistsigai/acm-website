import { Response } from "express";
import mongoose from "mongoose";
import Admin, { AdminPermission } from "../models/Admin";
import Member from "../models/Member";
import { AuthRequestWithAdmin } from "../middleware/requirePermission";

const VALID_PERMISSIONS: AdminPermission[] = ["dashboard", "members", "events"];

/**
 * Get all admin users (Superadmin only)
 */
export const getAdminUsers = async (req: AuthRequestWithAdmin, res: Response) => {
  try {
    const admins = await Admin.find()
      .select("-password")
      .populate("memberId", "name imageUrl designation batch")
      .sort({ createdAt: -1 });

    const normalizedAdmins = admins.map((admin) => {
      const obj = admin.toObject();
      return {
        ...obj,
        role: (obj.role || "admin").toLowerCase() === "superadmin" ? "superadmin" : "admin",
      };
    });

    return res.status(200).json({
      success: true,
      data: normalizedAdmins,
    });
  } catch (error: any) {
    console.error("Get Admin Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin users",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get current batch members available for admin assignment
 */
export const getCurrentBatchMembers = async (_req: AuthRequestWithAdmin, res: Response) => {
  try {
    // Find all distinct batches and pick latest or fetch all members
    const members = await Member.find()
      .select("_id name designation batch imageUrl email social")
      .sort({ batch: -1, name: 1 });

    return res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error: any) {
    console.error("Get Batch Members Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch batch members",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Create a new Admin user with selected page permissions (Superadmin only)
 */
export const createAdminUser = async (req: AuthRequestWithAdmin, res: Response) => {
  try {
    const {
      username,
      email,
      password,
      name,
      memberId,
      permissions,
      role = "admin",
      isActive = true,
    } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({
        success: false,
        message: "Username / Email is required",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const sanitizedUsername = username.trim().toLowerCase();

    // Check if username already exists
    const existing = await Admin.findOne({ username: sanitizedUsername });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "An admin account with this username/email already exists",
      });
    }

    // Validate permissions array
    const cleanPermissions: AdminPermission[] = Array.isArray(permissions)
      ? permissions.filter((p: any) => VALID_PERMISSIONS.includes(p))
      : ["dashboard", "events"];

    let validMemberId = null;
    if (memberId && mongoose.Types.ObjectId.isValid(memberId)) {
      validMemberId = memberId;
    }

    const newAdmin = new Admin({
      username: sanitizedUsername,
      email: email ? email.trim() : sanitizedUsername,
      password,
      name: name ? name.trim() : sanitizedUsername,
      role: role === "superadmin" ? "superadmin" : "admin",
      permissions: role === "superadmin" ? VALID_PERMISSIONS : cleanPermissions,
      memberId: validMemberId,
      isActive: Boolean(isActive),
      createdBy: req.admin?.id ? new mongoose.Types.ObjectId(req.admin.id) : null,
    });

    await newAdmin.save();

    const createdAdmin = await Admin.findById(newAdmin._id)
      .select("-password")
      .populate("memberId", "name imageUrl designation batch");

    return res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      data: createdAdmin,
    });
  } catch (error: any) {
    console.error("Create Admin User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create admin user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Update Admin User details & permissions (Superadmin only)
 */
export const updateAdminUser = async (req: AuthRequestWithAdmin, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, permissions, memberId, role, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid admin ID" });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin user not found" });
    }

    if (name !== undefined) admin.name = name.trim();
    if (email !== undefined) admin.email = email.trim();
    if (memberId !== undefined) {
      admin.memberId = memberId && mongoose.Types.ObjectId.isValid(memberId) ? memberId : null;
    }

    if (role !== undefined) {
      // Prevent demoting the last superadmin
      if (admin.role === "superadmin" && role !== "superadmin") {
        const superadminCount = await Admin.countDocuments({ role: "superadmin" });
        if (superadminCount <= 1) {
          return res.status(400).json({
            success: false,
            message: "Cannot demote the only remaining Superadmin account.",
          });
        }
      }
      admin.role = role === "superadmin" ? "superadmin" : "admin";
    }

    if (permissions !== undefined && Array.isArray(permissions)) {
      admin.permissions = admin.role === "superadmin"
        ? VALID_PERMISSIONS
        : permissions.filter((p: any) => VALID_PERMISSIONS.includes(p));
    }

    if (isActive !== undefined) {
      if (req.admin?.id === admin._id.toString() && isActive === false) {
        return res.status(400).json({
          success: false,
          message: "You cannot disable your own active account.",
        });
      }
      admin.isActive = Boolean(isActive);
    }

    await admin.save();

    const updatedAdmin = await Admin.findById(admin._id)
      .select("-password")
      .populate("memberId", "name imageUrl designation batch");

    return res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: updatedAdmin,
    });
  } catch (error: any) {
    console.error("Update Admin User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update admin user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Toggle Admin active/disabled status (Superadmin only)
 */
export const toggleAdminStatus = async (req: AuthRequestWithAdmin, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid admin ID" });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin user not found" });
    }

    if (req.admin?.id === admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot disable your own account.",
      });
    }

    admin.isActive = !admin.isActive;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: `Admin account ${admin.isActive ? "activated" : "disabled"}`,
      isActive: admin.isActive,
    });
  } catch (error: any) {
    console.error("Toggle Admin Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle status",
    });
  }
};

/**
 * Reset Admin password (Superadmin only)
 */
export const resetAdminPassword = async (req: AuthRequestWithAdmin, res: Response) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid admin ID" });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin user not found" });
    }

    admin.password = newPassword;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: `Password reset successfully for ${admin.username}`,
    });
  } catch (error: any) {
    console.error("Reset Admin Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};

/**
 * Delete Admin user (Superadmin only)
 */
export const deleteAdminUser = async (req: AuthRequestWithAdmin, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid admin ID" });
    }

    if (req.admin?.id === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own active Superadmin account.",
      });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin user not found" });
    }

    if (admin.role === "superadmin") {
      const superadminCount = await Admin.countDocuments({ role: "superadmin" });
      if (superadminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete the only remaining Superadmin account.",
        });
      }
    }

    await Admin.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: `Admin account ${admin.username} deleted successfully`,
    });
  } catch (error: any) {
    console.error("Delete Admin User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete admin user",
    });
  }
};
