import axiosInstance from "../axiosInstance";
import axios from "axios";
import type { IQuestion } from "../../types/formBuilder";

interface ContactPerson {
  name: string;
  phone: string;
  role?: string;
}

export interface EventData {
  _id: string;
  name: string;
  date: string;
  time: string;
  registrationEndDate?: string;
  venue: string;
  description: string;
  thumbnailUrl?: string;
  thumbnailPublicId?: string;
  posterUrl?: string;
  posterPublicId?: string;
  contactPersons: ContactPerson[];
  registrationQuestions: string[];
  customQuestions?: IQuestion[];
  whatsappGroupLink?: string;
  display?: boolean;
}

export interface EventRegistrationPayload {
  eventId: string;
  name: string;
  registerNo: string;
  dept: string;
  year: string;
  section: string;
  email: string;
  phone: string;
  answers: Record<string, string>;
}

/* ---------------- GET EVENTS ---------------- */

export const getAllEvents = async () => {
  try {
    const response = await axiosInstance.get("/events/getallmem");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
    throw new Error("Unexpected error while fetching events");
  }
};

/* ---------------- REGISTER EVENT ---------------- */

export const submitEventRegistration = async (
  payload: EventRegistrationPayload
) => {
  try {
    const response = await axiosInstance.post(
      "/events/register",
      payload
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // 🔥 IMPORTANT: this passes backend error message to UI
      throw new Error(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    }

    throw new Error("Unexpected error during registration");
  }
};

/* ---------------- UPLOAD REGISTRATION FILE ---------------- */
export interface UploadFileResponse {
  success: boolean;
  message: string;
  url: string;
  public_id: string;
  originalName: string;
  size: number;
  folder: string;
}

export const uploadEventRegistrationFile = async (
  eventId: string,
  file: File,
  onProgress?: (progressPercent: number) => void
): Promise<UploadFileResponse> => {
  try {
    const formData = new FormData();
    formData.append("eventId", eventId);
    formData.append("file", file);

    const response = await axiosInstance.post<UploadFileResponse>(
      "/events/upload-file",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "File upload failed. Please try again."
      );
    }
    throw new Error("Unexpected error during file upload");
  }
};
