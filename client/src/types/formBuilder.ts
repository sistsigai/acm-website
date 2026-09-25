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
  isCompulsory?: boolean;
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
    isCompulsory: true,
    placeholder: "Enter your full name",
  },
  {
    id: "default_q_regno",
    type: "text",
    question: "Register Number",
    required: true,
    isCompulsory: true,
    placeholder: "e.g. 41110001",
  },
  {
    id: "default_q_email",
    type: "text",
    question: "Email ID",
    required: true,
    isCompulsory: true,
    placeholder: "e.g. student@sathyabama.ac.in",
  },
];

export const isCompulsoryQuestion = (q: IQuestion): boolean => {
  if (q.isCompulsory) return true;
  const qLower = (q.question || "").trim().toLowerCase();
  const idLower = (q.id || "").toLowerCase();
  if (
    idLower === "default_q_name" ||
    idLower === "default_q_regno" ||
    idLower === "default_q_email"
  ) {
    return true;
  }
  if (
    qLower === "full name" ||
    qLower === "name" ||
    qLower === "register number" ||
    qLower === "reg no" ||
    qLower === "register no" ||
    qLower === "email id" ||
    qLower === "email" ||
    qLower === "email address"
  ) {
    return true;
  }
  return false;
};

export const ensureCompulsoryQuestions = (questions: IQuestion[]): IQuestion[] => {
  if (!questions || questions.length === 0) {
    return [...DEFAULT_INITIAL_EVENT_QUESTIONS];
  }

  const result = [...questions];

  // Find existing compulsory questions
  const nameIdx = result.findIndex((q) => {
    const qL = (q.question || "").trim().toLowerCase();
    return q.id === "default_q_name" || qL === "full name" || qL === "name";
  });

  const regIdx = result.findIndex((q) => {
    const qL = (q.question || "").trim().toLowerCase();
    return q.id === "default_q_regno" || qL === "register number" || qL === "reg no" || qL === "register no";
  });

  const emailIdx = result.findIndex((q) => {
    const qL = (q.question || "").trim().toLowerCase();
    return q.id === "default_q_email" || qL === "email id" || qL === "email" || qL === "email address";
  });

  const compulsoryList: IQuestion[] = [];

  if (nameIdx >= 0) {
    compulsoryList.push({ ...result[nameIdx], required: true, isCompulsory: true });
  } else {
    compulsoryList.push(DEFAULT_INITIAL_EVENT_QUESTIONS[0]);
  }

  if (regIdx >= 0) {
    compulsoryList.push({ ...result[regIdx], required: true, isCompulsory: true });
  } else {
    compulsoryList.push(DEFAULT_INITIAL_EVENT_QUESTIONS[1]);
  }

  if (emailIdx >= 0) {
    compulsoryList.push({ ...result[emailIdx], required: true, isCompulsory: true });
  } else {
    compulsoryList.push(DEFAULT_INITIAL_EVENT_QUESTIONS[2]);
  }

  // Preserve other custom questions in their original relative order
  const otherQuestions = result.filter(
    (_, idx) => idx !== nameIdx && idx !== regIdx && idx !== emailIdx
  );

  return [...compulsoryList, ...otherQuestions];
};
