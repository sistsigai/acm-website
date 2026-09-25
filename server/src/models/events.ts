import mongoose, { Schema, Document } from "mongoose";

export interface ContactPerson {
  name: string;
  phone: string;
  role?: string;
}

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

export interface EventDocument extends Document {
  name: string;
  date: string;
  time: string;
  registrationEndDate?: string | null;
  venue: string;
  description: string;
  contactPersons: ContactPerson[];
  registrationQuestions: string[];
  customQuestions?: IQuestion[];
  whatsappGroupLink?: string | null;
  thumbnailUrl?: string;
  thumbnailPublicId?: string;
  posterUrl?: string;
  posterPublicId?: string;
  isClosed: boolean;
  display: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactPersonSchema = new Schema<ContactPerson>(
  {
    name: { type: String },
    phone: { type: String },
    role: { type: String, default: "Student Coordinator" },
  },
  { _id: false }
);

const QuestionOptionSchema = new Schema({
  id: { type: String, required: true },
  label: { type: String, required: true }
}, { _id: false });

const QuestionSchema = new Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['text', 'textarea', 'multiple-choice', 'checkbox', 'dropdown', 'yes-no', 'file', 'date', 'time']
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
}, { _id: false });

const EventSchema = new Schema<EventDocument>(
  {
    name: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    registrationEndDate: { type: String, default: null },
    venue: { type: String, required: true },
    description: { type: String, required: true },

    contactPersons: {
      type: [ContactPersonSchema],
      default: [],
    },

    registrationQuestions: {
      type: [String],
      default: [],
    },

    customQuestions: {
      type: [QuestionSchema],
      default: [],
    },

    whatsappGroupLink: { type: String, default: null },

    thumbnailUrl: { type: String, default: null },
    thumbnailPublicId: { type: String, default: null },
    posterUrl: { type: String, default: null },
    posterPublicId: { type: String, default: null },

    isClosed: {
      type: Boolean,
      default: false,
    },

    display: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model<EventDocument>("Event", EventSchema);
export default Event;
