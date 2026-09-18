import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Application, { IApplication } from '../models/Application';
import Recruitment, { IRecruitment } from '../models/recruitments';

interface ApplicantInfo {
  name: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
}

// Extract applicant information from answers
const extractApplicantInfo = (application: IApplication): ApplicantInfo => {
  const info: ApplicantInfo = {
    name: '',
    email: '',
    phone: '',
    resume: '',
    coverLetter: ''
  };

  application.answers.forEach(answer => {
    const questionLower = answer.question.toLowerCase();

    if (questionLower.includes('name') || questionLower.includes('full name')) {
      info.name = answer.answer as string;
    }
    else if (questionLower.includes('email')) {
      info.email = answer.answer as string;
    }
    else if (questionLower.includes('phone') || questionLower.includes('mobile') || questionLower.includes('contact')) {
      info.phone = answer.answer as string;
    }
    else if ((questionLower.includes('resume') || questionLower.includes('cv')) && answer.type === 'file') {
      if (Array.isArray(answer.answer) && answer.answer.length > 0) {
        info.resume = answer.answer[0] as string;
      } else if (typeof answer.answer === 'string') {
        info.resume = answer.answer;
      }
    }
    else if (questionLower.includes('cover') && questionLower.includes('letter')) {
      if (answer.type === 'textarea' || answer.type === 'text') {
        info.coverLetter = answer.answer as string;
      }
    }
  });

  if (!info.resume && application.files && application.files.length > 0) {
    const resumeFile = application.files.find(file =>
      file.name.toLowerCase().includes('resume') ||
      file.name.toLowerCase().includes('cv')
    );
    if (resumeFile) {
      info.resume = resumeFile.url;
    }
  }

  return info;
};

// @desc    Get all applications for a specific recruitment
// @route   GET /api/admin/recruitments/:recruitmentId/applications
// @access  Private/Admin
export const getApplicationsByRecruitment = async (req: Request, res: Response) => {
  try {
    const { recruitmentId } = req.params;

    const recruitment = await Recruitment.findById(recruitmentId);
    if (!recruitment) {
      return res.status(404).json({
        success: false,
        message: 'Recruitment not found'
      });
    }

    const applications = await Application.find({ recruitmentId })
      .sort({ appliedAt: -1 })
      .lean();

    const formattedApplications = applications.map(app => {
      const applicantInfo = extractApplicantInfo(app as IApplication);

      return {
        _id: app._id,
        ...applicantInfo,
        status: app.status,
        appliedAt: app.appliedAt,
        notes: app.notes,
        answers: app.answers,
        files: app.files
      };
    });

    res.json({
      success: true,
      applications: formattedApplications,
      recruitment: {
        _id: recruitment._id,
        title: recruitment.title,
        role: recruitment.role,
        description: recruitment.description,
        startDate: recruitment.startDate,
        endDate: recruitment.endDate,
        isOpen: recruitment.isOpen,
        questions: recruitment.questions,
        applicantsCount: formattedApplications.length
      }
    });
  } catch (error: any) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update application status
// @route   PUT /api/admin/applications/:applicationId/status
// @access  Private/Admin
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body; // ✅ ONLY status

    /* ---- Validate ObjectId ---- */
    const validId = Array.isArray(applicationId)
      ? applicationId[0]
      : applicationId;

    if (!mongoose.Types.ObjectId.isValid(validId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    /* ---- Validate status ---- */
    const allowedStatuses = [
      "pending",
      "reviewed",
      "shortlisted",
      "rejected",
      "accepted",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    /* ---- Find application ---- */
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    /* ---- Update ONLY status ---- */
    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application: {
        _id: application._id,
        status: application.status,
      },
    });
  } catch (error) {
    console.error("Update application status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update application status",
    });
  }
};
