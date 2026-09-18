import { Request, Response } from "express";
import AdminSettings from "../models/AdminSettings";

/* ---------------- GET SETTINGS ---------------- */
export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await AdminSettings.findOne();

    // Create default settings if not exists
    if (!settings) {
      settings = await AdminSettings.create({
        orgName: "ACM Student Chapter",
        contact: {},
        socials: {},
      });
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error("Get Settings Error:", error);
    res.status(500).json({ message: "Failed to load settings" });
  }
};

/* ---------------- CREATE SETTINGS ---------------- */
export const createSettings = async (req: Request, res: Response) => {
  try {
    const exists = await AdminSettings.findOne();
    if (exists) {
      return res.status(400).json({
        message: "Settings already exist. Use update instead.",
      });
    }

    const settings = await AdminSettings.create(req.body);
    res.status(201).json(settings);
  } catch (error) {
    console.error("Create Settings Error:", error);
    res.status(500).json({ message: "Failed to create settings" });
  }
};

/* ---------------- UPDATE SETTINGS ---------------- */
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const settings = await AdminSettings.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    );

    res.status(200).json(settings);
  } catch (error) {
    console.error("Update Settings Error:", error);
    res.status(500).json({ message: "Failed to update settings" });
  }
};

/* ---------------- DELETE SETTINGS ---------------- */
export const deleteSettings = async (req: Request, res: Response) => {
  try {
    await AdminSettings.deleteMany({});
    res.status(200).json({ message: "Settings deleted" });
  } catch (error) {
    console.error("Delete Settings Error:", error);
    res.status(500).json({ message: "Failed to delete settings" });
  }
};
