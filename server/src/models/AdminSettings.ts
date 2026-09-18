import mongoose, { Document, Schema } from "mongoose";

export interface AdminSettingsDocument extends Document {
  orgName: string;

  about: string;
  mission: string;
  vision: string;
  ideology: string;

  contact: {
    location: string;
    email: string;
    phone: string;
  };

  socials: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const AdminSettingsSchema = new Schema<AdminSettingsDocument>(
  {
    /* -------- GENERAL -------- */
    orgName: {
      type: String,
      required: true,
      trim: true,
    },

    about: {
      type: String,
      default: "",
    },

    mission: {
      type: String,
      default: "",
    },

    vision: {
      type: String,
      default: "",
    },

    ideology: {
      type: String,
      default: "",
    },

    /* -------- CONTACT -------- */
    contact: {
      location: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
    },

    /* -------- SOCIALS -------- */
    socials: {
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<AdminSettingsDocument>(
  "AdminSettings",
  AdminSettingsSchema
);
