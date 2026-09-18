  import axiosInstance from "../axiosInstance";

  /* ---------------- ENHANCED TYPES ---------------- */

  export interface FileAnswer {
    url: string;
    name: string;
    size: number;
    type: string;
  }

  // Define AnswerValue type
  export type AnswerValue = string | boolean | string[] | FileAnswer[];

export interface Question {
    id: string;
    type: 'text' | 'textarea' | 'multiple-choice' | 'checkbox' | 'dropdown' | 'yes-no' | 'file-upload' | 'file'; // Add 'file'
    question: string;
    required: boolean;
    placeholder?: string;
    description?: string;
    maxLength?: number;
    minSelections?: number;
    maxSelections?: number;
    allowedFormats?: string[];
    maxFileSize?: number;
    maxFiles?: number;
    options?: { id: string; label: string; }[];
}
  export interface Answer {
    questionId: string;
    question: string;
    type: string;
    answer: AnswerValue;
  }

  export interface ApplicationData {
      recruitmentId: string;
      name?: string; // Make optional
      email?: string; // Make optional
      phone?: string; // Make optional
      resume?: string;
      answers: Answer[];
  }

  /* ---------------- API CALLS ---------------- */

  /**
   * Fetch all recruitments
   */
  export const getAllRecruitments = async () => {
    const res = await axiosInstance.get("/joinus/getall");
    return res.data;
  };

  /**
   * Fetch single recruitment by ID
   */
  export const getRecruitmentById = async (id: string) => {
    const res = await axiosInstance.get(`/joinus/recruitments/${id}`);
    return res.data;
  };

  /**
   * Upload files to Cloudinary
   */
  export const uploadFiles = async (files: FormData) => {
    const res = await axiosInstance.post("/joinus/upload-files", files, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  };

  /**
   * Submit application
   */
  export const submitApplication = async (applicationData: ApplicationData) => {
    const res = await axiosInstance.post("/joinus/applications/submit", applicationData);
    return res.data;
  };