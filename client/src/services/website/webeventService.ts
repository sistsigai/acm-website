import axiosInstance from "../axiosInstance";
import axios from "axios";

interface ContactPerson {
  name: string;
  phone: string;
}

export interface EventData {
  _id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  contactPersons: ContactPerson[];
  registrationQuestions: string[];
  whatsappGroupLink?: string;
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
