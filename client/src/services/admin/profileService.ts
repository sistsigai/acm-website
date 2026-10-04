import axiosInstance from "../axiosInstance";

export interface AdminProfileData {
  id: string;
  username: string;
  email: string;
  name: string;
  role: "superadmin" | "admin";
  permissions: string[];
  createdAt?: string;
  member?: {
    _id: string;
    name: string;
    imageUrl?: string;
    designation: string;
    batch: string;
  } | null;
}

/**
 * Get profile details of the currently logged-in admin / superadmin
 */
export const getMyProfile = async (): Promise<AdminProfileData> => {
  const res = await axiosInstance.get("/admin/auth/profile");
  return res.data.data;
};

/**
 * Update profile details (username, name, email)
 */
export const updateMyProfile = async (payload: {
  username?: string;
  name?: string;
  email?: string;
}): Promise<{ user: AdminProfileData; message: string }> => {
  const res = await axiosInstance.put("/admin/auth/profile", payload);
  return res.data;
};

/**
 * Change admin password
 */
export const changeMyPassword = async (payload: {
  currentPassword?: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  const res = await axiosInstance.put("/admin/auth/change-password", payload);
  return res.data;
};
