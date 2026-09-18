import mongoose, { Document, Schema } from "mongoose";

/* ---------------- QUESTION TYPES ---------------- */
export interface IQuestionOption {
  id: string;
  label: string;
}

export interface IQuestionBase {
  id: string;
  type: 'text' | 'textarea' | 'multiple-choice' | 'checkbox' | 'dropdown' | 'yes-no' | 'file';
  question: string;
  required: boolean;
  description?: string;
}

export interface ITextQuestion extends IQuestionBase {
  type: 'text' | 'textarea';
  placeholder?: string;
  maxLength?: number;
  options?: never;
  minSelections?: never;
  maxSelections?: never;
  allowedFormats?: never;
  maxFileSize?: never;
  maxFiles?: never;
}

export interface IOptionBasedQuestion extends IQuestionBase {
  type: 'multiple-choice' | 'checkbox' | 'dropdown' | 'yes-no';
  options: IQuestionOption[];
  placeholder?: never;
  maxLength?: never;
  allowedFormats?: never;
  maxFileSize?: never;
  maxFiles?: never;
}

export interface ICheckboxQuestion extends IOptionBasedQuestion {
  type: 'checkbox';
  minSelections?: number;
  maxSelections?: number;
}

export interface IMultipleChoiceQuestion extends IOptionBasedQuestion {
  type: 'multiple-choice';
  minSelections?: never;
  maxSelections?: never;
}

export interface IDropdownQuestion extends IOptionBasedQuestion {
  type: 'dropdown';
  minSelections?: never;
  maxSelections?: never;
}

export interface IYesNoQuestion extends IOptionBasedQuestion {
  type: 'yes-no';
  minSelections?: never;
  maxSelections?: never;
}

export interface IFileQuestion extends IQuestionBase {
  type: 'file';
  placeholder?: never;
  maxLength?: never;
  options?: never;
  minSelections?: never;
  maxSelections?: never;
  allowedFormats?: string[];
  maxFileSize?: number;
  maxFiles?: number;
}

export type IQuestion = ITextQuestion | ICheckboxQuestion | IMultipleChoiceQuestion | IDropdownQuestion | IYesNoQuestion | IFileQuestion;

/* ---------------- RECRUITMENT TYPES ---------------- */
export interface IRecruitment extends Document {
  title: string;
  role: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isOpen: boolean;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionOptionSchema = new Schema({
  id: { type: String, required: true },
  label: { type: String, required: true }
});

const QuestionSchema = new Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['text', 'textarea', 'multiple-choice', 'checkbox', 'dropdown', 'yes-no', 'file']
  },
  question: { type: String, required: true },
  required: { type: Boolean, default: false },
  description: { type: String },
  placeholder: { type: String },
  maxLength: { type: Number },
  options: [QuestionOptionSchema],
  minSelections: { type: Number },
  maxSelections: { type: Number },
  allowedFormats: [{ type: String }],
  maxFileSize: { type: Number },
  maxFiles: { type: Number }
});

const RecruitmentSchema = new Schema<IRecruitment>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    isOpen: {
      type: Boolean,
      default: true,
    },

    questions: {
      type: [QuestionSchema],
      default: []
    },
  },
  { timestamps: true }
);

// Index for faster queries
RecruitmentSchema.index({ startDate: -1 });
RecruitmentSchema.index({ isOpen: 1 });
RecruitmentSchema.index({ title: 1 }, { unique: true });

export default mongoose.model<IRecruitment>(
  "Recruitment",
  RecruitmentSchema
);