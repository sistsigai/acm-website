import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  Firstname: string;
  Lastname: string;
  Email: string;
  Mobile: string;
  Message: string;
  isRead: boolean;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    Firstname: { type: String, required: true, trim: true },
    Lastname: { type: String, required: true, trim: true },
    Email: { type: String, required: true, lowercase: true, trim: true },
    Mobile: { type: String, required: true, trim: true },
    Message: { type: String, required: true, trim: true },

    isRead: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<IContact>("Userquery", ContactSchema);
