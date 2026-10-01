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

// Compound indexes to accelerate attendee lookups, scanner validation, duplicate checks, and attendance metrics
RegistrationSchema.index({ eventId: 1, createdAt: -1 });
RegistrationSchema.index({ eventId: 1, entry: 1 });
RegistrationSchema.index({ eventId: 1, "answers.email": 1 });
RegistrationSchema.index({ eventId: 1, "answers.register": 1 });


// Delete any previously cached model instance in hot-reload
if (mongoose.models && mongoose.models.EventRegistration) {
  delete mongoose.models.EventRegistration;
}

export default mongoose.model("EventRegistration", RegistrationSchema);