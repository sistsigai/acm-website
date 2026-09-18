import mongoose, { Document, Schema } from "mongoose";

export interface IMember extends Document {
  name: string;
  designation: string;
  batch: string;
  imageUrl: string;
  imagePublicId: string
  social: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema = new Schema<IMember>(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    batch: { type: String, required: true },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, required: true },

    social: {
      linkedin: { type: String},
      instagram: { type: String},
      facebook: { type: String},
    },
  },
  { timestamps: true }
);

export default mongoose.model<IMember>("Member", MemberSchema);
