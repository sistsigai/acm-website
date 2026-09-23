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

/* ---------------- DEFAULT INITIAL EVENT QUESTIONS ---------------- */
export const DEFAULT_INITIAL_EVENT_QUESTIONS: IQuestion[] = [
  {
    id: "default_q_name",
    type: "text",
    question: "Full Name",
    required: true,
    placeholder: "Enter your full name",
  },
  {
    id: "default_q_regno",
    type: "text",
    question: "Register Number",
    required: true,
    placeholder: "e.g. 41110001",
  },
  {
    id: "default_q_email",
    type: "text",
    question: "Email ID",
    required: true,
    placeholder: "e.g. student@sathyabama.ac.in",
  },
  {
    id: "default_q_phone",
    type: "text",
    question: "Phone Number",
    required: true,
    placeholder: "e.g. 9876543210",
  },
];
