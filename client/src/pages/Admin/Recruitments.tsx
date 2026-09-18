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
  const [showQuestionBuilder, setShowQuestionBuilder] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

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

  // Question builder state - using a more specific type
  const [questionForm, setQuestionForm] = useState<{
    type: 'text' | 'textarea' | 'multiple-choice' | 'checkbox' | 'dropdown' | 'yes-no' | 'file';
    question: string;
    required: boolean;
    placeholder?: string;
    description?: string;
    maxLength?: number;
    options?: QuestionOption[];
    minSelections?: number;
    maxSelections?: number;
    allowedFormats?: string[];
    maxFileSize?: number;
    maxFiles?: number;
  }>({
    type: 'text',
    question: '',
    required: false,
    placeholder: '',
    description: '',
    maxLength: 100,
    options: [{ id: '1', label: '' }, { id: '2', label: '' }],
    allowedFormats: [],
    maxFileSize: 10,
    maxFiles: 1,
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

  // Common file formats
  const commonFileFormats = [
    { id: 'pdf', label: 'PDF (.pdf)', ext: 'pdf' },
    { id: 'doc', label: 'Word (.doc, .docx)', ext: 'doc,docx' },
    { id: 'txt', label: 'Text (.txt)', ext: 'txt' },
    { id: 'jpg', label: 'Image (.jpg, .jpeg)', ext: 'jpg,jpeg' },
    { id: 'png', label: 'Image (.png)', ext: 'png' },
    { id: 'xls', label: 'Excel (.xls, .xlsx)', ext: 'xls,xlsx' },
    { id: 'ppt', label: 'PowerPoint (.ppt, .pptx)', ext: 'ppt,pptx' },
  ];

  // --- QUESTION UTILITIES ---
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  const addQuestion = () => {
    if (!questionForm.question.trim()) {
      setToast({
        show: true,
        variant: "error",
        message: "Question text is required"
      });
      return;
    }

    let newQuestion: Question;

    // Create question based on type
    switch (questionForm.type) {
      case 'text':
      case 'textarea':
        newQuestion = {
          id: editingQuestionId || generateId(),
          type: questionForm.type,
          question: questionForm.question.trim(),
          required: questionForm.required,
          description: questionForm.description?.trim() || undefined,
          placeholder: questionForm.placeholder?.trim() || undefined,
          maxLength: questionForm.maxLength,
        } as TextQuestion;
        break;

      case 'multiple-choice':
      case 'dropdown':
      case 'yes-no':
        // Filter out empty options
        const filteredOptions = questionForm.options?.filter(opt => opt.label.trim() !== '');
        if (!filteredOptions || filteredOptions.length === 0) {
          setToast({
            show: true,
            variant: "error",
            message: "At least one option is required for this question type"
          });
          return;
        }

        if (questionForm.type === 'yes-no') {
          newQuestion = {
            id: editingQuestionId || generateId(),
            type: 'yes-no',
            question: questionForm.question.trim(),
            required: questionForm.required,
            description: questionForm.description?.trim() || undefined,
            options: [
              { id: '1', label: 'Yes' },
              { id: '2', label: 'No' }
            ]
          } as YesNoQuestion;
        } else if (questionForm.type === 'multiple-choice') {
          newQuestion = {
            id: editingQuestionId || generateId(),
            type: 'multiple-choice',
            question: questionForm.question.trim(),
            required: questionForm.required,
            description: questionForm.description?.trim() || undefined,
            options: filteredOptions
          } as MultipleChoiceQuestion;
        } else {
          newQuestion = {
            id: editingQuestionId || generateId(),
            type: 'dropdown',
            question: questionForm.question.trim(),
            required: questionForm.required,
            description: questionForm.description?.trim() || undefined,
            options: filteredOptions
          } as DropdownQuestion;
        }
        break;

      case 'checkbox':
        // Filter out empty options
        const checkboxOptions = questionForm.options?.filter(opt => opt.label.trim() !== '');
        if (!checkboxOptions || checkboxOptions.length === 0) {
          setToast({
            show: true,
            variant: "error",
            message: "At least one option is required for checkboxes"
          });
          return;
        }

        newQuestion = {
          id: editingQuestionId || generateId(),
          type: 'checkbox',
          question: questionForm.question.trim(),
          required: questionForm.required,
          description: questionForm.description?.trim() || undefined,
          options: checkboxOptions,
          minSelections: questionForm.minSelections || 0,
          maxSelections: questionForm.maxSelections || checkboxOptions.length
        } as CheckboxQuestion;
        break;

      case 'file':
        // Validate file question
        if (!questionForm.allowedFormats || questionForm.allowedFormats.length === 0) {
          setToast({
            show: true,
            variant: "error",
            message: "At least one file format must be selected"
          });
          return;
        }

        if (!questionForm.maxFileSize || questionForm.maxFileSize < 1 || questionForm.maxFileSize > 100) {
          setToast({
            show: true,
            variant: "error",
            message: "Max file size must be between 1 and 100 MB"
          });
          return;
        }

        if (!questionForm.maxFiles || questionForm.maxFiles < 1 || questionForm.maxFiles > 10) {
          setToast({
            show: true,
            variant: "error",
            message: "Max files must be between 1 and 10"
          });
          return;
        }

        newQuestion = {
          id: editingQuestionId || generateId(),
          type: 'file',
          question: questionForm.question.trim(),
          required: questionForm.required,
          description: questionForm.description?.trim() || undefined,
          allowedFormats: questionForm.allowedFormats,
          maxFileSize: questionForm.maxFileSize,
          maxFiles: questionForm.maxFiles,
        } as FileQuestion;
        break;

      default:
        return;
    }

    if (editingQuestionId) {
      // Update existing question
      setForm(prev => ({
        ...prev,
        questions: prev.questions?.map(q =>
          q.id === editingQuestionId ? newQuestion : q
        ) || []
      }));
    } else {
      // Add new question
      setForm(prev => ({
        ...prev,
        questions: [...(prev.questions || []), newQuestion]
      }));
    }

    resetQuestionForm();
    setShowQuestionBuilder(false);
  };

  const editQuestion = (question: Question) => {
    const baseFields = {
      type: question.type,
      question: question.question,
      required: question.required,
      description: question.description || '',
      placeholder: '',
      maxLength: 100,
    };

    switch (question.type) {
      case 'text':
      case 'textarea':
        setQuestionForm({
          ...baseFields,
          placeholder: (question as TextQuestion).placeholder || '',
          maxLength: (question as TextQuestion).maxLength || 100,
        });
        break;

      case 'multiple-choice':
      case 'dropdown':
        setQuestionForm({
          ...baseFields,
          options: question.options?.length ? [...question.options] : [{ id: '1', label: '' }, { id: '2', label: '' }],
        });
        break;

      case 'checkbox':
        setQuestionForm({
          ...baseFields,
          options: question.options?.length ? [...question.options] : [{ id: '1', label: '' }, { id: '2', label: '' }],
          minSelections: (question as CheckboxQuestion).minSelections || 0,
          maxSelections: (question as CheckboxQuestion).maxSelections || 1,
        });
        break;

      case 'yes-no':
        setQuestionForm({
          ...baseFields,
          options: [
            { id: '1', label: 'Yes' },
            { id: '2', label: 'No' }
          ],
        });
        break;

      case 'file':
        const fileQuestion = question as FileQuestion;
        setQuestionForm({
          ...baseFields,
          allowedFormats: fileQuestion.allowedFormats || [],
          maxFileSize: fileQuestion.maxFileSize || 10,
          maxFiles: fileQuestion.maxFiles || 1,
        });
        break;
    }

    setEditingQuestionId(question.id);
    setShowQuestionBuilder(true);
  };

  const deleteQuestion = (id: string) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions?.filter(q => q.id !== id) || []
    }));
  };

  const resetQuestionForm = () => {
    setQuestionForm({
      type: 'text',
      question: '',
      required: false,
      placeholder: '',
      description: '',
      maxLength: 100,
      options: [{ id: '1', label: '' }, { id: '2', label: '' }],
      allowedFormats: [],
      maxFileSize: 10,
      maxFiles: 1,
    });
    setEditingQuestionId(null);
  };

  const addOption = () => {
    setQuestionForm(prev => ({
      ...prev,
      options: [...(prev.options || []), { id: generateId(), label: '' }]
    }));
  };

  const updateOption = (id: string, label: string) => {
    setQuestionForm(prev => ({
      ...prev,
      options: prev.options?.map(opt =>
        opt.id === id ? { ...opt, label } : opt
      )
    }));
  };

  const removeOption = (id: string) => {
    if (questionForm.options && questionForm.options.length > 2) {
      setQuestionForm(prev => ({
        ...prev,
        options: prev.options?.filter(opt => opt.id !== id)
      }));
    }
  };

  const toggleFileFormat = (ext: string) => {
    setQuestionForm(prev => {
      const currentFormats = prev.allowedFormats || [];
      const formatsArray = ext.split(',');

      let newFormats = [...currentFormats];

      formatsArray.forEach(format => {
        if (newFormats.includes(format)) {
          newFormats = newFormats.filter(f => f !== format);
        } else {
          newFormats.push(format);
        }
      });

      return {
        ...prev,
        allowedFormats: newFormats
      };
    });
  };

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    if (!form.questions) return;

    const newQuestions = [...form.questions];
    const [movedQuestion] = newQuestions.splice(fromIndex, 1);
    newQuestions.splice(toIndex, 0, movedQuestion);

    setForm(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };

  const clearAllQuestions = () => {
    setForm(prev => ({
      ...prev,
      questions: []
    }));
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
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      border-radius: 8px;
      padding: 10px 12px;
      transition: all 0.2s;
    }
    
    .form-control-glass:focus, .form-select-glass:focus {
      background: rgba(0, 0, 0, 0.5);
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
      color: white;
    }
    
    .form-control-glass.is-invalid {
      border-color: #dc3545;
      background: rgba(220, 53, 69, 0.1);
    }
    
    .form-control-glass.is-invalid:focus {
      border-color: #dc3545;
      box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.15);
    }

    /* Fix for Select Options Visibility */
    .form-select-glass option {
      background-color: #1f2937; /* Dark background for options */
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

    /* --- Question Builder Styles --- */
    .question-builder {
      background: rgba(17, 24, 39, 0.95);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 12px;
      transition: all 0.3s ease;
    }
    
    .question-type-badge {
      font-size: 0.7rem;
      padding: 4px 8px;
      border-radius: 6px;
      font-weight: 600;
    }
    
    .question-type-text { background: rgba(59, 130, 246, 0.15); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.3); }
    .question-type-textarea { background: rgba(34, 197, 94, 0.15); color: #86efac; border: 1px solid rgba(34, 197, 94, 0.3); }
    .question-type-multiple-choice { background: rgba(168, 85, 247, 0.15); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.3); }
    .question-type-checkbox { background: rgba(245, 158, 11, 0.15); color: #fcd34d; border: 1px solid rgba(245, 158, 11, 0.3); }
    .question-type-dropdown { background: rgba(236, 72, 153, 0.15); color: #f9a8d4; border: 1px solid rgba(236, 72, 153, 0.3); }
    .question-type-yes-no { background: rgba(14, 165, 233, 0.15); color: #7dd3fc; border: 1px solid rgba(14, 165, 233, 0.3); }
    .question-type-file { background: rgba(139, 92, 246, 0.15); color: #c4b5fd; border: 1px solid rgba(139, 92, 246, 0.3); }
    
    .drag-handle {
      cursor: grab;
      transition: color 0.2s;
      color: #9ca3af;
    }
    
    .drag-handle:hover {
      color: #d1d5db;
    }
    
    .drag-handle:active {
      cursor: grabbing;
    }
    
    .option-item {
      transition: all 0.2s;
      background: rgba(31, 41, 55, 0.5);
    }
    
    .option-item:hover {
      background: rgba(55, 65, 81, 0.5);
    }
    
    .preview-question {
      background: rgba(31, 41, 55, 0.4);
      border-left: 3px solid #3b82f6;
    }
    
    .file-format-checkbox {
      transition: all 0.2s;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .file-format-checkbox:hover {
      border-color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
    }
    
    .file-format-checkbox.selected {
      background: rgba(59, 130, 246, 0.2);
      border-color: #3b82f6;
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
        
        /* 4. Question builder adjustments */
        .question-actions {
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .question-actions .btn {
            width: 100%;
        }
        
        .file-formats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
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
  /* --- FIX: Preview input visibility --- */
.preview-question .form-control-glass {
  opacity: 1 !important;                 /* cancel disabled fade */
  color: #ffffff !important;             /* text clearly visible */
  background: rgba(0, 0, 0, 0.45) !important;
  border-color: rgba(255, 255, 255, 0.2);
  cursor: not-allowed;
}

/* Placeholder clarity */
.preview-question .form-control-glass::placeholder {
  color: rgba(255, 255, 255, 0.8) !important;
}

/* Disabled textarea fix */
.preview-question textarea.form-control-glass {
  opacity: 1 !important;
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
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content modal-content-glass rounded-4 overflow-hidden text-light">

              <div className="modal-header border-bottom border-secondary border-opacity-25 p-4">
                <h5 className="modal-title fw-bold">
                  {editingId ? "Edit Recruitment" : "Create New Drive"}
                </h5>

                <button type="button" className="btn-close btn-close-white" onClick={() => {
                  setShowModal(false);
                  setValidationErrors({});
                  setShowQuestionBuilder(false);
                  resetQuestionForm();
                }}></button>
              </div>

              <div className="modal-body p-4">
                {/* Title */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold text-uppercase">
                    Title <span className="required-asterisk">*</span>
                  </label>
                  <input
                    className={`form-control form-control-glass ${validationErrors.title ? 'is-invalid' : ''}`}
                    value={form.title}
                    onChange={(e) => {
                      setForm({ ...form, title: e.target.value });
                      setValidationErrors({ ...validationErrors, title: validateTitle(e.target.value) });
                    }}
                    maxLength={100}
                  />
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
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold text-uppercase">
                    Role / Position <span className="required-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-glass ${validationErrors.role ? 'is-invalid' : ''}`}
                    value={form.role}
                    onChange={(e) => {
                      setForm({ ...form, role: e.target.value });
                      setValidationErrors({ ...validationErrors, role: validateRole(e.target.value) });
                    }}
                    maxLength={50}
                  />
                  {validationErrors.role && (
                    <div className="invalid-feedback-custom">
                      {validationErrors.role}
                    </div>
                  )}
                  <div className={`character-counter ${form.role.length > 45 ? 'warning' : ''} ${form.role.length >= 50 ? 'danger' : ''}`}>
                    {form.role.length} / 50
                  </div>
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold text-uppercase">
                    Description
                  </label>
                  <textarea
                    className={`form-control form-control-glass ${validationErrors.description ? 'is-invalid' : ''}`}
                    rows={3}
                    value={form.description}
                    onChange={(e) => {
                      setForm({ ...form, description: e.target.value });
                      setValidationErrors({ ...validationErrors, description: validateDescription(e.target.value) });
                    }}
                    maxLength={500}
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

                {/* Dates */}
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <label className="form-label text-secondary small fw-bold text-uppercase">
                      Start Date <span className="required-asterisk">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control form-control-glass ${validationErrors.startDate || validationErrors.dateRange ? 'is-invalid' : ''}`}
                      value={form.startDate}
                      min={getTodayDate()}
                      onChange={(e) => {
                        const newStartDate = e.target.value;
                        setForm({ ...form, startDate: newStartDate });

                        // Clear end date if start date is after current end date
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
                    {validationErrors.startDate && (
                      <div className="invalid-feedback-custom">
                        {validationErrors.startDate}
                      </div>
                    )}
                  </div>
                  <div className="col-6">
                    <label className="form-label text-secondary small fw-bold text-uppercase">
                      End Date <span className="required-asterisk">*</span>
                    </label>
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
                    {validationErrors.endDate && (
                      <div className="invalid-feedback-custom">
                        {validationErrors.endDate}
                      </div>
                    )}
                  </div>

                  {/* Date Range Error */}
                  {validationErrors.dateRange && (
                    <div className="col-12">
                      <div className="invalid-feedback-custom">
                        {validationErrors.dateRange}
                      </div>
                    </div>
                  )}
                </div>

                {/* Questions Section */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <label className="form-label text-secondary small fw-bold text-uppercase mb-0">
                      Custom Application Questions
                    </label>
                    <span className="text-secondary small">
                      {form.questions?.length || 0} questions added
                    </span>
                  </div>

                  {/* Questions List */}
                  <div className="question-builder p-3 mb-3">
                    {form.questions && form.questions.length > 0 ? (
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-light small fw-medium">Questions Preview</span>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={clearAllQuestions}
                          >
                            <i className="bi bi-trash me-1"></i> Clear All
                          </button>
                        </div>

                        <div className="list-group">
                          {form.questions.map((q, index) => (
                            <div key={q.id} className="list-group-item bg-transparent border border-secondary border-opacity-25 rounded mb-2 p-3">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                  <div className="d-flex align-items-center gap-2 mb-2">
                                    <span className={`question-type-badge question-type-${q.type}`}>
                                      {q.type === 'text' && 'Short Text'}
                                      {q.type === 'textarea' && 'Long Text'}
                                      {q.type === 'multiple-choice' && 'Multiple Choice'}
                                      {q.type === 'checkbox' && 'Checkboxes'}
                                      {q.type === 'dropdown' && 'Dropdown'}
                                      {q.type === 'yes-no' && 'Yes/No'}
                                      {q.type === 'file' && 'File Upload'}
                                    </span>
                                    {q.required && (
                                      <span className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-25">
                                        Required
                                      </span>
                                    )}
                                    <span className="text-secondary ms-auto small">
                                      Question {index + 1}
                                    </span>
                                  </div>

                                  <h6 className="text-white mb-1">{q.question}</h6>

                                  {q.description && (
                                    <p className="text-secondary small mb-2">{q.description}</p>
                                  )}

                                  {q.type === 'multiple-choice' && q.options && (
                                    <div className="mt-2">
                                      {q.options.map(opt => (
                                        <div key={opt.id} className="form-check">
                                          <input className="form-check-input" type="radio" disabled />
                                          <label className="form-check-label text-secondary">
                                            {opt.label}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {q.type === 'checkbox' && q.options && (
                                    <div className="mt-2">
                                      {q.options.map(opt => (
                                        <div key={opt.id} className="form-check">
                                          <input className="form-check-input" type="checkbox" disabled />
                                          <label className="form-check-label text-secondary">
                                            {opt.label}
                                          </label>
                                        </div>
                                      ))}
                                      {q.type === 'checkbox' && (
                                        <div className="mt-2 text-secondary small">
                                          <i className="bi bi-info-circle me-1"></i>
                                          Select between {(q as CheckboxQuestion).minSelections || 0} and {(q as CheckboxQuestion).maxSelections || q.options.length} options
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {q.type === 'dropdown' && q.options && (
                                    <div className="mt-2">
                                      <select className="form-select-glass form-select-sm w-auto" disabled>
                                        <option>Select an option</option>
                                        {q.options.map(opt => (
                                          <option key={opt.id}>{opt.label}</option>
                                        ))}
                                      </select>
                                    </div>
                                  )}

                                  {q.type === 'yes-no' && (
                                    <div className="mt-2 d-flex gap-3">
                                      <div className="form-check">
                                        <input className="form-check-input" type="radio" disabled />
                                        <label className="form-check-label text-secondary">Yes</label>
                                      </div>
                                      <div className="form-check">
                                        <input className="form-check-input" type="radio" disabled />
                                        <label className="form-check-label text-secondary">No</label>
                                      </div>
                                    </div>
                                  )}

                                  {q.type === 'file' && (
                                    <div className="mt-2">
                                      <div className="border border-secondary border-opacity-25 rounded p-3 bg-dark bg-opacity-25">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                          <i className="bi bi-cloud-upload text-info"></i>
                                          <span className="text-secondary">File Upload</span>
                                        </div>
                                        <div className="text-secondary small">
                                          <div>
                                            <i className="bi bi-file-earmark-text me-1"></i>
                                            Allowed formats: {(q as FileQuestion).allowedFormats?.join(', ') || 'Any'}
                                          </div>
                                          <div>
                                            <i className="bi bi-hdd me-1"></i>
                                            Max size: {(q as FileQuestion).maxFileSize || 10} MB
                                          </div>
                                          <div>
                                            <i className="bi bi-files me-1"></i>
                                            Max files: {(q as FileQuestion).maxFiles || 1}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="d-flex flex-column gap-1 ms-3">
                                  <button
                                    className="btn btn-sm btn-outline-info"
                                    onClick={() => editQuestion(q)}
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => deleteQuestion(q.id)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-secondary drag-handle"
                                    title="Drag to reorder"
                                    onMouseDown={() => { }}
                                  >
                                    <i className="bi bi-grip-vertical"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <i className="bi bi-question-circle display-6 text-secondary opacity-50 mb-3 d-block"></i>
                        <p className="text-secondary mb-0">No questions added yet.</p>
                        <p className="text-secondary small">Add questions to collect specific information from applicants.</p>
                      </div>
                    )}

                    <div className="d-flex gap-2 question-actions">
                      <button
                        className="btn btn-outline-primary flex-grow-1"
                        onClick={() => setShowQuestionBuilder(true)}
                      >
                        <i className="bi bi-plus-lg me-2"></i>
                        Add Question
                      </button>

                      {form.questions && form.questions.length > 0 && (
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            // Simple reordering: move first to last
                            if (form.questions && form.questions.length > 1) {
                              moveQuestion(0, form.questions.length - 1);
                            }
                          }}
                        >
                          <i className="bi bi-arrow-down-up me-2"></i>
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Open Applications Toggle */}
                <div className="form-check form-switch p-3 bg-dark bg-opacity-50 rounded-3 border border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
                  <label className="form-check-label text-white fw-medium mb-0 ms-1">
                    Immediately Open Applications?
                  </label>
                  <input
                    className="form-check-input m-0"
                    type="checkbox"
                    style={{ width: '3em', height: '1.5em', cursor: 'pointer' }}
                    checked={form.isOpen}
                    onChange={(e) => setForm({ ...form, isOpen: e.target.checked })}
                  />
                </div>
              </div>

              <div className="modal-footer border-top border-secondary border-opacity-25 p-4">
                <button className="btn btn-outline-light rounded-pill px-4" onClick={() => {
                  setShowModal(false);
                  setValidationErrors({});
                  setShowQuestionBuilder(false);
                  resetQuestionForm();
                }}>Cancel</button>
                <button
                  className="btn btn-primary rounded-pill px-5 fw-bold"
                  onClick={handleSave}
                  disabled={hasValidationErrors || isSubmitting}
                >
                  {isSubmitting ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {editingId ? "Updating..." : "Creating..."}
                    </span>
                  ) : (
                    editingId ? "Update Drive" : "Create Drive"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question Builder Modal */}
      {showQuestionBuilder && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-glass rounded-4 overflow-hidden text-light">
              <div className="modal-header border-bottom border-secondary border-opacity-25 p-4">
                <h5 className="modal-title fw-bold">
                  {editingQuestionId ? "Edit Question" : "Add New Question"}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => {
                  setShowQuestionBuilder(false);
                  resetQuestionForm();
                }}></button>
              </div>

              <div className="modal-body p-4">
                {/* Question Type */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold text-uppercase">
                    Question Type
                  </label>
                  <select
                    className="form-select form-select-glass"
                    value={questionForm.type}
                    onChange={(e) => {
                      const newType = e.target.value as any;
                      setQuestionForm({
                        ...questionForm,
                        type: newType,
                        // Reset options based on type
                        options: newType === 'yes-no' ? [
                          { id: '1', label: 'Yes' },
                          { id: '2', label: 'No' }
                        ] : newType === 'text' || newType === 'textarea' || newType === 'file' ? undefined : [{ id: '1', label: '' }, { id: '2', label: '' }],
                        // Clear min/max selections if not checkbox
                        ...(newType !== 'checkbox' && {
                          minSelections: undefined,
                          maxSelections: undefined
                        }),
                        // Clear file formats if not file type
                        ...(newType !== 'file' && {
                          allowedFormats: [],
                          maxFileSize: 10,
                          maxFiles: 1
                        })
                      });
                    }}
                  >
                    <option value="text">Short Text Answer</option>
                    <option value="textarea">Long Text Answer</option>
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="checkbox">Checkboxes</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="yes-no">Yes/No</option>
                    <option value="file">File Upload</option>
                  </select>
                </div>

                {/* Question Text */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold text-uppercase">
                    Question Text <span className="required-asterisk">*</span>
                  </label>
                  <input
                    className="form-control form-control-glass"
                    value={questionForm.question}
                    onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                    placeholder="Enter your question here"
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold text-uppercase">
                    Description (Optional)
                  </label>
                  <textarea
                    className="form-control form-control-glass"
                    rows={2}
                    value={questionForm.description}
                    onChange={(e) => setQuestionForm({ ...questionForm, description: e.target.value })}
                    placeholder="Add additional instructions or context"
                  />
                </div>

                {/* Placeholder for text inputs */}
                {(questionForm.type === 'text' || questionForm.type === 'textarea') && (
                  <div className="mb-3">
                    <label className="form-label text-secondary small fw-bold text-uppercase">
                      Placeholder Text (Optional)
                    </label>
                    <input
                      className="form-control form-control-glass"
                      value={questionForm.placeholder}
                      onChange={(e) => setQuestionForm({ ...questionForm, placeholder: e.target.value })}
                      placeholder="e.g., Enter your answer here"
                    />
                  </div>
                )}

                {/* Max length for text inputs */}
                {(questionForm.type === 'text' || questionForm.type === 'textarea') && (
                  <div className="mb-3">
                    <label className="form-label text-secondary small fw-bold text-uppercase">
                      Maximum Characters
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-glass"
                      value={questionForm.maxLength}
                      onChange={(e) => setQuestionForm({ ...questionForm, maxLength: parseInt(e.target.value) || 100 })}
                      min="1"
                      max="5000"
                    />
                  </div>
                )}

                {/* Options for multiple choice, checkbox, dropdown */}
                {(questionForm.type === 'multiple-choice' || questionForm.type === 'checkbox' || questionForm.type === 'dropdown') && (
                  <div className="mb-3">
                    <label className="form-label text-secondary small fw-bold text-uppercase mb-2">
                      Options
                    </label>
                    <div className="list-group">
                      {questionForm.options?.map((option, index) => (
                        <div key={option.id} className="option-item list-group-item bg-transparent border border-secondary border-opacity-25 rounded mb-2 p-2">
                          <div className="d-flex align-items-center gap-2">
                            <span className="text-secondary small">{index + 1}.</span>
                            <input
                              className="form-control form-control-glass border-0"
                              value={option.label}
                              onChange={(e) => updateOption(option.id, e.target.value)}
                              placeholder={`Option ${index + 1}`}
                            />
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeOption(option.id)}
                              disabled={questionForm.options && questionForm.options.length <= 2}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      className="btn btn-outline-secondary btn-sm mt-2"
                      onClick={addOption}
                    >
                      <i className="bi bi-plus me-1"></i> Add Option
                    </button>
                  </div>
                )}

                {/* Min/Max selections for checkboxes */}
                {questionForm.type === 'checkbox' && (
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label text-secondary small fw-bold text-uppercase">
                        Minimum Selections
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-glass"
                        value={questionForm.minSelections || 0}
                        onChange={(e) => setQuestionForm({
                          ...questionForm,
                          minSelections: parseInt(e.target.value) || 0
                        })}
                        min="0"
                        max={questionForm.options?.length || 1}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-secondary small fw-bold text-uppercase">
                        Maximum Selections
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-glass"
                        value={questionForm.maxSelections || 1}
                        onChange={(e) => setQuestionForm({
                          ...questionForm,
                          maxSelections: parseInt(e.target.value) || 1
                        })}
                        min="1"
                        max={questionForm.options?.length || 1}
                      />
                    </div>
                  </div>
                )}

                {/* File upload specific fields */}
                {questionForm.type === 'file' && (
                  <>
                    {/* Allowed File Formats */}
                    <div className="mb-3">
                      <label className="form-label text-secondary small fw-bold text-uppercase mb-2">
                        Allowed File Formats
                      </label>
                      <div className="file-formats-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.5rem'
                      }}>
                        {commonFileFormats.map(format => {
                          const isSelected = questionForm.allowedFormats?.some(f =>
                            format.ext.split(',').includes(f)
                          );
                          return (
                            <div
                              key={format.id}
                              className={`file-format-checkbox p-2 rounded cursor-pointer ${isSelected ? 'selected' : ''}`}
                              onClick={() => toggleFileFormat(format.ext)}
                            >
                              <div className="form-check mb-0">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={isSelected}
                                  onChange={() => { }}
                                  style={{ cursor: 'pointer' }}
                                />
                                <label className="form-check-label small ms-2" style={{ cursor: 'pointer' }}>
                                  {format.label}
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-secondary small mt-2">
                        <i className="bi bi-info-circle me-1"></i>
                        Selected: {questionForm.allowedFormats?.join(', ') || 'None'}
                      </div>
                    </div>

                    {/* Max File Size */}
                    <div className="mb-3">
                      <label className="form-label text-secondary small fw-bold text-uppercase">
                        Maximum File Size (MB)
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-glass"
                        value={questionForm.maxFileSize}
                        onChange={(e) => setQuestionForm({
                          ...questionForm,
                          maxFileSize: parseInt(e.target.value) || 10
                        })}
                        min="1"
                        max="100"
                      />
                      <div className="text-secondary small mt-1">
                        <i className="bi bi-info-circle me-1"></i>
                        Maximum allowed file size in megabytes (1-100 MB)
                      </div>
                    </div>

                    {/* Max Number of Files */}
                    <div className="mb-3">
                      <label className="form-label text-secondary small fw-bold text-uppercase">
                        Maximum Number of Files
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-glass"
                        value={questionForm.maxFiles}
                        onChange={(e) => setQuestionForm({
                          ...questionForm,
                          maxFiles: parseInt(e.target.value) || 1
                        })}
                        min="1"
                        max="10"
                      />
                      <div className="text-secondary small mt-1">
                        <i className="bi bi-info-circle me-1"></i>
                        Maximum number of files user can upload (1-10)
                      </div>
                    </div>
                  </>
                )}

                {/* Required Toggle */}
                <div className="form-check form-switch p-3 bg-dark bg-opacity-50 rounded-3 border border-secondary border-opacity-25 d-flex align-items-center justify-content-between mb-4">
                  <label className="form-check-label text-white fw-medium mb-0 ms-1">
                    Required Question
                  </label>
                  <input
                    className="form-check-input m-0"
                    type="checkbox"
                    style={{ width: '3em', height: '1.5em', cursor: 'pointer' }}
                    checked={questionForm.required}
                    onChange={(e) => setQuestionForm({ ...questionForm, required: e.target.checked })}
                  />
                </div>

                {/* Preview */}
                <div className="preview-question p-3 rounded mb-3">
                  <h6 className="text-secondary small fw-bold text-uppercase mb-2">Preview</h6>
                  <p className="text-white mb-2">
                    {questionForm.question || "Sample Question"}
                    {questionForm.required && <span className="text-danger ms-1">*</span>}
                  </p>
                  {questionForm.description && (
                    <p className="text-secondary small mb-2">{questionForm.description}</p>
                  )}

                  {questionForm.type === 'text' && (
                    <input
                      className="form-control form-control-glass"
                      placeholder={questionForm.placeholder || "Your answer..."}
                      disabled
                    />
                  )}

                  {questionForm.type === 'textarea' && (
                    <textarea
                      className="form-control form-control-glass"
                      rows={3}
                      placeholder={questionForm.placeholder || "Your answer..."}
                      disabled
                    />
                  )}

                  {questionForm.type === 'multiple-choice' && questionForm.options && (
                    <div>
                      {questionForm.options.map(opt => (
                        <div key={opt.id} className="form-check mb-1">
                          <input className="form-check-input" type="radio" disabled />
                          <label className="form-check-label text-secondary">
                            {opt.label || "Option"}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {questionForm.type === 'checkbox' && questionForm.options && (
                    <div>
                      {questionForm.options.map(opt => (
                        <div key={opt.id} className="form-check mb-1">
                          <input className="form-check-input" type="checkbox" disabled />
                          <label className="form-check-label text-secondary">
                            {opt.label || "Option"}
                          </label>
                        </div>
                      ))}
                      {questionForm.type === 'checkbox' && (
                        <div className="mt-2 text-secondary small">
                          <i className="bi bi-info-circle me-1"></i>
                          Select between {questionForm.minSelections || 0} and {questionForm.maxSelections || questionForm.options.length} options
                        </div>
                      )}
                    </div>
                  )}

                  {questionForm.type === 'dropdown' && questionForm.options && (
                    <select className="form-select-glass" disabled>
                      <option>Select an option</option>
                      {questionForm.options.map(opt => (
                        <option key={opt.id}>{opt.label || "Option"}</option>
                      ))}
                    </select>
                  )}

                  {questionForm.type === 'yes-no' && (
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" disabled />
                        <label className="form-check-label text-secondary">Yes</label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" disabled />
                        <label className="form-check-label text-secondary">No</label>
                      </div>
                    </div>
                  )}

                  {questionForm.type === 'file' && (
                    <div className="border border-secondary border-opacity-25 rounded p-3 bg-dark bg-opacity-25">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <i className="bi bi-cloud-upload fs-4 text-info"></i>
                        <div className="flex-grow-1">
                          <div className="text-white small">Choose file{questionForm.maxFiles && questionForm.maxFiles > 1 ? 's' : ''}</div>
                          <div className="text-secondary small">
                            {questionForm.allowedFormats && questionForm.allowedFormats.length > 0
                              ? `${questionForm.allowedFormats.join(', ')} files`
                              : 'All files'}
                            {questionForm.maxFileSize && ` • Max ${questionForm.maxFileSize}MB`}
                            {questionForm.maxFiles && questionForm.maxFiles > 1 && ` • Max ${questionForm.maxFiles} files`}
                          </div>
                        </div>
                        <button className="btn btn-sm btn-outline-info" disabled>
                          Browse
                        </button>
                      </div>
                      <div className="text-secondary small">
                        <i className="bi bi-info-circle me-1"></i>
                        No file chosen
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer border-top border-secondary border-opacity-25 p-4">
                <button className="btn btn-outline-light rounded-pill px-4" onClick={() => {
                  setShowQuestionBuilder(false);
                  resetQuestionForm();
                }}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary rounded-pill px-5 fw-bold"
                  onClick={addQuestion}
                >
                  {editingQuestionId ? "Update Question" : "Add Question"}
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