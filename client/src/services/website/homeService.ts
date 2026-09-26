import axiosInstance from "../axiosInstance";

/* ---------------- TYPES ---------------- */

export interface AdminSettings {
  orgName: string;

  about: string;
  mission: string;
  vision: string;
  ideology: string;

  contact: {
    location: string;
    email: string;
    phone: string;
  };

  socials: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface AdminSettingsResponse {
  success: boolean;
  data: AdminSettings;
}

/* ---------------- ADMIN SETTINGS ---------------- */

export const getAdminSettings = async (): Promise<AdminSettings> => {
  try {
    const res = await axiosInstance.get<AdminSettingsResponse>(
      "/home/settings"
    );

    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch admin settings:", error);
    throw new Error("Failed to load admin settings");
  }
};
