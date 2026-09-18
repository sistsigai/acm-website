import axiosInstance from "../axiosInstance";

/* ---------------- TYPES ---------------- */
interface QuestionOption {
  id: string;
  label: string;
}

interface QuestionBase {
  id: string;
  type: 'text' | 'textarea' | 'multiple-choice' | 'checkbox' | 'dropdown' | 'yes-no' | 'file';
  question: string;
  required: boolean;
  description?: string;
}

interface TextQuestion extends QuestionBase {
  type: 'text' | 'textarea';
  placeholder?: string;
  maxLength?: number;
  options?: never;
  allowedFormats?: never;
  maxFileSize?: never;
  maxFiles?: never;
}

interface OptionBasedQuestion extends QuestionBase {
  type: 'multiple-choice' | 'checkbox' | 'dropdown' | 'yes-no';
  options: QuestionOption[];
  placeholder?: never;
  maxLength?: never;
  allowedFormats?: never;
  maxFileSize?: never;
  maxFiles?: never;
}

interface CheckboxQuestion extends OptionBasedQuestion {
  type: 'checkbox';
  minSelections?: number;
  maxSelections?: number;
}

interface MultipleChoiceQuestion extends OptionBasedQuestion {
  type: 'multiple-choice';
  minSelections?: never;
  maxSelections?: never;
}

interface DropdownQuestion extends OptionBasedQuestion {
  type: 'dropdown';
  minSelections?: never;
  maxSelections?: never;
}

interface YesNoQuestion extends OptionBasedQuestion {
  type: 'yes-no';
  minSelections?: never;
  maxSelections?: never;
}

interface FileQuestion extends QuestionBase {
  type: 'file';
  placeholder?: never;
  maxLength?: never;
  options?: never;
  allowedFormats?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  minSelections?: never;
  maxSelections?: never;
}

export type Question = TextQuestion | CheckboxQuestion | MultipleChoiceQuestion | DropdownQuestion | YesNoQuestion | FileQuestion;

export interface RecruitmentPayload {
  title: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  isOpen: boolean;
  questions?: Question[];
};

/* ---------------- GET ALL ---------------- */
export const getAllRecruitments = async () => {
  try {
    const res = await axiosInstance.get("/admin/recruitments/getall");
    return res.data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message ||
      "Failed to fetch recruitments"
    );
  }
};

/* ---------------- CREATE ---------------- */
export const createRecruitment = async (payload: RecruitmentPayload) => {
  try {
    const res = await axiosInstance.post("/admin/recruitments/add", payload);
    return res.data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.errors?.[0] ||
      err?.response?.data?.message ||
      "Failed to create recruitment"
    );
  }
};

/* ---------------- UPDATE ---------------- */
export const updateRecruitment = async (
  id: string,
  payload: RecruitmentPayload
) => {
  try {
    const res = await axiosInstance.put(
      `/admin/recruitments/${id}/update`,
      payload
    );
    return res.data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.errors?.[0] ||
      err?.response?.data?.message ||
      "Failed to update recruitment"
    );
  }
};

/* ---------------- DELETE ---------------- */
export const deleteRecruitment = async (id: string) => {
  try {
    const res = await axiosInstance.delete(
      `/admin/recruitments/${id}/delete`
    );
    return res.data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message ||
      "Failed to delete recruitment"
    );
  }
};

/* ---------------- TOGGLE STATUS ---------------- */
export const toggleRecruitmentStatus = async (
  id: string,
  isOpen: boolean
) => {
  try {
    const res = await axiosInstance.patch(
      `/admin/recruitments/${id}/status`,
      { isOpen }
    );
    return res.data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message ||
      "Failed to update recruitment status"
    );
  }
};