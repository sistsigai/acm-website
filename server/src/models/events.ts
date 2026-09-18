import mongoose, { Schema, Document } from "mongoose";

export interface ContactPerson {
  name: string;
  phone: string;
}

export interface EventDocument extends Document {
  name: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  contactPersons: ContactPerson[];
  registrationQuestions: string[];
  whatsappGroupLink?: string | null;
  isClosed: boolean;
  display: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactPersonSchema = new Schema<ContactPerson>(
  {
    name: { type: String },
    phone: { type: String },
  },
  { _id: false }
);

const EventSchema = new Schema<EventDocument>(
  {
    name: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
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

    whatsappGroupLink: { type: String, default: null },

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
