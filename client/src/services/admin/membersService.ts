import axiosInstance from "../axiosInstance";

/* ---------------- TYPES ---------------- */

export interface MemberPayload {
  _id?: string;
  name: string;
  designation: string;
  batch: string;
  imageUrl?: string;
  imagePublicId?: string;
  profilePic?: File | string | null;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  social?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
}

/* ---------------- DIRECT CLOUDINARY UPLOAD WITH PROGRESS ---------------- */

export const uploadMemberImageDirect = async (
  file: Blob | File,
  onProgress?: (percent: number) => void
): Promise<{ url: string; public_id: string; message: string }> => {
  try {
    const formData = new FormData();
    formData.append("image", file, "member-portrait.jpg");

    const res = await axiosInstance.post("/admin/members/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(percent);
        }
      },
    });

    return res.data;
  } catch (err: any) {
    throw normalizeMemberError(err);
  }
};

/* ---------------- DIRECT CLOUDINARY DELETE ---------------- */

export const deleteMemberImageDirect = async (public_id: string): Promise<any> => {
  try {
    const res = await axiosInstance.post("/admin/members/delete-image", { public_id });
    return res.data;
  } catch (err: any) {
    console.error("Direct Cloudinary delete failed:", err);
    // Silent fail/log so popup closing isn't blocked if image is already gone
    return null;
  }
};

/* ---------------- CREATE MEMBER ---------------- */

export const createMember = async (data: MemberPayload) => {
  try {
    const linkedin = data.social?.linkedin || data.linkedin;
    const instagram = data.social?.instagram || data.instagram;
    const facebook = data.social?.facebook || data.facebook;

    // If already pre-uploaded to Cloudinary, send clean JSON payload
    if (data.imageUrl) {
      const res = await axiosInstance.post("/admin/members/add", {
        name: data.name,
        designation: data.designation,
        batch: data.batch,
        imageUrl: data.imageUrl,
        imagePublicId: data.imagePublicId,
        linkedin: linkedin?.trim() || undefined,
        instagram: instagram?.trim() || undefined,
        facebook: facebook?.trim() || undefined,
      });
      return res.data;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("designation", data.designation);
    formData.append("batch", data.batch);

    if (linkedin) formData.append("linkedin", linkedin);
    if (instagram) formData.append("instagram", instagram);
    if (facebook) formData.append("facebook", facebook);

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
    const linkedin = data.social?.linkedin ?? data.linkedin;
    const instagram = data.social?.instagram ?? data.instagram;
    const facebook = data.social?.facebook ?? data.facebook;

    // If pre-uploaded to Cloudinary, send clean JSON payload
    if (data.imageUrl) {
      const res = await axiosInstance.put(`/admin/members/${id}`, {
        name: data.name,
        designation: data.designation,
        batch: data.batch,
        imageUrl: data.imageUrl,
        imagePublicId: data.imagePublicId,
        linkedin: linkedin !== undefined ? linkedin.trim() : undefined,
        instagram: instagram !== undefined ? instagram.trim() : undefined,
        facebook: facebook !== undefined ? facebook.trim() : undefined,
      });
      return res.data;
    }

    const formData = new FormData();
    if (data.name !== undefined) formData.append("name", data.name);
    if (data.designation !== undefined) formData.append("designation", data.designation);
    if (data.batch !== undefined) formData.append("batch", data.batch);

    if (linkedin !== undefined) formData.append("linkedin", linkedin.trim());
    if (instagram !== undefined) formData.append("instagram", instagram.trim());
    if (facebook !== undefined) formData.append("facebook", facebook.trim());

    if (data.profilePic) {
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
