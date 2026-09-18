import mongoose, { Document, Schema } from "mongoose";

/* ---------------- FILE ANSWER ---------------- */
interface FileAnswer {
  url: string;
  name: string;
  size: number;
  type: string;
  questionId: string;
  question: string;
}

/* ---------------- ANSWER ---------------- */
interface Answer {
  questionId: string;
  question: string;
  type:
    | "text"
    | "textarea"
    | "multiple-choice"
    | "checkbox"
    | "dropdown"
    | "yes-no"
    | "file"
    | "file-upload";
  answer: string | string[] | boolean | string[];
}

/* ---------------- APPLICATION ---------------- */
export interface IApplication extends Document {
  recruitmentId: mongoose.Types.ObjectId;
  answers: Answer[];
  files: FileAnswer[];
  status: "pending" | "reviewed" | "shortlisted" | "rejected";
  appliedAt: Date;
  notes?: string;
}

/* ---------------- SCHEMAS ---------------- */

const FileAnswerSchema = new Schema<FileAnswer>(
  {
    url: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
    questionId: { type: String, required: true },
    question: { type: String, required: true },
  },
  { _id: false }
);

const AnswerSchema = new Schema<Answer>(
  {
    questionId: { type: String, required: true },
    question: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        "text",
        "textarea",
        "multiple-choice",
        "checkbox",
        "dropdown",
        "yes-no",
        "file",
        "file-upload",
      ],
    },
    answer: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const ApplicationSchema = new Schema<IApplication>(
  {
    recruitmentId: {
      type: Schema.Types.ObjectId,
      ref: "Recruitment",
      required: true,
    },

    answers: {
      type: [AnswerSchema],
      default: [],
    },

    files: {
      type: [FileAnswerSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "shortlisted", "rejected", "accepted"],
      default: "pending",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

/* ---------------- INDEXES ---------------- */
// Fast admin filtering by recruitment
ApplicationSchema.index({ recruitmentId: 1 });

export default mongoose.model<IApplication>("Application", ApplicationSchema);