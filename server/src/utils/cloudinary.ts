import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Ensure environment variables are loaded even if this module is imported before server dotenv initialization
if (!process.env.CLOUDINARY_API_KEY) {
  const NODE_ENV = process.env.NODE_ENV || "development";
  const envFile = NODE_ENV === "production" ? ".env.production" : ".env.development";
  const envPath = path.resolve(process.cwd(), envFile);
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    dotenv.config();
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
