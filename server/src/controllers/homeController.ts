import { Request, Response } from "express";
import mongoose from "mongoose";
import Userquery, { IContact } from "../models/Contact";
import Contact from "../models/Contact";
import AdminSettings from "../models/AdminSettings";
import { sendContactMail } from "../utils/sendMail";

// Define error types for TypeScript
interface MongoError extends Error {
  name: string;
  code?: number;
  message: string;
}

interface ValidationError extends Error {
  name: string;
  message: string;
  errors?: Record<string, any>;
}

// Validation helper functions
const validateField = (name: string, value: string): string => {
  const trimmedValue = value?.trim() || '';

  switch (name) {
    case 'Firstname':
      if (!trimmedValue) return 'First name is required';
      if (trimmedValue.length < 2) return 'First name must be at least 2 characters';
      if (trimmedValue.length > 50) return 'First name must be less than 50 characters';
      if (!/^[A-Za-z\s]+$/.test(trimmedValue)) return 'First name can only contain letters and spaces';
      return '';

    case 'Lastname':
      if (!trimmedValue) return 'Last name is required';
      if (trimmedValue.length < 2) return 'Last name must be at least 2 characters';
      if (trimmedValue.length > 50) return 'Last name must be less than 50 characters';
      if (!/^[A-Za-z\s]+$/.test(trimmedValue)) return 'Last name can only contain letters and spaces';
      return '';

    case 'Email':
      if (!trimmedValue) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) return 'Please enter a valid email address';
      if (trimmedValue.length > 100) return 'Email must be less than 100 characters';
      return '';

    case 'Mobile':
      if (!trimmedValue) return 'Mobile number is required';
      if (!/^[0-9]{10}$/.test(trimmedValue)) return 'Please enter a valid 10-digit mobile number';
      return '';

    case 'Message':
      if (!trimmedValue) return 'Message is required';
      if (trimmedValue.length < 10) return 'Message must be at least 10 characters';
      if (trimmedValue.length > 1000) return 'Message must be less than 1000 characters';
      return '';

    default:
      return '';
  }
};

