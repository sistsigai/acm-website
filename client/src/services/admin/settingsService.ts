import axiosInstance from "../axiosInstance";

/* ---------------- TYPES ---------------- */

export interface AdminSettingsPayload {
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

export interface AdminSettingsResponse extends AdminSettingsPayload {
    _id: string;
    createdAt: string;
    updatedAt: string;
}

/* ---------------- API CALLS ---------------- */

/**
 * Get admin settings
 */
export const getAdminSettings = async (): Promise<AdminSettingsResponse> => {
    const res = await axiosInstance.get("/admin/settings/get");
    return res.data;
};

/**
 * Create or Update admin settings
 * (Upsert style – single document)
 */
export const updateAdminSettings = async (
    payload: AdminSettingsPayload
): Promise<AdminSettingsResponse> => {
    const res = await axiosInstance.put("/admin/settings/update", payload);
    return res.data;
};
