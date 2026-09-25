import { Request, Response } from "express";
import Event from "../models/events";
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

// --- TYPE DEFINITIONS ---
interface ContactPerson {
  name: string;
  phone: string;
  role?: string;
}

interface ValidationData {
  name?: string;
  date?: string;
  time?: string;
  registrationEndDate?: string;
  venue?: string;
  description?: string;
  contactPersons?: any[];
  registrationQuestions?: any[];
  whatsappGroupLink?: string;
}

// --- VALIDATION UTILITIES ---
const validateName = (name: string): string | null => {
  if (!name || !name.trim()) return "Event name is required";
  if (name.length < 3) return "Event name must be at least 3 characters";
  if (name.length > 100) return "Event name must be less than 100 characters";
  return null;
};

const validateDate = (date: string): string | null => {
  if (!date) return "Event date is required";
  
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(selectedDate.getTime())) {
    return "Invalid date format";
  }
  
  if (selectedDate < today) {
    return "Event date cannot be in the past";
  }
  
  return null;
};

const validateRegistrationEndDate = (regEndDate?: string, eventDate?: string): string | null => {
  if (!regEndDate || !regEndDate.trim()) return "Registration deadline is required";
  
  const selectedRegEnd = new Date(`${regEndDate}T00:00:00`);
  if (isNaN(selectedRegEnd.getTime())) {
    return "Invalid registration deadline format";
  }
  
  if (eventDate) {
    const selectedEventDate = new Date(`${eventDate}T00:00:00`);
    if (!isNaN(selectedEventDate.getTime()) && selectedRegEnd.getTime() > selectedEventDate.getTime()) {
      return "Registration deadline cannot be after the event date";
    }
  }
  
  return null;
};

const validateTime = (time: string): string | null => {
  if (!time || !time.trim()) return "Event time is required";
  
  const trimmed = time.trim();
  // Support single time (e.g. "02:30 PM", "2:30 PM") and time ranges (e.g. "02:30 PM - 04:30 PM", "2:30 PM to 4:30 PM")
  const singleTimeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s*(AM|PM)$/i;
  const timeRangeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9])\s*(AM|PM)\s*(-|–|—|to)\s*(0?[1-9]|1[0-2]):([0-5][0-9])\s*(AM|PM)$/i;

  if (!singleTimeRegex.test(trimmed) && !timeRangeRegex.test(trimmed)) {
    return "Time must be in HH:MM AM/PM format (e.g., 02:30 PM or 02:30 PM - 04:30 PM)";
  }
  
  return null;
};

const validateVenue = (venue: string): string | null => {
  if (!venue || !venue.trim()) return "Venue is required";
  if (venue.length < 3) return "Venue must be at least 3 characters";
  if (venue.length > 200) return "Venue must be less than 200 characters";
  return null;
};

const validateDescription = (description: string): string | null => {
  if (!description) return null; // Optional field
  
  if (description.length > 500) {
    return "Description must be less than 500 characters";
  }
  return null;
};

const validateContactPersons = (contactPersons: any[]): string[] => {
  const errors: string[] = [];
  
  if (!Array.isArray(contactPersons) || contactPersons.length === 0) {
    return ["At least one contact person is required"];
  }
  
  contactPersons.forEach((contact: any, index: number) => {
    if (!contact || typeof contact !== 'object') {
      errors[index] = `Contact ${index + 1} is invalid`;
      return;
    }
    
    // Validate name
    if (!contact.name || !contact.name.toString().trim()) {
      errors[index] = `Contact ${index + 1} name is required`;
    } else if (contact.name.toString().length < 2) {
      errors[index] = `Contact ${index + 1} name must be at least 2 characters`;
    } else if (contact.name.toString().length > 50) {
      errors[index] = `Contact ${index + 1} name must be less than 50 characters`;
    }
    
    // Validate phone (if name is valid)
    if (!errors[index]) {
      if (!contact.phone || !contact.phone.toString().trim()) {
        errors[index] = `Contact ${index + 1} phone number is required`;
      } else {
        // Remove +91 prefix for validation
        const cleanPhone = contact.phone.toString().replace(/^\+91/, '').trim();
        if (!/^\d{10}$/.test(cleanPhone)) {
          errors[index] = `Contact ${index + 1} phone must be 10 digits (e.g., 9876543210)`;
        }
      }
    }
  });
  
  return errors;
};

