import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },

    name: { type: String, required: true, trim: true },
    registerNo: { type: String, required: true, trim: true },
    dept: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },

    answers: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },

    joinedWhatsapp: { type: Boolean, default: false },

    entry: { type: Boolean, default: false },
    checkedInAt: { type: Date, default: null },

    qrUrl: { type: String, default: null },
  },
  {
    timestamps: true,
    collection: "Eventregistrations", // ✅ EXACT collection name
  }
);

export default mongoose.model("EventRegistration", RegistrationSchema);