import axiosInstance from "../axiosInstance";

export type AdminRole = "superadmin" | "admin";
export type AdminPermission = "dashboard" | "members" | "events";

export interface BatchMemberOption {
  _id: string;
  name: string;
  designation: string;
  batch: string;
  imageUrl?: string;
  email?: string;
  social?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
}

export interface AdminUserRecord {
  _id: string;
  username: string;
  email?: string;
  name?: string;
  role: AdminRole;
  permissions: AdminPermission[];
  isActive: boolean;
  memberId?: BatchMemberOption | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminPayload {
  username: string;
  password: string;
  email?: string;
  name?: string;
  memberId?: string | null;
  permissions: AdminPermission[];
  role?: AdminRole;
  isActive?: boolean;
}

export interface UpdateAdminPayload {
  name?: string;
  email?: string;
  permissions?: AdminPermission[];
  memberId?: string | null;
  role?: AdminRole;
  isActive?: boolean;
}

/**
 * Fetch all admin users
 */
export const getAllAdmins = async (): Promise<AdminUserRecord[]> => {
  const res = await axiosInstance.get("/admin/users/getAll");
  return res.data?.data || [];
};

/**
 * Fetch members for admin assignment
 */
export const getBatchMembersForAdmin = async (): Promise<BatchMemberOption[]> => {
  const res = await axiosInstance.get("/admin/users/batch-members");
  return res.data?.data || [];
};

/**
 * Create a new admin account
 */
export const createAdminAccount = async (payload: CreateAdminPayload): Promise<AdminUserRecord> => {
  const res = await axiosInstance.post("/admin/users/create", payload);
  return res.data?.data;
};

/**
 * Update an existing admin's details & permissions
 */
export const updateAdminAccount = async (id: string, payload: UpdateAdminPayload): Promise<AdminUserRecord> => {
  const res = await axiosInstance.put(`/admin/users/${id}`, payload);
  return res.data?.data;
};

/**
 * Toggle admin active/disabled status
 */
export const toggleAdminStatus = async (id: string): Promise<{ success: boolean; isActive: boolean; message: string }> => {
  const res = await axiosInstance.put(`/admin/users/${id}/status`);
  return res.data;
};

/**
 * Reset admin password
 */
export const resetAdminPassword = async (id: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
  const res = await axiosInstance.put(`/admin/users/${id}/reset-password`, { newPassword });
  return res.data;
};

/**
 * Delete admin account
 */
export const deleteAdminAccount = async (id: string): Promise<{ success: boolean; message: string }> => {
  const res = await axiosInstance.delete(`/admin/users/${id}`);
  return res.data;
};
