import { Request, Response } from "express";
import Recruitment from "../models/recruitments";
import mongoose from "mongoose";
import Application from "../models/Application";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { sendEventMail } from "../utils/sendMail";
import path from "path";

import fs from "fs";

/* ---------------- FILE UPLOAD CONFIGURATION ---------------- */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const resumeDir = path.resolve(process.cwd(), "uploads/joinus/resumes");
    if (!fs.existsSync(resumeDir)) {
      fs.mkdirSync(resumeDir, { recursive: true });
    }
    cb(null, resumeDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

/* ---------------- GET ALL RECRUITMENTS ---------------- */
export const getAllRecruitments = async (req: Request, res: Response) => {
  try {
    const recruitments = await Recruitment.find({ isOpen: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, recruitments });
  } catch (error) {
    console.error("Get recruitments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recruitments",
    });
  }
};

/* ---------------- GET RECRUITMENT BY ID ---------------- */
export const getRecruitmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (Array.isArray(id) || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid recruitment ID format",
      });
      return;
    }

    const recruitment = await Recruitment.findById(id);
    if (!recruitment) {
      res.status(404).json({
        success: false,
        message: "Recruitment not found",
      });
      return;
    }

    res.status(200).json({ success: true, recruitment });
  } catch (error) {
    console.error("Get recruitment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recruitment",
    });
  }
};

/* ---------------- UPLOAD FILES ---------------- */
export const uploadFiles = async (req: any, res: any) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const uploadedFiles = (req.files as any[]).map(file => ({
      url: `/uploads/joinus/resumes/${file.filename}`,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    }));

    return res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("Upload files error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload files",
    });
  }
};

/* ---------------- VALIDATE ANSWERS ---------------- */
const validateAnswers = (questions: any[], answers: any[]) => {
  for (const q of questions) {
    const a = answers.find((x: any) => x.questionId === q.id);

    if (q.required && (!a || !a.answer || a.answer.length === 0)) {
      return `Required question "${q.question}" is not answered`;
    }

    if ((q.type === "text" || q.type === "textarea") && q.maxLength) {
      if ((a?.answer || "").length > q.maxLength) {
        return `"${q.question}" exceeds ${q.maxLength} characters`;
      }
    }
  }
  return null;
};

/* ---------------- EMAIL TEMPLATE ---------------- */
const joinUsMailTemplate = ({
  name,
  department,
}: {
  name: string;
  department: string;
}) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#ecf0f3;font-family:Segoe UI,sans-serif">
  <table width="100%" style="padding:40px 0">
    <tr><td align="center">
      <table style="max-width:440px;background:#fff;border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,.05)">
        <tr>
          <td style="background:linear-gradient(135deg,#1e293b,#3b82f6);padding:30px;text-align:center;color:#fff">
            <img src="https://res.cloudinary.com/dxpglrdwn/image/upload/v1767077893/acm-logo_x9u2js.png" width="60" />
            <h2>Application Received</h2>
            <p>SIST ACM SIGAI Student Chapter</p>
          </td>
        </tr>
        <tr>
          <td style="padding:30px;color:#334155">
            <p>Hello <strong>${name || "Applicant"}</strong>,</p>
            <p>
              Your application for the <strong>${department}</strong> position
              has been successfully submitted.
            </p>
            <p>
              Our team will review your details and contact you via this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f1f5f9;padding:20px;text-align:center;font-size:12px;color:#94a3b8">
            © ${new Date().getFullYear()} SIST ACM SIGAI Student Chapter
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;

/* ---------------- SUBMIT APPLICATION ---------------- */
export const submitApplication = async (req: Request, res: Response) => {
  try {
    const { recruitmentId, answers } = req.body;

    /* ---------- VALIDATE RECRUITMENT ID ---------- */
    if (!mongoose.Types.ObjectId.isValid(recruitmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recruitment ID",
      });
    }

    const recruitment = await Recruitment.findById(recruitmentId);
    if (!recruitment || !recruitment.isOpen) {
      return res.status(400).json({
        success: false,
        message: "Recruitment closed",
      });
    }

    /* ---------- VALIDATE ANSWERS ---------- */
    const validationError = validateAnswers(recruitment.questions, answers);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
        code: "VALIDATION_ERROR",
      });
    }

    /* ---------- EXTRACT EMAIL (OPTIONAL BUT SAFE) ---------- */
    const applicantEmail = answers.find(
      (a: any) =>
        typeof a.answer === "string" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.answer)
    )?.answer?.toLowerCase();

    /* ---------- PREVENT DUPLICATE APPLICATION ---------- */
    if (applicantEmail) {
      const existing = await Application.findOne({
        recruitmentId,
        answers: {
          $elemMatch: {
            answer: { $in: [applicantEmail] }
          }
        }
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          message: "You have already applied for this recruitment",
          code: "DUPLICATE_APPLICATION",
        });
      }
    }

    /* ---------- PROCESS FILE ANSWERS ---------- */
    const fileAnswers: any[] = [];

    const processedAnswers = answers.map((a: any) => {
      if (Array.isArray(a.answer) && (a.type === "file" || a.type === "file-upload")) {
        a.answer.forEach((f: any) =>
          fileAnswers.push({
            url: f.url,
            name: f.name,
            size: f.size,
            type: f.type,
            questionId: a.questionId,
            question: a.question,
          })
        );
        return { ...a, answer: a.answer.map((f: any) => f.url) };
      }
      return a;
    });

    /* ---------- CREATE APPLICATION ---------- */
    const application = await Application.create({
      recruitmentId,
      answers: processedAnswers,
      files: fileAnswers,
      status: "pending",
    });

    /* ---------- SEND CONFIRMATION EMAIL (NON-BLOCKING) ---------- */
    try {
      if (applicantEmail) {
        await sendEventMail({
          to: applicantEmail,
          subject: "Your Application Has Been Received",
          html: joinUsMailTemplate({
            name: answers.find((a: any) =>
              a.question?.toLowerCase().includes("name")
            )?.answer,
            department: recruitment.role,
          }),
        });
      }
    } catch (mailErr) {
      console.warn("Mail failed:", mailErr);
    }

    /* ---------- RESPONSE ---------- */
    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: {
        id: application._id,
        status: application.status,
      },
    });

  } catch (error: any) {
    console.error("Submit application error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit application",
      code: "SERVER_ERROR",
    });
  }
};


/* ---------------- EXPORT UPLOAD MIDDLEWARE ---------------- */
export const uploadMiddleware = upload.array("files", 10);
