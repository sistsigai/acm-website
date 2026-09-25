import axiosInstance from "../axiosInstance";
import type { IQuestion } from "../../types/formBuilder";

/* Types */
interface ContactPerson {
  name: string;
  phone: string;
  role?: string;
}

export interface CreateEventPayload {
  name: string;
  date: string;
  time: string;
  registrationEndDate?: string;
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

export interface EventItem {
  _id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  registrationEndDate?: string;
  display?: boolean;
  thumbnailUrl?: string;
  thumbnailPublicId?: string;
  posterUrl?: string;
  posterPublicId?: string;
  contactPersons?: ContactPerson[];
  registrationQuestions?: string[];
  customQuestions?: IQuestion[];
  whatsappGroupLink?: string;
  createdAt?: string;
  updatedAt?: string;
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
  } catch {
    try {
      const res = await axiosInstance.get("/events/getallmem");
      return {
        success: true,
        events: Array.isArray(res.data) ? res.data : (res.data?.events || []),
      };
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ||
        "Failed to fetch events"
      );
    }
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

/* ---------------- EVENT ATTENDANCE & REGISTRATIONS ---------------- */

export interface AttendeeRecord {
  _id: string;
  eventId: string;
  name: string;
  registerNo: string;
  dept: string;
  year: string;
  section: string;
  email: string;
  phone: string;
  answers?: Record<string, any>;
  entry: boolean;
  checkedInAt?: string | null;
  qrUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceMetrics {
  totalRegistered: number;
  totalPresent: number;
  totalAbsent: number;
  attendanceRate: number;
}

export interface GetRegistrationsResponse {
  success: boolean;
  registrations: AttendeeRecord[];
  metrics: AttendanceMetrics;
}

export const getEventRegistrations = async (
  eventId: string,
  params?: { search?: string; status?: "all" | "present" | "absent" }
): Promise<GetRegistrationsResponse> => {
  try {
    const res = await axiosInstance.get(`/events/${eventId}/registrations`, {
      params,
    });
    return res.data;
  } catch {
    try {
      const res = await axiosInstance.get(`/admin/eventmanager/${eventId}/registrations`, {
        params,
      });
      return res.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to fetch event registrations"
      );
    }
  }
};

export interface ScanQrResponse {
  success: boolean;
  alreadyCheckedIn: boolean;
  message: string;
  registration: AttendeeRecord;
  checkedInAt?: string;
}

export const scanAttendanceQr = async (
  eventId: string,
  qrData: string
): Promise<ScanQrResponse> => {
  try {
    const res = await axiosInstance.post(`/events/${eventId}/attendance/scan`, {
      qrData,
    });
    return res.data;
  } catch {
    try {
      const res = await axiosInstance.post(`/admin/eventmanager/${eventId}/attendance/scan`, {
        qrData,
      });
      return res.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to scan and verify QR ticket"
      );
    }
  }
};

export const toggleRegistrationAttendance = async (
  registrationId: string,
  entry: boolean
): Promise<{ success: boolean; message: string; registration: AttendeeRecord }> => {
  try {
    const res = await axiosInstance.put(
      `/events/registration/${registrationId}/attendance`,
      { entry }
    );
    return res.data;
  } catch {
    try {
      const res = await axiosInstance.put(
        `/admin/eventmanager/registration/${registrationId}/attendance`,
        { entry }
      );
      return res.data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Failed to update attendance status"
      );
    }
  }
};

export const deleteEventRegistration = async (
  registrationId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await axiosInstance.delete(
      `/admin/eventmanager/registration/${registrationId}`
    );
    return res.data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message || "Failed to delete attendee registration"
    );
  }
};

export const exportEventRegistrationsCsv = async (eventId: string, eventName: string): Promise<void> => {
  try {
    const res = await axiosInstance.get(`/admin/eventmanager/${eventId}/registrations/export`, {
      responseType: "blob",
    });
    const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const cleanName = eventName.replace(/[^a-zA-Z0-9_-]/g, "_");
    link.setAttribute("download", `${cleanName}_attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message || "Failed to download attendance CSV"
    );
  }
};