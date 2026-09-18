import axiosInstance from "../axiosInstance";
import axios from "axios";

/* ---------------- GET ALL MESSAGES ---------------- */
export const getMessages = async () => {
  try {
    const res = await axiosInstance.get("/admin/contacts/getMess");
    return res.data.messages;
  } catch (error) {
    throw extractError(error);
  }
};

/* ---------------- TOGGLE READ ---------------- */
export const toggleMessageRead = async (id: string) => {
  try {
    const res = await axiosInstance.patch(`/admin/contacts/${id}/read`);
    return res.data;
  } catch (error) {
    throw extractError(error);
  }
};

/* ---------------- DELETE MESSAGE ---------------- */
export const deleteMessage = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/admin/contacts/${id}/delete`);
    return res.data;
  } catch (error) {
    throw extractError(error);
  }
};

/* ---------------- AUTO REPLY ---------------- */
export const sendAutoReply = async (id: string) => {
  try {
    const res = await axiosInstance.post(`/admin/contacts/${id}/reply`);
    return res.data;
  } catch (error) {
    throw extractError(error);
  }
};

/* ---------------- ERROR EXTRACTOR ---------------- */
const extractError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    return new Error(
      error.response?.data?.message ||
      "Server error occurred"
    );
  }

  return new Error("Unexpected error occurred");
};
