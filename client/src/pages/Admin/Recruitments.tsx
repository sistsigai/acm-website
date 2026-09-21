import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  getAllRecruitments,
  createRecruitment,
  updateRecruitment,
  deleteRecruitment,
  toggleRecruitmentStatus,
} from "../../services/admin/recruitmentService";
import { useNavigate } from "react-router-dom";
import FormBuilder from "../../components/FormBuilder/FormBuilder";
import type { IQuestion } from "../../types/formBuilder";

/* ---------------- TYPES ---------------- */
interface QuestionOption {
  id: string;
  label: string;
}

interface QuestionBase {
  id: string;
  type: 'text' | 'textarea' | 'multiple-choice' | 'checkbox' | 'dropdown' | 'yes-no' | 'file';
  question: string;
  required: boolean;
  description?: string;
}

interface TextQuestion extends QuestionBase {
  type: 'text' | 'textarea';
  placeholder?: string;
  maxLength?: number;
  options?: never;
  allowedFormats?: never;
  maxFileSize?: never;
  maxFiles?: never;
}

interface OptionBasedQuestion extends QuestionBase {
  type: 'multiple-choice' | 'checkbox' | 'dropdown' | 'yes-no';
  options: QuestionOption[];
  placeholder?: never;
  maxLength?: never;
  allowedFormats?: never;
  maxFileSize?: never;
  maxFiles?: never;
}

interface CheckboxQuestion extends OptionBasedQuestion {
  type: 'checkbox';
  minSelections?: number;
  maxSelections?: number;
}

interface MultipleChoiceQuestion extends OptionBasedQuestion {
  type: 'multiple-choice';
  minSelections?: never;
  maxSelections?: never;
}

interface DropdownQuestion extends OptionBasedQuestion {
  type: 'dropdown';
  minSelections?: never;
  maxSelections?: never;
}

interface YesNoQuestion extends OptionBasedQuestion {
  type: 'yes-no';
  minSelections?: never;
  maxSelections?: never;
}

interface FileQuestion extends QuestionBase {
  type: 'file';
  placeholder?: never;
  maxLength?: never;
  options?: never;
  allowedFormats?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  minSelections?: never;
  maxSelections?: never;
}

type Question = TextQuestion | CheckboxQuestion | MultipleChoiceQuestion | DropdownQuestion | YesNoQuestion | FileQuestion;

interface Recruitment {
  _id: string;
  title: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  isOpen: boolean;
  applicantsCount: number;
  questions?: Question[];
}

// Validation errors interface
interface ValidationErrors {
  title?: string;
  role?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  dateRange?: string;
}

