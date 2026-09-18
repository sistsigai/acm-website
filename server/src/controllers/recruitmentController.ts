import { Request, Response } from "express";
import mongoose from "mongoose";
import Recruitment, { IRecruitment, IQuestion } from "../models/recruitments";
import Application from "../models/Application";

/* ================= VALIDATION UTILITIES ================= */

const validateTitle = (title: string): string | null => {
  if (!title || !title.trim()) return "Title is required";
  if (title.length < 3) return "Title must be at least 3 characters";
  if (title.length > 100) return "Title must be less than 100 characters";
  return null;
};

const validateRole = (role: string): string | null => {
  if (!role || !role.trim()) return "Role is required";
  if (role.length < 2) return "Role must be at least 2 characters";
  if (role.length > 50) return "Role must be less than 50 characters";
  return null;
};

const validateDescription = (description: string): string | null => {
  if (!description) return null;
  if (description.length > 500) return "Description must be less than 500 characters";
  return null;
};

const validateStartDate = (date: string): string | null => {
  if (!date) return "Start date is required";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid date format";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d < today) return "Start date cannot be in the past";

  return null;
};

const validateEndDate = (endDate: string, startDate: string): string | null => {
  if (!endDate) return "End date is required";
  const end = new Date(endDate);
  const start = new Date(startDate);

  if (isNaN(end.getTime())) return "Invalid date format";
  if (end <= start) return "End date must be after start date";

  return null;
};

const validateDateRange = (startDate: string, endDate: string): string | null => {
  const diff = Math.ceil(
    Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  if (diff < 2) return "Recruitment must be at least 2 days long";
  return null;
};

const validateAllFields = (data: any): { errors: string[]; fieldErrors: Record<string, string> } => {
  const errors: string[] = [];
  const fieldErrors: Record<string, string> = {};

  const t = validateTitle(data.title);
  if (t) (errors.push(t), (fieldErrors.title = t));

  const r = validateRole(data.role);
  if (r) (errors.push(r), (fieldErrors.role = r));

  const d = validateDescription(data.description);
  if (d) (errors.push(d), (fieldErrors.description = d));

  const sd = validateStartDate(data.startDate);
  if (sd) (errors.push(sd), (fieldErrors.startDate = sd));

  const ed = validateEndDate(data.endDate, data.startDate);
  if (ed) (errors.push(ed), (fieldErrors.endDate = ed));

  const dr = validateDateRange(data.startDate, data.endDate);
  if (dr) (errors.push(dr), (fieldErrors.dateRange = dr));

  return { errors, fieldErrors };
};

/* ================= QUESTION SANITIZER ================= */

const sanitizeQuestions = (questions: any[] = []): IQuestion[] =>
  questions.map((q) => {
    const base: any = {
      id: q.id,
      type: q.type,
      question: q.question?.trim(),
      required: !!q.required,
      description: q.description?.trim() || undefined,
    };

    if (q.type === "text" || q.type === "textarea") {
      base.placeholder = q.placeholder?.trim();
      base.maxLength = q.maxLength || 100;
    }

    if (["multiple-choice", "checkbox", "dropdown", "yes-no"].includes(q.type)) {
      base.options =
        q.type === "yes-no"
          ? [
              { id: "1", label: "Yes" },
              { id: "2", label: "No" },
            ]
          : (q.options || [])
              .filter((o: any) => o.label?.trim())
              .map((o: any) => ({ id: o.id, label: o.label.trim() }));
    }

    if (q.type === "checkbox") {
      base.minSelections = q.minSelections || 0;
      base.maxSelections = q.maxSelections || base.options?.length || 1;
    }

    if (q.type === "file") {
      base.allowedFormats = q.allowedFormats || [];
      base.maxFileSize = q.maxFileSize || 10;
      base.maxFiles = q.maxFiles || 1;
    }

    return base as IQuestion;
  });

/* ================= GET ALL (WITH APPLICANT COUNT) ================= */

export const getAllRecruitments = async (_: Request, res: Response) => {
  try {
    const data = await Recruitment.aggregate([
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "recruitmentId",
          as: "applications",
        },
      },
      {
        $addFields: {
          applicantsCount: { $size: "$applications" },
        },
      },
      {
        $project: {
          applications: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json({ success: true, recruitments: data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch recruitments" });
  }
};

/* ================= CREATE ================= */

export const createRecruitment = async (req: Request, res: Response) => {
  try {
    const { title, role, description, startDate, endDate, isOpen, questions } = req.body;

    const validation = validateAllFields({ title, role, description, startDate, endDate });
    if (validation.errors.length) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
        fieldErrors: validation.fieldErrors,
      });
    }

    const recruitment = await Recruitment.create({
      title: title.trim(),
      role: role.trim(),
      description: description.trim(),
      startDate,
      endDate,
      isOpen: isOpen ?? true,
      questions: sanitizeQuestions(questions),
    });

    res.status(201).json({ success: true, recruitment });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Recruitment title already exists" });
    }
    res.status(500).json({ success: false, message: "Failed to create recruitment" });
  }
};

/* ================= UPDATE ================= */

export const updateRecruitment = async (req: Request, res: Response) => {
  try {
    const updated = await Recruitment.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        questions: req.body.questions ? sanitizeQuestions(req.body.questions) : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Recruitment not found" });
    }

    const applicantsCount = await Application.countDocuments({
      recruitmentId: updated._id,
    });

    res.status(200).json({
      success: true,
      recruitment: { ...updated.toObject(), applicantsCount },
    });
  } catch {
    res.status(500).json({ success: false, message: "Failed to update recruitment" });
  }
};

/* ================= DELETE ================= */

export const deleteRecruitment = async (req: Request, res: Response) => {
  const deleted = await Recruitment.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Recruitment not found" });
  }
  res.json({ success: true, message: "Recruitment deleted" });
};

/* ================= TOGGLE STATUS ================= */

export const toggleRecruitmentStatus = async (req: Request, res: Response) => {
  const updated = await Recruitment.findByIdAndUpdate(
    req.params.id,
    { isOpen: req.body.isOpen },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ success: false, message: "Recruitment not found" });
  }

  const applicantsCount = await Application.countDocuments({
    recruitmentId: updated._id,
  });

  res.json({
    success: true,
    recruitment: { ...updated.toObject(), applicantsCount },
  });
};