const validateRegistrationQuestions = (questions: any[]): string[] => {
  const errors: string[] = [];
  
  if (!Array.isArray(questions)) {
    return ["Registration questions must be an array"];
  }
  
  // Validate all questions
  questions.forEach((question: any, index: number) => {
    const qText = typeof question === "object" && question !== null ? question.question : String(question || "");
    if (!qText || !qText.toString().trim()) {
      errors[index] = `Question ${index + 1} cannot be empty`;
    } else if (qText.toString().length > 200) {
      errors[index] = `Question ${index + 1} must be less than 200 characters`;
    }
  });
  
  return errors;
};

const validateWhatsAppUrl = (url: string): string | null => {
  if (!url) return null; // Optional field
  
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return null;
  
  try {
    const urlObj = new URL(trimmedUrl);
    if (!urlObj.hostname.includes('chat.whatsapp.com')) {
      return "Must be a valid WhatsApp invite URL (chat.whatsapp.com)";
    }
  } catch {
    return "Please enter a valid URL";
  }
  
  return null;
};

const validateAllFields = (data: ValidationData, isUpdate: boolean = false): { errors: string[], fieldErrors: Record<string, string | string[]> } => {
  const errors: string[] = [];
  const fieldErrors: Record<string, string | string[]> = {};
  
  // For update, only validate fields that are provided
  // For create, validate all required fields
  
  if (!isUpdate || data.name !== undefined) {
    const nameError = validateName(data.name || '');
    if (nameError) {
      errors.push(nameError);
      fieldErrors.name = nameError;
    }
  }
  
  if (!isUpdate || data.date !== undefined) {
    const dateError = validateDate(data.date || '');
    if (dateError) {
      errors.push(dateError);
      fieldErrors.date = dateError;
    }
  }
  
  if (!isUpdate || data.registrationEndDate !== undefined) {
    const regEndError = validateRegistrationEndDate(data.registrationEndDate, data.date);
    if (regEndError) {
      errors.push(regEndError);
      fieldErrors.registrationEndDate = regEndError;
    }
  }
  
  if (!isUpdate || data.time !== undefined) {
    const timeError = validateTime(data.time || '');
    if (timeError) {
      errors.push(timeError);
      fieldErrors.time = timeError;
    }
  }
  
  if (!isUpdate || data.venue !== undefined) {
    const venueError = validateVenue(data.venue || '');
    if (venueError) {
      errors.push(venueError);
      fieldErrors.venue = venueError;
    }
  }
  
  if (data.description !== undefined) {
    const descError = validateDescription(data.description || '');
    if (descError) {
      errors.push(descError);
      fieldErrors.description = descError;
    }
  }
  
  if (data.whatsappGroupLink !== undefined) {
    const whatsappError = validateWhatsAppUrl(data.whatsappGroupLink || '');
    if (whatsappError) {
      errors.push(whatsappError);
      fieldErrors.whatsappGroupLink = whatsappError;
    }
  }
  
  if (!isUpdate || data.contactPersons !== undefined) {
    const contactErrors = validateContactPersons(data.contactPersons || []);
    if (contactErrors.length > 0) {
      errors.push(...contactErrors.filter(e => e));
      fieldErrors.contactPersons = contactErrors;
    }
  }
  
  if (!isUpdate || data.registrationQuestions !== undefined) {
    const questionErrors = validateRegistrationQuestions(data.registrationQuestions || []);
    if (questionErrors.length > 0) {
      errors.push(...questionErrors.filter(e => e));
      fieldErrors.registrationQuestions = questionErrors;
    }
  }
  
  return { errors: errors.filter(e => e), fieldErrors };
};

/* ───────────────── DIRECT CLOUDINARY UPLOAD FOR EVENTS ───────────────── */

export const uploadEventImage = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const { type } = req.body; // "thumbnail" or "poster"

    let sharpPipeline = sharp(req.file.buffer);

    if (type === "thumbnail") {
      // 16:9 banner
      sharpPipeline = sharpPipeline
        .resize(1280, 720, { fit: "cover", position: "center" })
        .jpeg({ quality: 85 });
    } else if (type === "poster") {
      // 3:4 portrait poster
      sharpPipeline = sharpPipeline
        .resize(900, 1200, { fit: "cover", position: "center" })
        .jpeg({ quality: 85 });
    } else {
      sharpPipeline = sharpPipeline.jpeg({ quality: 85 });
    }

    const processedImage = await sharpPipeline.toBuffer();
    const uploadResult = await uploadToCloudinary(processedImage, "events");

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: uploadResult.url,
      public_id: uploadResult.public_id,
    });
  } catch (error: any) {
    console.error("Event Cloudinary Upload Error:", error);
    return res.status(500).json({ success: false, message: "Cloudinary upload failed", error: error.message });
  }
};

