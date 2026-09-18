import { Request, Response } from "express";
import mongoose from "mongoose";
import Event from "../models/events";
import Registration from "../models/Registration";
import QRCode from "qrcode";
import { sendEventMail } from "../utils/sendMail";
import cloudinary from "../utils/cloudinary";

// --- VALIDATION TYPES AND RULES ---

interface ValidationRule {
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  custom?: (value: string) => boolean;
  errorMessage: string;
}

interface ValidationErrors {
  [field: string]: string;
}

const validationRules: Record<string, ValidationRule> = {
  'name': {
    required: true,
    minLength: 2,
    maxLength: 100,
    errorMessage: 'Name must be 2-100 characters'
  },
  'register': {
    pattern: /^\d{8}$/, // Changed to exactly 8 digits
    required: true,
    errorMessage: 'Register number must be exactly 8 digits'
  },
  'year': {
    pattern: /^[1-4]$/,
    required: true,
    errorMessage: 'Year must be between 1-4'
  },
  'section': {
    pattern: /^[A-Z][1-9]$/,
    required: true,
    errorMessage: 'Section must be exactly one letter followed by one number (e.g. A1)'
  },
  'email': {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    required: true,
    errorMessage: 'Enter a valid email address'
  },
  'phone': {
    pattern: /^\d{10}$/,
    required: true,
    errorMessage: 'Mobile number must be 10 digits'
  },
  'department': {
    required: true,
    minLength: 2,
    maxLength: 100,
    errorMessage: 'Department is required'
  }
};

