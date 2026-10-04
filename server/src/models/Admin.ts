import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

export type AdminRole = "superadmin" | "admin";
export type AdminPermission = "dashboard" | "members" | "events";

export interface IAdmin extends Document {
  username: string;
  email?: string;
  password: string;
  role: AdminRole;
  permissions: AdminPermission[];
  memberId?: mongoose.Types.ObjectId;
  name?: string;
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new mongoose.Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, default: "" },
    password: { type: String, required: true },
    role: { type: String, enum: ["superadmin", "admin"], default: "admin" },
    permissions: {
      type: [String],
      enum: ["dashboard", "members", "events"],
      default: ["dashboard", "events"],
    },
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member", default: null },
    name: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true }
);

// Hash password before saving if modified and not already bcrypt hashed
AdminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  // If already hashed with bcrypt, do not re-hash
  if (/^\$2[aby]\$\d{2}\$/.test(this.password)) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare password
AdminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IAdmin>("Admin", AdminSchema);

