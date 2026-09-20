/* ---------------- QUESTION & FORM BUILDER TYPES ---------------- */

export type QuestionType =
  | 'text'
  | 'textarea'
  | 'multiple-choice'
  | 'checkbox'
  | 'dropdown'
  | 'yes-no'
  | 'file'
  | 'date'
  | 'time';

export interface IQuestionOption {
  id: string;
  label: string;
}

export interface IQuestion {
  id: string;
  type: QuestionType;
  question: string;
  required: boolean;
  description?: string;
  placeholder?: string;
  maxLength?: number;
  options?: IQuestionOption[];
  minSelections?: number;
  maxSelections?: number;
  allowedFormats?: string[];
  maxFileSize?: number; // In MB
  maxFiles?: number;
}

/* ---------------- DEFAULT ACM STUDENT PRESETS ---------------- */
export const ACM_STANDARD_STUDENT_QUESTIONS: IQuestion[] = [
  {
    id: "acm_name",
    type: "text",
    question: "Full Name",
    required: true,
    placeholder: "e.g. John Doe",
  },
  {
    id: "acm_regno",
    type: "text",
    question: "Registration Number",
    required: true,
    placeholder: "e.g. 41110001",
  },
  {
    id: "acm_dept",
    type: "dropdown",
    question: "Department",
    required: true,
    options: [
      { id: "opt_cse", label: "CSE" },
      { id: "opt_it", label: "IT" },
      { id: "opt_ai_ds", label: "AI & DS" },
      { id: "opt_ece", label: "ECE" },
      { id: "opt_eee", label: "EEE" },
      { id: "opt_mech", label: "Mechanical" },
      { id: "opt_other", label: "Other" },
    ],
  },
  {
    id: "acm_year",
    type: "multiple-choice",
    question: "Year of Study",
    required: true,
    options: [
      { id: "yr_1", label: "1st Year" },
      { id: "yr_2", label: "2nd Year" },
      { id: "yr_3", label: "3rd Year" },
      { id: "yr_4", label: "4th Year" },
    ],
  },
  {
    id: "acm_section",
    type: "text",
    question: "Section",
    required: true,
    placeholder: "e.g. A, B, C",
  },
  {
    id: "acm_email",
    type: "text",
    question: "Official / Sathyabama Email ID",
    required: true,
    placeholder: "e.g. student@sathyabama.ac.in",
  },
  {
    id: "acm_phone",
    type: "text",
    question: "WhatsApp Phone Number",
    required: true,
    placeholder: "e.g. 9876543210",
  },
];
