import cloudinary from "./cloudinary";
import streamifier from "streamifier";

export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
}

/**
 * Shared helper to stream a memory buffer upload to Cloudinary.
 * Used across events, members, and media controllers.
 */
export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export default uploadToCloudinary;
