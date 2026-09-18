import axiosInstance from "../axiosInstance";

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
  whatsappGroupLink?: string;
}

export type UpdateEventPayload = Partial<CreateEventPayload>;

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
