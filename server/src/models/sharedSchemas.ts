import { Schema } from "mongoose";

export interface IQuestionOption {
  id: string;
  label: string;
}

export interface IQuestion {
  id: string;
  type: 'text' | 'textarea' | 'multiple-choice' | 'checkbox' | 'dropdown' | 'yes-no' | 'file' | 'date' | 'time';
  question: string;
  required: boolean;
  description?: string;
  placeholder?: string;
  maxLength?: number;
  options?: IQuestionOption[];
  minSelections?: number;
  maxSelections?: number;
  allowedFormats?: string[];
  maxFileSize?: number;
  maxFiles?: number;
}

export const QuestionOptionSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

export const QuestionSchema = new Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['text', 'textarea', 'multiple-choice', 'checkbox', 'dropdown', 'yes-no', 'file', 'date', 'time'],
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
    maxFiles: { type: Number },
  },
  { _id: false }
);