export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const { Firstname, Lastname, Email, Mobile, Message } = req.body;

    /* ---------------- VALIDATION ---------------- */
    const validationErrors: Record<string, string> = {};
    const fields = [
      { name: "Firstname", value: Firstname },
      { name: "Lastname", value: Lastname },
      { name: "Email", value: Email },
      { name: "Mobile", value: Mobile },
      { name: "Message", value: Message },
    ];

    fields.forEach(field => {
      const error = validateField(field.name, field.value);
      if (error) validationErrors[field.name] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    /* ---------------- SANITIZE ---------------- */
    const sanitizedData = {
      Firstname: Firstname.trim(),
      Lastname: Lastname.trim(),
      Email: Email.trim().toLowerCase(),
      Mobile: Mobile.trim(),
      Message: Message.trim(),
    };

    /* ---------------- SAVE TO DB ---------------- */
    const contact = await Contact.create(sanitizedData);
    const referenceId = contact._id.toString().slice(0, 8);
    const fullName = `${sanitizedData.Firstname} ${sanitizedData.Lastname}`;

    /* ---------------- ADMIN MAIL ---------------- */
    try {
      const submissionDate = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });

      const adminHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Notification</title>
  <style>
    @keyframes slideUpFade {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .animate-card {
      animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
            max-width:600px;
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
              padding: 30px 40px;
              text-align: left;
            ">
              <img
                src="https://res.cloudinary.com/dxpglrdwn/image/upload/v1767077893/acm-logo_x9u2js.png"
                alt="SIGAI Logo"
                width="48"
                height="48"
                style="
                  display: block;
                  margin-bottom: 15px;
                  border-radius: 10px;
                  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                "
              />
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">
                New Enquiry Received
              </h1>
              <p style="margin: 5px 0 0; color: #dbeafe; font-size: 14px; font-weight: 400;">
                Website Contact Form Submission
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">

              <div style="margin-bottom: 10px;">
                <span style="
                  font-size: 11px; 
                  text-transform: uppercase; 
                  letter-spacing: 1px; 
                  color: #94a3b8; 
                  font-weight: 700;
                ">
                  Applicant / Sender Details
                </span>
              </div>

              <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0;">
                <table width="100%" cellpadding="5" cellspacing="0" style="font-size: 14px; color: #334155;">
                  <tr>
                    <td width="30%" style="color: #94a3b8; font-weight: 500;">Full Name</td>
                    <td style="font-weight: 600;">${fullName}</td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8; font-weight: 500;">Email</td>
                    <td style="font-weight: 600;">
                      <a href="mailto:${sanitizedData.Email}" style="color: #3b82f6; text-decoration: none;">${sanitizedData.Email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="color: #94a3b8; font-weight: 500;">Mobile</td>
                    <td style="font-weight: 600;">${sanitizedData.Mobile}</td>
                  </tr>
                </table>
              </div>

              <div style="margin-top: 30px; margin-bottom: 10px;">
                <span style="
                  font-size: 11px; 
                  text-transform: uppercase; 
                  letter-spacing: 1px; 
                  color: #94a3b8; 
                  font-weight: 700;
                ">
                  Inquiry Message
                </span>
              </div>

              <div style="
                background: #fff; 
                border: 2px dashed #cbd5e1; 
                border-radius: 12px; 
                padding: 20px;
                color: #475569;
                font-size: 15px;
                line-height: 1.6;
                white-space: pre-wrap;
              ">
                ${sanitizedData.Message}
              </div>

              <div style="margin-top: 35px;">
                <a href="mailto:${sanitizedData.Email}?subject=Re: Inquiry: ${fullName} (SIST ACM SIGAI Student Chapter)" 
                   style="
                     background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
                     color: #ffffff;
                     text-decoration: none;
                     padding: 12px 30px;
                     border-radius: 50px;
                     font-size: 14px;
                     font-weight: 600;
                     display: inline-block;
                     box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
                   ">
                   Reply via Email
                </a>
              </div>

            </td>
          </tr>

          <tr>
            <td style="background-color: #f1f5f9; text-align: center; padding: 20px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 5px 0 0; font-size: 11px; color: #cbd5e1;">
                © ${new Date().getFullYear()} SIST ACM SIGAI STUDENT CHAPTER
              </p>
              <p style="margin: 5px 0 0; font-size: 11px; color: #cbd5e1;">
                Time Received: ${submissionDate}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

      await sendContactMail({
        to: process.env.CONTACT_MAIL_TO!,
        subject: `[Enquiry] ${fullName}`,
        html: adminHtml,
        replyTo: sanitizedData.Email,
      });
    } catch (adminMailError) {
      console.error("❌ Admin mail failed:", adminMailError);
    }

    /* ---------------- USER ACKNOWLEDGEMENT MAIL ---------------- */
    try {
      const userHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enquiry Acknowledgement</title>
  <style>
    @keyframes slideUpFade {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .animate-card {
      animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
            max-width:600px;
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
              padding: 30px 40px;
              text-align: center;
            ">
              <img
                src="https://res.cloudinary.com/dxpglrdwn/image/upload/v1767077893/acm-logo_x9u2js.png"
                alt="SIGAI Logo"
                width="60"
                height="60"
                style="
                  display: block;
                  margin: 0 auto 15px auto;
                  border-radius: 12px;
                  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                "
              />
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                Thank You for Contacting Us
              </h1>
              <p style="margin: 8px 0 0; color: #dbeafe; font-size: 14px; font-weight: 400;">
                We have received your enquiry
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px; color: #334155; font-size: 15px; line-height: 1.6;">

              <p style="margin-top: 0;">Hello <strong>${fullName}</strong>,</p>

              <p>
                Thank you for reaching out to the <strong>SIST ACM SIGAI STUDENT CHAPTER</strong>.
                We have successfully received your message and appreciate you contacting us.
              </p>

              <p>
                Our team is currently reviewing your query and will get back to you as soon as possible.
              </p>

              <div style="margin: 30px 0; border-top: 1px solid #e2e8f0;"></div>

              <p style="font-size: 13px; color: #94a3b8; margin-bottom: 25px;">
                <em>This is an automated acknowledgement email. Please do not reply directly to this message.</em>
              </p>

              <p style="margin-bottom: 0;">
                Warm regards,<br />
                <span style="color: #64748b; font-size: 14px;">SIST ACM SIGAI Student Chapter</span>
              </p>

            </td>
          </tr>

          <tr>
            <td style="background-color: #f1f5f9; text-align: center; padding: 20px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 5px 0 0; font-size: 11px; color: #cbd5e1;">
                © ${new Date().getFullYear()} SIST ACM SIGAI STUDENT CHAPTER
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

      await sendContactMail({
        to: sanitizedData.Email,
        subject: "We received your enquiry | SIST ACM SIGAI",
        html: userHtml,
      });
    } catch (userMailError) {
      console.error("❌ User mail failed:", userMailError);
    }

    /* ---------------- RESPONSE ---------------- */
    return res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      submissionId: contact._id,
      referenceId,
      timestamp: contact.createdAt,
    });

  } catch (error: unknown) {
    console.error("Contact form error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Database validation error",
        error: error.message,
      });
    }

    if (error instanceof Error && "code" in error && (error as any).code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate submission detected",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAdminSettings = async (_req: Request, res: Response) => {
  try {
    let settings = await AdminSettings.findOne();

    // If no settings exist, create default
    if (!settings) {
      settings = await AdminSettings.create({
        orgName: "SIST ACM SIGAI Student Chapter",
        about: "",
        mission: "",
        vision: "",
        ideology: "",
        contact: {
          location: "",
          email: "",
          phone: "",
        },
        socials: {
          instagram: "",
          linkedin: "",
          twitter: "",
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error: unknown) {
    console.error("Error fetching admin settings:", error);

    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch admin settings",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin settings",
    });
  }
};