import axiosInstance from "../axiosInstance";
import type { IQuestion } from "../../types/formBuilder";

/* Types */
interface ContactPerson {
  name: string;
  phone: string;
}

export interface CreateEventPayload {
  name: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  contactPersons: ContactPerson[];
  registrationQuestions: string[];
  customQuestions?: IQuestion[];
  whatsappGroupLink?: string;
  thumbnailUrl?: string;
  thumbnailPublicId?: string;
  posterUrl?: string;
  posterPublicId?: string;
}

export type UpdateEventPayload = Partial<CreateEventPayload>;

/* ---------------- DIRECT CLOUDINARY UPLOAD WITH PROGRESS ---------------- */
export const uploadEventImageDirect = async (
  file: Blob | File,
  type: "thumbnail" | "poster",
  onProgress?: (percent: number) => void
): Promise<{ url: string; public_id: string; message: string }> => {
  try {
    const formData = new FormData();
    formData.append("image", file, type === "thumbnail" ? "event-thumbnail.jpg" : "event-poster.jpg");
    formData.append("type", type);

    const res = await axiosInstance.post("/admin/eventmanager/upload-image", formData, {
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
    throw new Error(
      err?.response?.data?.message ||
      "Failed to upload image"
    );
  }
};

/* ---------------- DIRECT CLOUDINARY DELETE ---------------- */
export const deleteEventImageDirect = async (public_id: string): Promise<any> => {
  try {
    const res = await axiosInstance.post("/admin/eventmanager/delete-image", { public_id });
    return res.data;
  } catch (err: any) {
    console.error("Direct Cloudinary delete failed:", err);
    return null;
  }
};

/* ---------------- CREATE EVENT ---------------- */
export const createEvent = async (payload: CreateEventPayload) => {
  try {
    const res = await axiosInstance.post("/admin/eventmanager/add", payload);
    return res.data; // { success, message, data }
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message ||
      err?.response?.data?.errors?.[0] ||
      "Failed to create event"
    );
  }
};

/* ---------------- GET ALL EVENTS ---------------- */
export const getAllEvents = async () => {
  try {
    const res = await axiosInstance.get("/admin/eventmanager/getAll");
    return res.data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message ||
      "Failed to fetch events"
    );
  }
};

/* ---------------- DELETE EVENT ---------------- */
export const deleteEvent = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/admin/eventmanager/${id}`);
    return res.data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message ||
      "Failed to delete event"
    );
  }
};

/* ---------------- UPDATE EVENT ---------------- */
export const updateEvent = async (
  id: string,
  payload: UpdateEventPayload
) => {
  try {
    const res = await axiosInstance.put(
      `/admin/eventmanager/${id}`,
      payload
    );
    return res.data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message ||
      err?.response?.data?.errors?.[0] ||
      "Failed to update event"
    );
  }
};

/* ---------------- TOGGLE DISPLAY ---------------- */
export const toggleEventDisplay = async (
  id: string,
  display: boolean
) => {
  try {
    const res = await axiosInstance.put(
      `/admin/eventmanager/${id}/display`,
      { display }
    );
    return res.data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message ||
      "Failed to update event visibility"
    );
  }
};
