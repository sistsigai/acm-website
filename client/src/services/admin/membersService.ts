import axiosInstance from "../axiosInstance";

/* ---------------- TYPES ---------------- */

export interface MemberPayload {
  name: string;
  designation: string;
  batch: string;
  profilePic?: File | null;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
}

/* ---------------- CREATE MEMBER ---------------- */

export const createMember = async (data: MemberPayload) => {
  try {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("designation", data.designation);
    formData.append("batch", data.batch);

    if (data.linkedin) formData.append("linkedin", data.linkedin);
    if (data.instagram) formData.append("instagram", data.instagram);
    if (data.facebook) formData.append("facebook", data.facebook);

    if (data.profilePic) {
      formData.append("profilePic", data.profilePic);
    }

    const res = await axiosInstance.post("/admin/members/add", formData);
    return res.data;
  } catch (err: any) {
    throw normalizeMemberError(err);
  }
};

/* ---------------- GET MEMBERS ---------------- */

export const getMembers = async () => {
  try {
    const res = await axiosInstance.get("/admin/members/getAll");
    return res.data;
  } catch (err: any) {
    throw normalizeMemberError(err);
  }
};

/* ---------------- DELETE MEMBER ---------------- */

export const deleteMember = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/admin/members/${id}`);
    return res.data;
  } catch (err: any) {
    throw normalizeMemberError(err);
  }
};

/* ---------------- UPDATE MEMBER ---------------- */

export const updateMember = async (
  id: string,
  data: Partial<MemberPayload>
) => {
  try {
    const formData = new FormData();

    if (data.name !== undefined) formData.append("name", data.name);
    if (data.designation !== undefined) formData.append("designation", data.designation);
    if (data.batch !== undefined) formData.append("batch", data.batch);

    formData.append("linkedin", data.linkedin?.trim() || "");
    formData.append("instagram", data.instagram?.trim() || "");
    formData.append("facebook", data.facebook?.trim() || "");

    if (data.profilePic instanceof File) {
      formData.append("profilePic", data.profilePic);
    }

    const res = await axiosInstance.put(`/admin/members/${id}`, formData);
    return res.data;
  } catch (err: any) {
    throw normalizeMemberError(err);
  }
};

/* ---------------- DELETE SOCIAL LINK ---------------- */

export const deleteMemberSocial = async (
  memberId: string,
  platform: "linkedin" | "instagram" | "facebook"
) => {
  try {
    const res = await axiosInstance.delete(
      `/admin/members/${memberId}/social/${platform}`
    );
    return res.data;
  } catch (err: any) {
    throw normalizeMemberError(err);
  }
};

/* ---------------- ERROR NORMALIZER ---------------- */

const normalizeMemberError = (err: any) => {
  const server = err?.response?.data;

  if (server?.errors && Array.isArray(server.errors)) {
    return {
      type: "validation",
      message: server.message || "Validation failed",
      errors: server.errors,
    };
  }

  if (server?.message) {
    return {
      type: "server",
      message: server.message,
    };
  }

  return {
    type: "network",
    message: "Unable to connect to server",
  };
};
