import axios from "axios";
import axiosInstance from "../axiosInstance";

/* ---------------- TYPES ---------------- */

export interface ContactFormData {
  Firstname: string;
  Lastname: string;
  Email: string;
  Mobile: string;
  Message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  submissionId?: string;
  timestamp?: string;
}

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

/* ---------------- CONTACT FORM ---------------- */

/**
 * Submit contact form
 * Throws structured server errors for UI handling
 */
export const submitContactForm = async (
  formData: ContactFormData
): Promise<ContactResponse> => {
  try {
    const res = await axiosInstance.post<ContactResponse>(
      "/home/submit",
      formData
    );

    return res.data;
  } catch (error: unknown) {
    /**
     * AXIOS ERROR (server responded)
     */
    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        // Throw server payload directly
        throw error.response.data;
      }

      // Network / timeout error
      throw {
        success: false,
        message: "Unable to reach the server. Please check your connection.",
      };
    }

    /**
     * UNKNOWN ERROR
     */
    throw {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
};

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
