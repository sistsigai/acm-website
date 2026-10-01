import mongoose, { Document, Schema } from "mongoose";

export interface TimelineDocument extends Document {
  year: string;
  title: string;
  description: string;
  link: string;
  order: number;
  isActive: boolean;
  achievements: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TimelineSchema = new Schema<TimelineDocument>(
  {
    year: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      default: "",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    achievements: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

TimelineSchema.index({ order: 1, createdAt: -1 });

export default mongoose.model<TimelineDocument>("Timeline", TimelineSchema);
