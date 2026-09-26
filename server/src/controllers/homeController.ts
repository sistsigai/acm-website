import { Request, Response } from "express";
import AdminSettings from "../models/AdminSettings";

export const getAdminSettings = async (_req: Request, res: Response) => {
  try {
    let settings = await AdminSettings.findOne();

    // If no settings exist, create default
    if (!settings) {
      settings = await AdminSettings.create({
        orgName: "SIST ACM SIGAI Student Chapter",
        about: "",
        mission: "",
        vision: "",
        ideology: "",
        contact: {
          location: "",
          email: "",
          phone: "",
        },
        socials: {
          instagram: "",
          linkedin: "",
          twitter: "",
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error: unknown) {
    console.error("Error fetching admin settings:", error);

    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch admin settings",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin settings",
    });
  }
};