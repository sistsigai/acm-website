import { Request, Response } from "express";
import Member from "../models/Member";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary";
import streamifier from "streamifier";


/* ───────────────── CLOUDINARY HELPER ───────────────── */

const uploadToCloudinary = (
  buffer: Buffer,
  folder: string
): Promise<{ url: string; public_id: string }> => {
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

/* ───────────────── VALIDATIONS (UNCHANGED) ───────────────── */

const validateName = (name: string): string | null => {
  if (!name || !name.trim()) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (name.length > 50) return "Name must be less than 50 characters";
  if (!/^[a-zA-Z\s.'-]+$/.test(name))
    return "Name can only contain letters, spaces, and basic punctuation";
  return null;
};

const validateDesignation = (designation: string): string | null => {
  if (!designation) return "Designation is required";

  const validDesignations = [
    "Chairperson",
    "Vice Chairperson",
    "Treasurer",
    "Secretary",
    "Core Team Member",
    "HOD CSE",
    "Associate Professor",
    "Research Unit",
    "Media Unit",
    "Volunteer Unit",
  ];

  if (!validDesignations.includes(designation))
    return "Invalid designation selected";

  return null;
};

const validateBatch = (batch: string): string | null => {
  if (!batch) return "Batch is required";

  const validBatches = ["2024–2025", "2025–2026"];
  if (!validBatches.includes(batch)) return "Invalid batch selected";

  return null;
};

const validateLinkedInUrl = (url: string): string | null => {
  if (!url || !url.trim()) return null;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("linkedin.com"))
      return "Must be a valid LinkedIn URL (linkedin.com)";
  } catch {
    return "Please enter a valid LinkedIn URL";
  }
  return null;
};

const validateInstagramUrl = (url: string): string | null => {
  if (!url || !url.trim()) return null;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("instagram.com"))
      return "Must be a valid Instagram URL (instagram.com)";
  } catch {
    return "Please enter a valid Instagram URL";
  }
  return null;
};

const validateFacebookUrl = (url: string): string | null => {
  if (!url || !url.trim()) return null;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("facebook.com"))
      return "Must be a valid Facebook URL (facebook.com)";
  } catch {
    return "Please enter a valid Facebook URL";
  }
  return null;
};

const validateProfilePic = (file?: any): string | null => {
  if (!file) return null;

  if (file.size > 5 * 1024 * 1024)
    return "Image must be less than 5MB";

  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!validTypes.includes(file.mimetype))
    return "Only JPEG, PNG, and WebP images are allowed";

  return null;
};

const validateAllFields = (
  name: string,
  designation: string,
  batch: string,
  linkedin?: string,
  instagram?: string,
  facebook?: string,
  file?: any,
  isUpdate = false
): string[] => {
  const errors: string[] = [];

  const nameError = validateName(name);
  if (nameError) errors.push(nameError);

  const designationError = validateDesignation(designation);
  if (designationError) errors.push(designationError);

  const batchError = validateBatch(batch);
  if (batchError) errors.push(batchError);

  const linkedinError = validateLinkedInUrl(linkedin || "");
  if (linkedinError) errors.push(linkedinError);

  const instagramError = validateInstagramUrl(instagram || "");
  if (instagramError) errors.push(instagramError);

  const facebookError = validateFacebookUrl(facebook || "");
  if (facebookError) errors.push(facebookError);

  const imageError = validateProfilePic(file);
  if (!isUpdate && imageError) errors.push(imageError);
  if (isUpdate && file && imageError) errors.push(imageError);

  return errors;
};

/* ───────────────── CREATE MEMBER ───────────────── */

export const createMember = async (req: any, res: any) => {
  try {
    const { name, designation, batch, linkedin, instagram, facebook } = req.body;

    const errors = validateAllFields(
      name,
      designation,
      batch,
      linkedin,
      instagram,
      facebook,
      req.file
    );

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const processedImage = await sharp(req.file.buffer)
      .resize(522, 747, { fit: "cover", position: "center" })
      .jpeg({ quality: 85 })
      .toBuffer();

    const upload = await uploadToCloudinary(processedImage, "members");

    const member = await Member.create({
      name: name.trim(),
      designation,
      batch,
      imageUrl: upload.url,
      imagePublicId: upload.public_id,
      social: {
        linkedin: linkedin?.trim() || undefined,
        instagram: instagram?.trim() || undefined,
        facebook: facebook?.trim() || undefined,
      },
    });

    res.status(201).json(member);
  } catch (error: any) {
    console.error("Create Member Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/* ───────────────── GET MEMBERS ───────────────── */

export const getMembers = async (_req: Request, res: Response) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/* ───────────────── DELETE MEMBER ───────────────── */

export const deleteMember = async (req: Request, res: Response) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (member.imagePublicId) {
      await cloudinary.uploader.destroy(member.imagePublicId);
    }

    await member.deleteOne();
    res.json({ message: "Member deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/* ───────────────── UPDATE MEMBER ───────────────── */

export const updateMember = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, designation, batch, linkedin, instagram, facebook } = req.body;

    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const errors = validateAllFields(
      name || member.name,
      designation || member.designation,
      batch || member.batch,
      linkedin,
      instagram,
      facebook,
      req.file,
      true
    );

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    if (name !== undefined) member.name = name.trim();
    if (designation !== undefined) member.designation = designation;
    if (batch !== undefined) member.batch = batch;

    member.social = member.social || {};

    if (linkedin !== undefined)
      linkedin.trim()
        ? (member.social.linkedin = linkedin.trim())
        : delete member.social.linkedin;

    if (instagram !== undefined)
      instagram.trim()
        ? (member.social.instagram = instagram.trim())
        : delete member.social.instagram;

    if (facebook !== undefined)
      facebook.trim()
        ? (member.social.facebook = facebook.trim())
        : delete member.social.facebook;

    if (req.file) {
      if (member.imagePublicId) {
        await cloudinary.uploader.destroy(member.imagePublicId);
      }

      const processedImage = await sharp(req.file.buffer)
        .resize(522, 747, { fit: "cover", position: "center" })
        .jpeg({ quality: 85 })
        .toBuffer();

      const upload = await uploadToCloudinary(processedImage, "members");

      member.imageUrl = upload.url;
      member.imagePublicId = upload.public_id;
    }

    await member.save();
    res.json(member);
  } catch (error: any) {
    console.error("Update Member Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


/* ───────────────── DELETE SOCIAL LINK ───────────────── */

export const deleteMemberSocial = async (req: Request, res: Response) => {
  try {
    const { id, platform } = req.params;

    const allowedPlatforms = ["linkedin", "instagram", "facebook"] as const;
    if (!allowedPlatforms.includes(platform as any)) {
      return res.status(400).json({
        message: "Invalid social platform",
      });
    }

    const member = await Member.findById(id).select("name social");
    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    if (!member.social?.[platform as keyof typeof member.social]) {
      return res.status(400).json({
        message: `${platform} link does not exist for ${member.name}`,
      });
    }

    // ✅ MongoDB-native delete (THIS IS THE KEY)
    await Member.updateOne(
      { _id: id },
      { $unset: { [`social.${platform}`]: "" } }
    );

    return res.status(200).json({
      message: `${platform} link removed successfully for ${member.name}`,
    });
  } catch (error: any) {
    console.error("Delete Social Link Error:", error);
    return res.status(500).json({
      message: "Failed to remove social link",
    });
  }
};