// --- INPUT SANITIZATION HELPER ---
const sanitizeInput = (value: string, fieldType: string): string => {
  let sanitized = value.trim();

  switch (fieldType) {
    case 'name':
      // Remove excessive whitespace, allow letters, spaces, and basic punctuation
      sanitized = sanitized.replace(/\s+/g, ' ').replace(/[^a-zA-Z\s\-'.]/g, '');
      break;
    case 'email':
      sanitized = sanitized.toLowerCase().trim();
      break;
    case 'register':
    case 'phone':
      // Remove all non-digits
      sanitized = sanitized.replace(/\D/g, '');
      break;
    case 'section':
      sanitized = sanitized.toUpperCase().trim();
      break;
    case 'year':
      sanitized = sanitized.replace(/\D/g, ''); // Keep only digits
      break;
    case 'department':
      sanitized = sanitized.replace(/\s+/g, ' ').trim();
      break;
    default:
      // General sanitization for other fields
      sanitized = sanitized.replace(/\s+/g, ' ').trim();
      break;
  }

  return sanitized;
};

// --- VALIDATION HELPER FUNCTION ---
const validateField = (fieldName: string, value: string): string => {
  const lowerField = fieldName.toLowerCase();
  let rule: ValidationRule | undefined;

  // Find matching rule
  Object.entries(validationRules).forEach(([key, valRule]) => {
    if (lowerField.includes(key)) {
      rule = valRule;
    }
  });

  if (!rule) {
    // No specific rule, just check if required
    if (!value.trim() && /required/i.test(fieldName)) {
      return 'This field is required';
    }
    return '';
  }

  // Check required
  if (rule.required && !value.trim()) {
    return rule.errorMessage;
  }

  // Check pattern
  if (rule.pattern && value.trim() && !rule.pattern.test(value.trim())) {
    return rule.errorMessage;
  }

  // Check length
  if (rule.minLength && value.trim().length < rule.minLength) {
    return rule.errorMessage;
  }

  if (rule.maxLength && value.trim().length > rule.maxLength) {
    return rule.errorMessage;
  }

  // Custom validation
  if (rule.custom && !rule.custom(value.trim())) {
    return rule.errorMessage;
  }

  return '';
};

// --- COMPREHENSIVE VALIDATION FUNCTION ---
const validateRegistrationData = (body: any): { isValid: boolean; errors: ValidationErrors; sanitizedData: any } => {
  const errors: ValidationErrors = {};
  const sanitizedData: any = {};

  // Map field names to standardized keys
  const fieldMapping: Record<string, string> = {
    'name': 'name',
    'full name': 'name',
    'register': 'registerNo',
    'register number': 'registerNo',
    'register no': 'registerNo',
    'dept': 'dept',
    'department': 'dept',
    'year': 'year',
    'section': 'section',
    'email': 'email',
    'email id': 'email',
    'phone': 'phone',
    'mobile number': 'phone',
    'mobile': 'phone'
  };

  // Validate and sanitize core fields
  const coreFields = ['name', 'registerNo', 'dept', 'year', 'section', 'email', 'phone'];

  coreFields.forEach(field => {
    // Find the field in the body (check multiple possible keys)
    let value = '';
    Object.keys(fieldMapping).forEach(key => {
      if (fieldMapping[key] === field && body[key]) {
        value = body[key];
      }
    });

    // If not found in mapped keys, check direct field name
    if (!value && body[field]) {
      value = body[field];
    }

    // Sanitize based on field type
    const sanitizedValue = sanitizeInput(value || '', field);
    sanitizedData[field] = sanitizedValue;

    // Validate
    const error = validateField(field, sanitizedValue);
    if (error) {
      errors[field] = error;
    }
  });

  // Validate additional answers (if any)
  if (body.answers && typeof body.answers === 'object') {
    sanitizedData.answers = {};
    Object.keys(body.answers).forEach(key => {
      const value = body.answers[key];
      const sanitizedValue = sanitizeInput(value || '', 'text');
      sanitizedData.answers[key] = sanitizedValue;

      // Check if required
      if (key.toLowerCase().includes('required') && !sanitizedValue.trim()) {
        errors[key] = 'This field is required';
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  };
};

/* ---------------- GET EVENTS ---------------- */

export const getAllEvents = async (_req: Request, res: Response) => {
  try {
    const events = await Event.find({ display: true }).sort({ createdAt: 1 });
    return res.json({ success: true, events });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
};

/* ---------------- REGISTER USER ---------------- */

interface EventRegistrationBody {
  eventId: string;
  name: string;
  registerNo: string;
  dept: string;
  year: string;
  section: string;
  email: string;
  phone: string;
  answers: Record<string, any>;
}

export const registerForEvent = async (
  req: Request<{}, {}, EventRegistrationBody>,
  res: Response
) => {
  try {
    const { eventId, answers } = req.body;

    /* ---------------- COMPREHENSIVE VALIDATION ---------------- */
    // Step 1: Basic required field validation
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    // Step 2: Validate event ID format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID format",
      });
    }

    // Step 3: Comprehensive data validation
    const validationResult = validateRegistrationData(req.body);

    if (!validationResult.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.errors
      });
    }

    const { sanitizedData } = validationResult;
    const { name, registerNo, dept, year, section, email, phone } = sanitizedData;

    /* ---------------- CHECK EVENT ---------------- */
    const event = await Event.findById(eventId).lean();
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Additional validation: Check if event is closed
    const currentDate = new Date();
    const eventDateTime = new Date(event.date + ' ' + event.time);

    if (eventDateTime < currentDate) {
      return res.status(400).json({
        success: false,
        message: "Event registration is closed. The event has already passed.",
      });
    }

    /* ---------------- DUPLICATE CHECK ---------------- */
    // Check by email
    const alreadyRegisteredByEmail = await Registration.findOne({ eventId, email });
    if (alreadyRegisteredByEmail) {
      return res.status(409).json({
        success: false,
        message: "This email has already been registered for this event",
      });
    }

    // Check by register number
    const alreadyRegisteredByRegNo = await Registration.findOne({ eventId, registerNo });
    if (alreadyRegisteredByRegNo) {
      return res.status(409).json({
        success: false,
        message: "This register number has already been registered for this event",
      });
    }

    /* ---------------- SAVE REGISTRATION ---------------- */
    const registration = await Registration.create({
      eventId,
      name,
      registerNo,
      dept,
      year,
      section,
      email,
      phone,
      answers: sanitizedData.answers || {},
    });

    /* ---------------- GENERATE QR ---------------- */
    const qrPayload = Buffer.from(
      JSON.stringify({
        registrationId: registration._id.toString(),
        email,
        eventId,
        timestamp: Date.now()
      })
    ).toString("base64");

    const qrBase64 = await QRCode.toDataURL(qrPayload);

    /* ---------------- UPLOAD QR TO CLOUDINARY ---------------- */
    const uploadResult = await cloudinary.uploader.upload(qrBase64, {
      folder: "event_qr_codes",
      public_id: `event_${eventId}_${registration._id}`,
      resource_type: "image",
      overwrite: false,
    });

    /* ---------------- SAVE QR URL ---------------- */
    registration.qrUrl = uploadResult.secure_url;
    await registration.save();

    /* ---------------- SEND CONFIRMATION EMAIL ---------------- */
    await sendEventMail({
      to: email,
      subject: `Registration Confirmed | ${event.name}`,
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @keyframes slideUpFade {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    .animate-card {
      animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
    }

    .animate-qr {
      animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
      opacity: 0;
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#ecf0f3; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ecf0f3; padding:40px 0;">
    <tr>
      <td align="center">

        <table class="animate-card" cellpadding="0" cellspacing="0" border="0"
          style="
            width:100%;
            max-width:440px;
            background:#ffffff;
            border-radius:16px;
            overflow:hidden;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05), 0 5px 10px rgba(0,0,0,0.01);
            border: 1px solid #ffffff;
            opacity: 1; 
          "
        >

          <tr>
            <td style="
              background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
              padding: 30px 20px;
              text-align: center;
            ">
              <img
  src="https://res.cloudinary.com/dxpglrdwn/image/upload/v1767077893/acm-logo_x9u2js.png"
  alt="SIGAI Logo"
  width="60"
  height="60"
  style="
    display: block;
    margin: 0 auto 12px auto;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  "
/>
              
              <h1 style="margin: 10px 0 5px; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                Registration Confirmed
              </h1>
              <p style="margin: 0; color: #dbeafe; font-size: 15px; font-weight: 400;">
                See you at the event, ${event.name}!
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 25px; text-align: center;">

              <p style="color: #64748b; font-size: 14px; margin: 0 0 20px; line-height: 1.6;">
                Your seat has been reserved. Please present the QR code below at the registration desk for seamless entry.
              </p>

              <div class="animate-qr" style="
                background: #ffffff; 
                padding: 15px; 
                border: 2px dashed #cbd5e1; 
                border-radius: 12px; 
                display: inline-block;
                opacity: 1;
              ">
                <img src="${uploadResult.secure_url}" width="180" height="180" alt="Entry QR Code" 
                  style="display: block; border-radius: 8px;"
                />
              </div>

              <div style="margin-top: 20px;">
                <span style="
                  background: #fff1f2; 
                  border: 1px solid #fecdd3; 
                  color: #be123c; 
                  font-size: 11px; 
                  font-weight: 600; 
                  padding: 6px 12px; 
                  border-radius: 20px; 
                  letter-spacing: 0.5px;
                  text-transform: uppercase;
                ">
                  Entry Ticket
                </span>
              </div>

              <div style="margin-top: 30px; background: #f8fafc; border-radius: 12px; padding: 20px; text-align: left;">
                <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px; color: #334155;">
                  <tr>
                    <td width="35%" style="color: #94a3b8; font-weight: 500;">Name</td>
                    <td style="font-weight: 600;">${name}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8; font-weight: 500;">Reg No</td>
                    <td style="font-weight: 600;">${registerNo}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8; font-weight: 500;">Department</td>
                    <td style="font-weight: 600;">${dept}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8; font-weight: 500;">Class</td>
                    <td style="font-weight: 600;">Year ${year} - Section ${section}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8; font-weight: 500;">Event</td>
                    <td style="font-weight: 600;">${event.name}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8; font-weight: 500;">Date & Time</td>
                    <td style="font-weight: 600;">${event.date} at ${event.time}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8; font-weight: 500;">Venue</td>
                    <td style="font-weight: 600;">${event.venue}</td>
                  </tr>
                </table>
              </div>

              <div style="margin-top: 25px; padding: 15px; background: #fef3c7; border-radius: 10px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
                  <strong>Important:</strong> Please present this QR code for verification at the venue.
                </p>
              </div>

            </td>
          </tr>

          <tr>
            <td style="background-color: #f1f5f9; text-align: center; padding: 20px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                © ${new Date().getFullYear()} SIST ACM SIGAI STUDENT CHAPTER
              </p>
              <p style="margin: 5px 0 0; font-size: 11px; color: #cbd5e1;">
                Sathyabama Institute of Science and Technology
              </p>
            </td>
          </tr>

        </table>
        </td>
    </tr>
  </table>
</body>
</html>`,
    });

    /* ---------------- RESPONSE ---------------- */
    return res.status(201).json({
      success: true,
      message: "Registration successful. Confirmation email sent.",
      registrationId: registration._id,
      qrUrl: uploadResult.secure_url,
      data: {
        name,
        registerNo,
        dept,
        year,
        section,
        email,
        phone,
        eventName: event.name,
        eventDate: event.date,
        eventTime: event.time,
        venue: event.venue
      }
    });
  } catch (error: any) {
    console.error("❌ Event registration error:", error);

    // Handle specific error cases
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate registration detected. You may have already registered.",
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Data validation failed",
        errors: error.errors
      });
    }

    if (error.message?.includes('Cloudinary')) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate QR code. Please try again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};