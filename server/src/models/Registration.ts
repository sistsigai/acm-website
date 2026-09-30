import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },

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
    collection: "Eventregistrations",
    strict: true,
  }
);

// Compound index to accelerate attendee lookups, scanner validation, and de-duplication
RegistrationSchema.index({ eventId: 1, createdAt: -1 });

// Delete any previously cached model instance in hot-reload
if (mongoose.models && mongoose.models.EventRegistration) {
  delete mongoose.models.EventRegistration;
}

export default mongoose.model("EventRegistration", RegistrationSchema);