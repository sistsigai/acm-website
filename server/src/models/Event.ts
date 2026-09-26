import mongoose, { Schema, Document } from "mongoose";

export interface ContactPerson {
  name: string;
  phone: string;
  role?: string;
}

import { IQuestion, QuestionSchema } from "./sharedSchemas";
export type { IQuestion, IQuestionOption } from "./sharedSchemas";

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