/* ───────────────── DIRECT CLOUDINARY DELETE FOR EVENTS ───────────────── */

export const deleteEventImage = async (req: any, res: any) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ success: false, message: "public_id is required" });
    }

    const result = await cloudinary.uploader.destroy(public_id);
    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      result,
    });
  } catch (error: any) {
    console.error("Event Cloudinary Delete Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete image from Cloudinary",
      error: error.message,
    });
  }
};

export const addEvent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      name,
      date,
      time,
      registrationEndDate,
      venue,
      description,
      contactPersons,
      registrationQuestions,
      customQuestions,
      whatsappGroupLink,
      thumbnailUrl,
      thumbnailPublicId,
      posterUrl,
      posterPublicId,
    } = req.body;

    // 🔴 Comprehensive Validation
    const validation = validateAllFields({
      name,
      date,
      time,
      registrationEndDate,
      venue,
      description,
      contactPersons,
      registrationQuestions,
      whatsappGroupLink
    });
    
    if (validation.errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
        fieldErrors: validation.fieldErrors
      });
    }

    // Format registration questions from customQuestions or registrationQuestions
    const finalRegistrationQuestions = Array.isArray(customQuestions) && customQuestions.length > 0
      ? customQuestions.map((q: any) => (typeof q === "string" ? q : q.question || "")).filter(Boolean)
      : Array.isArray(registrationQuestions)
      ? registrationQuestions.map((q: any) => (typeof q === "string" ? q : q.question || "")).filter(Boolean)
      : [];

    // Format phone numbers with +91 prefix and preserve role
    const formattedContactPersons = (contactPersons || []).map((contact: any) => ({
      name: (contact?.name?.toString() || '').trim(),
      phone: contact?.phone ? `+91${contact.phone.toString().replace(/^\+91/, '').replace(/\D/g, '').slice(0, 10)}` : '',
      role: (contact?.role?.toString() || 'Student Coordinator').trim()
    })).filter((contact: { name: any; phone: any; }) => contact.name && contact.phone);

    const event = await Event.create({
      name: (name || '').trim(),
      date,
      time: (time || '').trim(),
      registrationEndDate: registrationEndDate?.trim() || null,
      venue: (venue || '').trim(),
      description: (description || '').trim(),
      contactPersons: formattedContactPersons,
      registrationQuestions: finalRegistrationQuestions,
      customQuestions: Array.isArray(customQuestions) ? customQuestions : [],
      whatsappGroupLink: whatsappGroupLink?.trim() || null,
      thumbnailUrl: thumbnailUrl || null,
      thumbnailPublicId: thumbnailPublicId || null,
      posterUrl: posterUrl || null,
      posterPublicId: posterPublicId || null,
      display: true
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error: any) {
    console.error("Add Event Error:", error);

    // Handle duplicate event names
    if (error.code === 11000 || error.keyPattern?.name) {
      return res.status(400).json({
        success: false,
        message: "An event with this name already exists"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getAllEvents = async (req: any, res: any) => {
  try {
    const events = await Event.find().sort({ createdAt: 1 });

    return res.json({
      success: true,
      events,
    });
  } catch (err: any) {
    console.error("Get Events Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ 
        success: false,
        message: "Event not found" 
      });
    }

    // Destroy Cloudinary media assets if present
    if (event.thumbnailPublicId) {
      await cloudinary.uploader.destroy(event.thumbnailPublicId).catch((e) => console.error("Error deleting event thumbnail:", e));
    }
    if (event.posterPublicId) {
      await cloudinary.uploader.destroy(event.posterPublicId).catch((e) => console.error("Error deleting event poster:", e));
    }

    await event.deleteOne();

    res.json({
      success: true,
      message: "Event deleted successfully",
      id,
    });
  } catch (error: any) {
    console.error("Delete Event Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ 
        success: false,
        message: "Event not found" 
      });
    }

    const {
      name,
      date,
      time,
      registrationEndDate,
      venue,
      description,
      contactPersons,
      registrationQuestions,
      customQuestions,
      whatsappGroupLink,
      thumbnailUrl,
      thumbnailPublicId,
      posterUrl,
      posterPublicId,
      display
    } = req.body;

    // Prepare data for validation (use existing values for fields not being updated)
    const validationData: ValidationData = {
      name: name !== undefined ? name : event.name,
      date: date !== undefined ? date : event.date,
      time: time !== undefined ? time : event.time,
      registrationEndDate: registrationEndDate !== undefined ? registrationEndDate : (event.registrationEndDate || undefined),
      venue: venue !== undefined ? venue : event.venue,
      description: description !== undefined ? description : event.description,
      contactPersons: contactPersons !== undefined ? contactPersons : event.contactPersons,
      registrationQuestions: registrationQuestions !== undefined ? registrationQuestions : event.registrationQuestions,
      whatsappGroupLink: whatsappGroupLink !== undefined ? whatsappGroupLink : event.whatsappGroupLink
    };

    // Validate fields (isUpdate = true)
    const validation = validateAllFields(validationData, true);
    
    if (validation.errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
        fieldErrors: validation.fieldErrors
      });
    }

    // --- Update only provided fields ---
    if (name !== undefined) event.name = name.trim();
    if (date !== undefined) event.date = date;
    
    // ✅ CRITICAL FIX: always normalize time
    if (time !== undefined) {
      event.time = String(time).trim();
    }

    if (registrationEndDate !== undefined) {
      event.registrationEndDate = registrationEndDate ? registrationEndDate.trim() : null;
    }
    
    if (venue !== undefined) event.venue = venue.trim();
    if (description !== undefined) event.description = description.trim();

    if (contactPersons !== undefined) {
      // Format phone numbers with +91 prefix and preserve role
      const formattedContactPersons = (contactPersons || []).map((contact: any) => ({
        name: (contact?.name?.toString() || '').trim(),
        phone: contact?.phone ? `+91${contact.phone.toString().replace(/^\+91/, '').replace(/\D/g, '').slice(0, 10)}` : '',
        role: (contact?.role?.toString() || 'Student Coordinator').trim()
      })).filter((contact: { name: any; phone: any; }) => contact.name && contact.phone);
      
      if (formattedContactPersons.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one valid contact person is required"
        });
      }
      
      event.contactPersons = formattedContactPersons;
    }

    if (registrationQuestions !== undefined) {
      event.registrationQuestions = Array.isArray(registrationQuestions)
        ? registrationQuestions.map((q: any) => (typeof q === "string" ? q : q.question || "")).filter(Boolean)
        : [];
    }

    if (customQuestions !== undefined) {
      event.customQuestions = Array.isArray(customQuestions) ? customQuestions : [];
      if (registrationQuestions === undefined) {
        event.registrationQuestions = event.customQuestions.map((q: any) => q.question || "").filter(Boolean);
      }
    }

    if (whatsappGroupLink !== undefined) {
      event.whatsappGroupLink = whatsappGroupLink?.trim() || null;
    }

    // Handle thumbnail replacement on Cloudinary
    if (thumbnailPublicId !== undefined) {
      if (event.thumbnailPublicId && event.thumbnailPublicId !== thumbnailPublicId) {
        await cloudinary.uploader.destroy(event.thumbnailPublicId).catch((e) => console.error("Error destroying old thumbnail:", e));
      }
      event.thumbnailUrl = thumbnailUrl || null;
      event.thumbnailPublicId = thumbnailPublicId || null;
    }

    // Handle poster replacement on Cloudinary
    if (posterPublicId !== undefined) {
      if (event.posterPublicId && event.posterPublicId !== posterPublicId) {
        await cloudinary.uploader.destroy(event.posterPublicId).catch((e) => console.error("Error destroying old poster:", e));
      }
      event.posterUrl = posterUrl || null;
      event.posterPublicId = posterPublicId || null;
    }
    
    if (display !== undefined) {
      if (typeof display !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: "Display must be a boolean value"
        });
      }
      event.display = display;
    }

    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });

  } catch (error: any) {
    console.error("Update Event Error:", error);
    
    // Handle duplicate event names
    if (error.code === 11000 || error.keyPattern?.name) {
      return res.status(400).json({
        success: false,
        message: "An event with this name already exists"
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const toggleEventDisplay = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { display } = req.body;

    if (typeof display !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "`display` must be boolean",
      });
    }

    const event = await Event.findByIdAndUpdate(
      id,
      { display },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Event ${display ? "shown" : "hidden"} successfully`,
      event,
    });
  } catch (error: any) {
    console.error("Toggle display error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating display",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};