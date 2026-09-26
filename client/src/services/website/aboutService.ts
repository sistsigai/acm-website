import axiosInstance from "../axiosInstance";

/* ---------- TYPES ---------- */
export interface Member {
  _id: string;
  name: string;
  designation: string;
  batch: string;
  imageUrl: string;
  social?: {
    twitter: any;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
}

/* ---------- API ---------- */
export const getMembers = async () => {
    const response = await axiosInstance.get("/about/getallmem");
    return response.data;
};