/* ---------------- COMPONENT ---------------- */
const Recruitments: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recruitmentToDelete, setRecruitmentToDelete] = useState<Recruitment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recruitmentModalTab, setRecruitmentModalTab] = useState<'details' | 'form'>('details');

  const navigate = useNavigate();

  const [toast, setToast] = useState<{
    show: boolean;
    variant: "success" | "error" | "info" | "warning";
    message: string;
  } | null>(null);

  const [form, setForm] = useState<Omit<Recruitment, "_id" | "applicantsCount">>({
    title: "",
    role: "",
    description: "",
    startDate: "",
    endDate: "",
    isOpen: true,
    questions: [],
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // For display in cards (e.g. "31 Dec 2025")
  const formatDisplayDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // For input[type="date"] value (YYYY-MM-DD)
  const formatInputDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  // --- VALIDATION UTILITIES ---
  const validateTitle = (title: string): string => {
    if (!title.trim()) return "Title is required";
    if (title.length < 3) return "Title must be at least 3 characters";
    if (title.length > 100) return "Title must be less than 100 characters";
    return "";
  };

  const validateRole = (role: string): string => {
    if (!role.trim()) return "Role is required";
    if (role.length < 2) return "Role must be at least 2 characters";
    if (role.length > 50) return "Role must be less than 50 characters";
    return "";
  };

  const validateDescription = (description: string): string => {
    if (description.length > 500) {
      return "Description must be less than 500 characters";
    }
    return "";
  };

  const validateStartDate = (date: string): string => {
    if (!date) return "Start date is required";

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime())) {
      return "Invalid date format";
    }

    if (selectedDate < today) {
      return "Start date cannot be in the past";
    }

    return "";
  };

  const validateEndDate = (endDate: string, startDate: string): string => {
    if (!endDate) return "End date is required";

    const end = new Date(endDate);
    const start = new Date(startDate);

    if (isNaN(end.getTime())) {
      return "Invalid date format";
    }

    if (startDate && end <= start) {
      return "End date must be after start date";
    }

    return "";
  };

  const validateDateRange = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return "";

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate difference in days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 2) {
      return "Recruitment must be at least 2 days long";
    }

    return "";
  };

  const validateAllFields = (): ValidationErrors => {
    const errors: ValidationErrors = {};

    errors.title = validateTitle(form.title);
    errors.role = validateRole(form.role);
    errors.description = validateDescription(form.description);
    errors.startDate = validateStartDate(form.startDate);
    errors.endDate = validateEndDate(form.endDate, form.startDate);
    errors.dateRange = validateDateRange(form.startDate, form.endDate);

    return errors;
  };

  const hasValidationErrors = useMemo(() => {
    const errors = validateAllFields();
    return Object.values(errors).some(error => error !== "");
  }, [form]);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Calculate minimum end date (start date + 2 days)
  const getMinEndDate = (): string => {
    if (!form.startDate) return getTodayDate();

    const startDate = new Date(form.startDate);
    const minEndDate = new Date(startDate);
    minEndDate.setDate(minEndDate.getDate() + 2);

    return minEndDate.toISOString().split('T')[0];
  };

  /* ---------------- MOCK LOAD ---------------- */
  useEffect(() => {
    const fetchRecruitments = async () => {
      try {
        setLoading(true);

        const start = Date.now();
        const res = await getAllRecruitments();

        const MIN_DELAY = 400;
        const elapsed = Date.now() - start;
        if (elapsed < MIN_DELAY) {
          await new Promise(r => setTimeout(r, MIN_DELAY - elapsed));
        }

        setRecruitments(
          (res.recruitments || []).sort(
            (a: Recruitment, b: Recruitment) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          )
        );
      } catch (error: any) {
        setToast({
          show: true,
          variant: "error",
          message: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecruitments();
  }, []);

  /* ---------------- ACTIONS ---------------- */
  const toggleRecruitment = async (id: string, current: boolean) => {
    try {
      const res = await toggleRecruitmentStatus(id, !current);

      setRecruitments(prev =>
        prev.map(r =>
          r._id === id ? { ...r, isOpen: !current } : r
        )
      );

      setToast({
        show: true,
        variant: "success",
        message: res?.message || "Recruitment status updated",
      });
    } catch (error: any) {
      setToast({
        show: true,
        variant: "error",
        message: error.message,
      });
    }
  };

  const handleSave = async () => {
    const errors = validateAllFields();
    setValidationErrors(errors);

    if (hasValidationErrors) {
      setToast({
        show: true,
        variant: "error",
        message: "Please fix all validation errors before saving",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      let res: Recruitment;

      if (editingId) {
        res = await updateRecruitment(editingId, form);

        setRecruitments(prev =>
          prev.map(r => (r._id === editingId ? res : r))
        );

        setToast({
          show: true,
          variant: "success",
          message: "Recruitment updated successfully",
        });
      } else {
        res = await createRecruitment(form);

        setRecruitments(prev => [res, ...prev]);

        setToast({
          show: true,
          variant: "success",
          message: "Recruitment created successfully",
        });
      }

      setShowModal(false);
      setEditingId(null);
      setForm({
        title: "",
        role: "",
        description: "",
        startDate: "",
        endDate: "",
        isOpen: true,
        questions: [],
      });
      setValidationErrors({});
    } catch (error: any) {
      setToast({
        show: true,
        variant: "error",
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (r: Recruitment) => {
    setForm({
      title: r.title,
      role: r.role,
      description: r.description,
      startDate: formatInputDate(r.startDate),
      endDate: formatInputDate(r.endDate),
      isOpen: r.isOpen,
      questions: r.questions || [],
    });

    setEditingId(r._id);
    setIsSubmitting(false);
    setValidationErrors({});
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!recruitmentToDelete) return;

    try {
      setLoading(true);

      const res = await deleteRecruitment(recruitmentToDelete._id);

      setRecruitments(prev =>
        prev.filter(r => r._id !== recruitmentToDelete._id)
      );

      setToast({
        show: true,
        variant: "success",
        message: res?.message || "Recruitment deleted successfully",
      });
    } catch (error: any) {
      setToast({
        show: true,
        variant: "error",
        message: error.message,
      });
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setRecruitmentToDelete(null);
    }
  };

  // Reset validation when modal closes
  useEffect(() => {
    if (!showModal) {
      setValidationErrors({});
    }
  }, [showModal]);

  /* ---------------- STYLES ---------------- */
  const styles = `
    /* --- Animations --- */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes scaleInModal {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .animate-card {
      animation: fadeInUp 0.5s ease-out forwards;
      opacity: 0; /* Hidden initially */
    }

    /* --- Glassmorphism Card --- */
    .recruitment-card {
      background: linear-gradient(145deg, rgba(31, 41, 55, 0.6) 0%, rgba(17, 24, 39, 0.8) 100%);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .recruitment-card:hover {
      transform: translateY(-5px);
      border-color: rgba(59, 130, 246, 0.4);
      box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.5);
      background: rgba(31, 41, 55, 0.85);
    }

    .recruitment-card::before {
      content: '';
      position: absolute;
      top: 0; left: -100%; width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
      transition: 0.5s;
    }

    .recruitment-card:hover::before {
      left: 100%;
    }

    /* --- Inputs & Selects --- */
    .form-control-glass, .form-select-glass {
      background: rgba(0, 0, 0, 0.3) !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      color: #ffffff !important;
      border-radius: 10px;
      padding: 0.55rem 0.85rem;
      transition: all 0.2s ease;
    }
    
    .form-control-glass:focus, .form-select-glass:focus {
      background: rgba(0, 0, 0, 0.5) !important;
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2) !important;
      color: #ffffff !important;
    }
    
    .input-group > .form-control-glass,
    .input-group > .form-select-glass {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
    .input-group > .input-group-text {
      border-top-left-radius: 10px !important;
      border-bottom-left-radius: 10px !important;
    }
    .input-group > .btn {
      border-top-right-radius: 10px !important;
      border-bottom-right-radius: 10px !important;
    }

    .form-control-glass.is-invalid, .form-select-glass.is-invalid {
      border-color: #dc3545 !important;
      background: rgba(220, 53, 69, 0.1) !important;
    }
    
    .form-control-glass.is-invalid:focus, .form-select-glass.is-invalid:focus {
      border-color: #dc3545 !important;
      box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.2) !important;
    }

    /* Fix for Select Options Visibility */
    .form-select-glass option {
      background-color: #111827; /* Dark background for options */
      color: #ffffff; /* White text for options */
    }

    /* --- CRITICAL: DATE PICKER MOBILE FIX --- */
    input[type="date"] {
      color-scheme: dark; /* Forces iOS/Android native picker to use dark theme */
      position: relative;
      min-height: 45px; /* Ensure sufficient touch target size */
    }

    /* Invert the calendar icon so it is visible on dark background */
    input[type="date"]::-webkit-calendar-picker-indicator {
      filter: invert(1);
      cursor: pointer;
      opacity: 0.7;
      padding: 5px; /* Increase hit area of icon */
    }
    
    input[type="date"]::-webkit-calendar-picker-indicator:hover {
      opacity: 1;
    }

    /* --- Modal --- */
    .modal-content-glass {
      background: #1f2937;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      animation: scaleInModal 0.3s ease-out forwards;
    }

    /* --- Validation Styles --- */
    .invalid-feedback-custom {
      display: block;
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      margin-left: 0.25rem;
    }

    .character-counter {
      font-size: 0.75rem;
      color: #6c757d;
      margin-top: 0.25rem;
      margin-left: 0.5rem;
    }

    .character-counter.warning {
      color: #ffc107;
    }

    .character-counter.danger {
      color: #dc3545;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .required-asterisk {
      color: #dc3545;
      margin-left: 2px;
    }

    /* --- MOBILE RESPONSIVENESS (< 768px) --- */
    @media (max-width: 768px) {
        /* 1. Add offset for floating navbar */
        .mobile-offset {
            padding-top: 85px !important;
        }

        /* 2. Full width buttons on mobile */
        .mobile-w-100 {
            width: 100% !important;
        }

        /* 3. Adjust modal widths */
        .modal-dialog {
            margin: 0.5rem;
        }
        
        .display-4 {
            font-size: 2.5rem; /* Smaller icon on empty state */
        }
    }
        /* --- Placeholder Text Color (GLOBAL FIX) --- */
::placeholder {
  color: rgba(255, 255, 255, 0.75) !important;
  opacity: 1; /* Firefox fix */
}

::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.75) !important;
}

:-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.75) !important;
}

::-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.75) !important;
}
  `;

  /* ---------------- RENDER ---------------- */
  return (
    <AdminLayout
      active="Recruitment"
      loading={loading || isSubmitting}
      toast={toast || undefined}
      onCloseToast={() => setToast(null)}
    >
      <style>{styles}</style>

      {/* Main Wrapper with Mobile Offset for Navbar */}
      <div className="mobile-offset">

        {/* Header - Stacks vertically on mobile */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-5 gap-3 animate-card" style={{ animationDelay: '0ms' }}>
          <div>
            <h1 className="fw-bold text-white mb-2" style={{ letterSpacing: '-1px' }}>Recruitments</h1>
            <p className="text-secondary m-0">Manage recruitment drives and applications.</p>
          </div>
          <button
            className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-lg d-flex align-items-center justify-content-center gap-2 hover-scale mobile-w-100"
            onClick={() => {
              setShowModal(true);
              setValidationErrors({});
            }}
            style={{ transition: 'transform 0.2s' }}
          >
            <i className="bi bi-plus-lg"></i>
            <span>New Drive</span>
          </button>
        </div>

        {/* Grid */}
        <div className="row g-4">
          {recruitments.length === 0 && !loading && (
            <div className="col-12 text-center text-secondary py-5">
              <i className="bi bi-folder2-open display-4 opacity-50 mb-3 d-block"></i>
              <h4>No recruitments found</h4>
              <p>Create a new recruitment drive to get started.</p>
            </div>
          )}

          {recruitments.map((r, index) => (
            <div key={r._id} className="col-12 col-md-6 col-xl-4 animate-card" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="recruitment-card p-4">

                {/* Top Row */}
                <div className="d-flex justify-content-between align-items-start mb-4">
                  {/* Updated Badge Colors for Visibility */}
                  <span
                    className={`badge rounded-pill px-3 py-2 d-flex align-items-center gap-2 ${r.isOpen
                      ? "bg-success bg-opacity-25 border border-success border-opacity-50"
                      : "bg-secondary bg-opacity-25 border border-secondary border-opacity-50"
                      }`}
                    style={{ color: r.isOpen ? '#86efac' : '#d1d5db' }} // Explicit light green / light gray text
                  >
                    <i className={`bi ${r.isOpen ? "bi-check-circle-fill" : "bi-lock-fill"}`}></i>
                    {r.isOpen ? "Open" : "Closed"}
                  </span>

                  <button
                    className="btn btn-sm btn-outline-light rounded-pill px-3 py-1"
                    onClick={() => toggleRecruitment(r._id, r.isOpen)}
                    style={{ fontSize: '0.8rem' }}
                  >
                    {r.isOpen ? "Close Drive" : "Re-open"}
                  </button>
                </div>

                {/* Content */}
                <div className="flex-grow-1">
                  <h4 className="fw-bold text-white mb-2 text-truncate" title={r.title}>{r.title}</h4>

                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="badge bg-primary bg-opacity-20 text-primary-subtle border border-primary border-opacity-20">
                      <i className="bi bi-briefcase me-1"></i> {r.role}
                    </span>
                    {r.questions && r.questions.length > 0 && (
                      <span className="badge bg-info bg-opacity-20 text-info-subtle border border-info border-opacity-20">
                        <i className="bi bi-question-circle me-1"></i> {r.questions.length} Questions
                      </span>
                    )}
                  </div>

                  <p className="text-secondary small mb-4 line-clamp-3" style={{ minHeight: '3em' }}>
                    {r.description}
                  </p>

                  <div className="d-flex align-items-center gap-2 text-secondary small bg-dark bg-opacity-50 p-2 rounded-3 border border-secondary border-opacity-20 mb-4">
                    <i className="bi bi-calendar-event text-info ms-1"></i>
                    <span>{formatDisplayDate(r.startDate)}</span>
                    <i className="bi bi-arrow-right text-secondary mx-1" style={{ fontSize: '0.7rem' }}></i>
                    <span>{formatDisplayDate(r.endDate)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-25 mt-auto flex-wrap gap-2">

                  {/* Left Side: Applicant Info */}
                  <div className="d-flex align-items-center gap-2 text-light">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 32,
                        height: 32,
                        background: "rgba(59, 130, 246, 0.35)",
                        border: "1px solid rgba(59, 130, 246, 0.6)"
                      }}
                    >
                      <i className="bi bi-people-fill text-white small"></i>
                    </div>
                    <span className="fw-semibold">{r.applicantsCount}</span>
                    <span className="text-secondary small">Applicants</span>
                  </div>

                  {/* Right Side: ALL Action Buttons Grouped */}
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-success rounded-pill px-3"
                      onClick={() => navigate(`/admin/recruitments/${r._id}/applications`)}
                    >
                      <i className="bi bi-people me-1"></i>
                      View Apps
                    </button>

                    <button
                      className="btn btn-sm btn-outline-info rounded-pill px-3"
                      onClick={() => handleEdit(r)}
                    >
                      <i className="bi bi-pencil-square me-1"></i>
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger rounded-pill px-3"
                      onClick={() => {
                        setRecruitmentToDelete(r);
                        setShowDeleteModal(true);
                      }}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-container p-4 m-2" style={{ maxWidth: '1050px', width: '100%' }}>

            {/* Modal Header */}
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary border-opacity-25 pb-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                  style={{
                    width: 44,
                    height: 44,
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <i className={`bi ${editingId ? 'bi-briefcase-fill text-primary' : 'bi-plus-circle-fill text-primary'} fs-5`}></i>
                </div>
                <div>
                  <h4 className="m-0 fw-bold text-white">
                    {editingId ? "Edit Recruitment Drive" : "Create New Drive"}
                  </h4>
                  <p className="text-secondary small mb-0 mt-1">Configure drive details, eligibility timeline, and application form</p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-link text-secondary text-decoration-none fs-4 p-0"
                style={{ lineHeight: 1 }}
                onClick={() => {
                  setShowModal(false);
                  setValidationErrors({});
                  setRecruitmentModalTab('details');
                }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Modal Tabs with Sliding Active Pill */}
            <div
              className="position-relative d-flex mb-3 p-1 bg-dark bg-opacity-75 rounded-3 border border-secondary border-opacity-25 overflow-hidden"
              style={{ minHeight: '46px' }}
            >
              {/* Smooth Sliding Pill Indicator */}
              <div
                className="position-absolute rounded-2 shadow"
                style={{
                  top: '4px',
                  bottom: '4px',
                  left: '4px',
                  width: 'calc(50% - 4px)',
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  transform: recruitmentModalTab === 'details' ? 'translateX(0%)' : 'translateX(100%)',
                  transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />

              {/* Tab 1: Drive Details */}
              <button
                type="button"
                className={`btn flex-fill py-2 rounded-2 fw-semibold d-flex align-items-center justify-content-center gap-2 border-0 position-relative ${
                  recruitmentModalTab === 'details' ? 'text-white' : 'text-secondary'
                }`}
                style={{ zIndex: 2, transition: 'color 0.25s ease', background: 'transparent' }}
                onClick={() => setRecruitmentModalTab('details')}
              >
                <i className="bi bi-briefcase"></i>
                <span>1. Drive Details</span>
              </button>

              {/* Tab 2: Application Form */}
              <button
                type="button"
                className={`btn flex-fill py-2 rounded-2 fw-semibold d-flex align-items-center justify-content-center gap-2 border-0 position-relative ${
                  recruitmentModalTab === 'form' ? 'text-white' : 'text-secondary'
                }`}
                style={{ zIndex: 2, transition: 'color 0.25s ease', background: 'transparent' }}
                onClick={() => setRecruitmentModalTab('form')}
              >
                <i className="bi bi-ui-checks-grid"></i>
                <span>2. Application Form</span>
                <span
                  className={`badge rounded-pill px-2 ${
                    recruitmentModalTab === 'form' ? 'bg-white bg-opacity-25 text-white' : 'bg-secondary bg-opacity-50 text-light'
                  }`}
                  style={{ transition: 'all 0.25s ease' }}
                >
                  {form.questions?.length || 0}
                </span>
              </button>
            </div>

            {/* Modal Body with Smooth Sliding Tabs */}
            <div className="tab-slider-wrapper">
              <div
                className="tab-slider-track"
                style={{
                  transform: recruitmentModalTab === 'details' ? 'translateX(0%)' : 'translateX(-50%)'
                }}
              >
                {/* Slide 1: Drive Details (2-Column Non-Scrollable Layout) */}
                <div className="tab-slide px-1">
                  <div className="row g-3">
                    {/* Left Column */}
                    <div className="col-lg-6 d-flex flex-column gap-3">
                      {/* Title */}
                      <div>
                        <label className="form-label text-secondary small fw-bold mb-1">
                          Drive Title <span className="required-asterisk">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-dark bg-opacity-50 border-secondary border-opacity-50 text-primary">
                            <i className="bi bi-card-heading"></i>
                          </span>
                          <input
                            className={`form-control form-control-glass ${validationErrors.title ? 'is-invalid' : ''}`}
                            placeholder="e.g. Core Team Recruitment 2026"
                            value={form.title}
                            onChange={(e) => {
                              setForm({ ...form, title: e.target.value });
                              setValidationErrors({ ...validationErrors, title: validateTitle(e.target.value) });
                            }}
                            maxLength={100}
                          />
                        </div>
                        {validationErrors.title && (
                          <div className="invalid-feedback-custom">
                            {validationErrors.title}
                          </div>
                        )}
                        <div className={`character-counter ${form.title.length > 90 ? 'warning' : ''} ${form.title.length >= 100 ? 'danger' : ''}`}>
                          {form.title.length} / 100
                        </div>
                      </div>

                      {/* Role */}
                      <div>
                        <label className="form-label text-secondary small fw-bold mb-1">
                          Role / Position Title <span className="required-asterisk">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-dark bg-opacity-50 border-secondary border-opacity-50 text-info">
                            <i className="bi bi-person-badge"></i>
                          </span>
                          <input
                            type="text"
                            className={`form-control form-control-glass ${validationErrors.role ? 'is-invalid' : ''}`}
                            placeholder="e.g. Technical Lead / Creative Designer"
                            value={form.role}
                            onChange={(e) => {
                              setForm({ ...form, role: e.target.value });
                              setValidationErrors({ ...validationErrors, role: validateRole(e.target.value) });
                            }}
                            maxLength={50}
                          />
                        </div>
                        {validationErrors.role && (
                          <div className="invalid-feedback-custom">
                            {validationErrors.role}
                          </div>
                        )}
                        <div className={`character-counter ${form.role.length > 45 ? 'warning' : ''} ${form.role.length >= 50 ? 'danger' : ''}`}>
                          {form.role.length} / 50
                        </div>
                      </div>

                      {/* Dates in 1 row */}
                      <div className="row g-2">
                        <div className="col-6">
                          <label className="form-label text-secondary small fw-bold mb-1">
                            Start Date <span className="required-asterisk">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text bg-dark bg-opacity-50 border-secondary border-opacity-50 text-success">
                              <i className="bi bi-calendar-check"></i>
                            </span>
                            <input
                              type="date"
                              className={`form-control form-control-glass ${validationErrors.startDate || validationErrors.dateRange ? 'is-invalid' : ''}`}
                              value={form.startDate}
                              min={getTodayDate()}
                              onChange={(e) => {
                                const newStartDate = e.target.value;
                                setForm({ ...form, startDate: newStartDate });

                                if (form.endDate && new Date(newStartDate) >= new Date(form.endDate)) {
                                  setForm(prev => ({ ...prev, endDate: "" }));
                                }

                                const errors = { ...validationErrors };
                                errors.startDate = validateStartDate(newStartDate);
                                errors.endDate = validateEndDate(form.endDate, newStartDate);
                                errors.dateRange = validateDateRange(newStartDate, form.endDate);
                                setValidationErrors(errors);
                              }}
                              onClick={(e) => (e.target as any).showPicker && (e.target as any).showPicker()}
                            />
                          </div>
                          {validationErrors.startDate && (
                            <div className="invalid-feedback-custom">
                              {validationErrors.startDate}
                            </div>
                          )}
                        </div>

                        <div className="col-6">
                          <label className="form-label text-secondary small fw-bold mb-1">
                            End Date <span className="required-asterisk">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text bg-dark bg-opacity-50 border-secondary border-opacity-50 text-danger">
                              <i className="bi bi-calendar-x"></i>
                            </span>
                            <input
                              type="date"
                              className={`form-control form-control-glass ${validationErrors.endDate || validationErrors.dateRange ? 'is-invalid' : ''}`}
                              value={form.endDate}
                              min={getMinEndDate()}
                              onChange={(e) => {
                                const newEndDate = e.target.value;
                                setForm({ ...form, endDate: newEndDate });

                                const errors = { ...validationErrors };
                                errors.endDate = validateEndDate(newEndDate, form.startDate);
                                errors.dateRange = validateDateRange(form.startDate, newEndDate);
                                setValidationErrors(errors);
                              }}
                              onClick={(e) => (e.target as any).showPicker && (e.target as any).showPicker()}
                            />
                          </div>
                          {validationErrors.endDate && (
                            <div className="invalid-feedback-custom">
                              {validationErrors.endDate}
                            </div>
                          )}
                        </div>

                        {validationErrors.dateRange && (
                          <div className="col-12">
                            <div className="invalid-feedback-custom">
                              {validationErrors.dateRange}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Open Applications Toggle */}
                      <div className="form-check form-switch p-3 rounded-3 d-flex align-items-center justify-content-between" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <div>
                          <div className="text-white fw-semibold small mb-1">
                            Accepting Applications?
                          </div>
                          <span className={`badge ${form.isOpen ? 'bg-success bg-opacity-20 text-success' : 'bg-secondary bg-opacity-25 text-secondary'} rounded-pill px-2 py-1`} style={{ fontSize: '0.72rem' }}>
                            <i className={`bi ${form.isOpen ? 'bi-check-circle-fill' : 'bi-dash-circle'} me-1`}></i>
                            {form.isOpen ? 'Open & Accepting' : 'Closed / Draft'}
                          </span>
                        </div>
                        <input
                          className="form-check-input m-0 cursor-pointer"
                          type="checkbox"
                          style={{ width: '2.8em', height: '1.4em', cursor: 'pointer' }}
                          checked={form.isOpen}
                          onChange={(e) => setForm({ ...form, isOpen: e.target.checked })}
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-lg-6 d-flex flex-column gap-3">
                      {/* Description */}
                      <div>
                        <label className="form-label text-secondary small fw-bold mb-1">
                          Drive Description
                        </label>
                        <textarea
                          className={`form-control form-control-glass ${validationErrors.description ? 'is-invalid' : ''}`}
                          rows={4}
                          placeholder="Describe the recruitment drive, eligibility criteria, and expectations..."
                          value={form.description}
                          onChange={(e) => {
                            setForm({ ...form, description: e.target.value });
                            setValidationErrors({ ...validationErrors, description: validateDescription(e.target.value) });
                          }}
                          maxLength={500}
                          style={{ resize: 'none' }}
                        />
                        {validationErrors.description && (
                          <div className="invalid-feedback-custom">
                            {validationErrors.description}
                          </div>
                        )}
                        <div className={`character-counter ${form.description.length > 450 ? 'warning' : ''} ${form.description.length >= 500 ? 'danger' : ''}`}>
                          {form.description.length} / 500
                        </div>
                      </div>

                      {/* Guidelines Card */}
                      <div className="p-3 rounded-3 d-flex flex-column gap-2" style={{ background: 'rgba(59, 130, 246, 0.06)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <div className="d-flex align-items-center gap-2 text-primary fw-bold small">
                          <i className="bi bi-lightbulb-fill"></i>
                          <span>Application Form Builder</span>
                        </div>
                        <p className="text-secondary small mb-0" style={{ lineHeight: 1.5 }}>
                          Use the <strong>Application Form</strong> tab to configure custom questions, portfolio uploads, and short answers. Applicants will fill out your customized form directly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slide 2: Form Builder */}
                <div className="tab-slide px-1">
                  <div style={{ maxHeight: 'calc(75vh - 180px)', overflowY: 'auto' }} className="pe-1">
                    <div className="alert alert-info border-0 bg-opacity-10 bg-info d-flex align-items-center gap-2 mb-3 py-2 px-3">
                      <i className="bi bi-info-circle-fill text-info fs-6"></i>
                      <span className="small text-light">
                        Build your application form with custom questions, input types, and validations. Changes are saved with the recruitment drive.
                      </span>
                    </div>
                    <FormBuilder
                      questions={(form.questions as IQuestion[]) || []}
                      onChange={(questions) =>
                        setForm({
                          ...form,
                          questions: questions as unknown as Question[],
                        })
                      }
                      formTitle={form.title || "Recruitment Application"}
                      formDescription={form.description || "Please fill in the details below to apply for this position."}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-25 mt-3">
              <div>
                {recruitmentModalTab === 'details' ? (
                  <button
                    type="button"
                    className="btn btn-outline-info rounded-pill px-3"
                    onClick={() => setRecruitmentModalTab('form')}
                  >
                    <i className="bi bi-arrow-right me-1"></i>Next: Application Form ({form.questions?.length || 0})
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-3"
                    onClick={() => setRecruitmentModalTab('details')}
                  >
                    <i className="bi bi-arrow-left me-1"></i>Back: Drive Details
                  </button>
                )}
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-light rounded-pill px-4" onClick={() => {
                  setShowModal(false);
                  setValidationErrors({});
                  setRecruitmentModalTab('details');
                }}>Cancel</button>
                <button
                  className="btn btn-primary rounded-pill px-5 fw-bold shadow"
                  onClick={handleSave}
                  disabled={hasValidationErrors || isSubmitting}
                >
                  {isSubmitting ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {editingId ? "Updating..." : "Creating..."}
                    </span>
                  ) : (
                    editingId ? "Save Changes" : "Create Drive"
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-glass rounded-4 p-4 text-center">
              <div className="modal-body">
                <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex p-3 mb-3">
                  <i className="bi bi-exclamation-triangle-fill fs-3"></i>
                </div>
                <h4 className="fw-bold mb-2 text-white">Delete Recruitment?</h4>
                <p className="text-secondary mb-4">
                  Are you sure you want to delete{" "}
                  <strong>{recruitmentToDelete?.title}</strong>? This action cannot be undone.
                </p>

                <div className="d-flex gap-2 justify-content-center">
                  <button
                    className="btn btn-outline-light rounded-pill px-4"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger rounded-pill px-4 fw-bold"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    {loading ? (
                      <span>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Deleting...
                      </span>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Recruitments;