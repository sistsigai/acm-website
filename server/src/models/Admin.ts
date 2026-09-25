import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  username: string;
  password: string;
  role: string;
  isActive: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new mongoose.Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    isActive: { type: Boolean, default: true },
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
  const isBcryptHash = /^\$2[aby]\$\d{2}\$/.test(this.password);
  if (isBcryptHash) {
    return bcrypt.compare(candidatePassword, this.password);
  }
  // Plaintext fallback
  return candidatePassword === this.password;
};

export default mongoose.model<IAdmin>("Admin", AdminSchema);
