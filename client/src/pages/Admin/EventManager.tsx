import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../components/AdminLayout";
import { createEvent, deleteEvent, getAllEvents, toggleEventDisplay, updateEvent } from "../../services/admin/eventService";
import FormBuilder from "../../components/FormBuilder/FormBuilder";
import { type IQuestion } from "../../types/formBuilder";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { CustomDatePicker } from "../../components/CustomDatePicker";
import { CustomTimePicker } from "../../components/CustomTimePicker";

// --- CSS Styles for Animation & Design ---
const styles = `
  /* --- Keyframes --- */
  @keyframes fadeInPicker {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse-glow {
    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
  }

  /* --- Glassmorphism Card Design --- */
  .event-card {
    background: rgba(31, 41, 55, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
  }
  
  .event-card:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: rgba(59, 130, 246, 0.5);
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.2);
    background: rgba(31, 41, 55, 0.95);
    z-index: 10;
  }

  .event-card::before {
    content: "";
    position: absolute;
    top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    transition: 0.5s;
  }
  
  .event-card:hover::before {
    left: 100%;
  }

  /* --- Action Buttons --- */
  .card-action-btn {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05);
    cursor: pointer;
  }

  .card-action-btn:hover {
    transform: scale(1.1);
  }

  .btn-edit:hover { background: rgba(13, 110, 253, 0.2); color: #3b82f6; border-color: #3b82f6; }
  .btn-delete:hover { background: rgba(220, 53, 69, 0.2); color: #ef4444; border-color: #ef4444; }

  /* --- IOS Toggle Switch --- */
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 26px;
  }
  
  .toggle-switch input { opacity: 0; width: 0; height: 0; }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: #374151;
    transition: .4s;
    border-radius: 34px;
    border: 1px solid rgba(255,255,255,0.1);
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  input:checked + .slider {
    background-color: #10b981; /* Green when active */
    border-color: #10b981;
  }
  
  input:checked + .slider:before {
    transform: translateX(22px);
  }

  /* --- ADMIN MODAL OVERLAY & STUDIO MODAL STYLES --- */
  .admin-modal-overlay {
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    width: 100vw; height: 100vh;
    z-index: 1050;
    display: flex; align-items: center; justify-content: center;
    padding: 1.25rem;
    overflow-y: auto;
    overflow-x: hidden;
    animation: fadeInModal 0.2s ease-out forwards;
  }

  @media (min-width: 992px) {
    .admin-modal-overlay {
      left: 280px;
      right: 0;
      width: calc(100vw - 280px);
      padding: 1.5rem;
    }
  }

  .admin-modal-overlay.closing {
    animation: fadeOutModal 0.2s ease-in forwards;
  }

  .admin-modal-overlay.closing .event-studio-modal {
    animation: scaleOutModal 0.2s ease-in forwards;
  }

  @keyframes fadeInModal {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOutModal {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes scaleInModal {
    from { transform: scale(0.96); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  @keyframes scaleOutModal {
    from { transform: scale(1); opacity: 1; }
    to { transform: scale(0.95); opacity: 0; }
  }

  @keyframes pulseDanger {
    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
    70% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }

  .event-studio-modal {
    max-width: 1060px;
    width: 95%;
    background: linear-gradient(165deg, #0f172a 0%, #090d16 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.05);
    position: relative;
    overflow: hidden;
    animation: scaleInModal 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .event-studio-modal::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #3b82f6, #8b5cf6, transparent);
    opacity: 0.9;
  }

  /* Dedicated crop modal without scale transform to prevent cropper offset distortion */
  .event-crop-modal {
    max-width: 760px;
    width: 100%;
    background: linear-gradient(165deg, #0f172a 0%, #090d16 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 18px;
    box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.05);
    position: relative;
    overflow: hidden;
    animation: fadeInCropModal 0.15s ease-out forwards;
  }

  .event-crop-modal::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #3b82f6, #8b5cf6, transparent);
    opacity: 0.9;
  }

  @keyframes fadeInCropModal {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Scrollbar */
  .event-studio-modal::-webkit-scrollbar { width: 8px; }
  .event-studio-modal::-webkit-scrollbar-track { background: transparent; }
  .event-studio-modal::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.2); border-radius: 4px; }

  /* --- 4-Step Studio Tab Slider --- */
  .tab-slider-wrapper {
    overflow: hidden;
    width: 100%;
    position: relative;
  }

  .tab-slider-track {
    display: flex;
    width: 400%;
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .tab-slide {
    width: 25%;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  /* --- Media Upload Frames --- */
  .media-upload-frame {
    border: 2px dashed rgba(59, 130, 246, 0.35);
    background: radial-gradient(circle at center, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%);
    border-radius: 12px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .media-upload-frame:hover {
    border-color: #3b82f6;
    box-shadow: 0 8px 24px -5px rgba(59, 130, 246, 0.25);
  }

  .media-upload-frame.has-image {
    border: 2px solid rgba(59, 130, 246, 0.5);
  }

  /* --- Inputs & Selects Glassmorphism --- */
  .form-control-glass, .form-select-glass {
    background: #060911 !important;
    border: 1px solid #1e293b !important;
    color: #ffffff !important;
    border-radius: 8px;
    padding: 0.6rem 0.85rem;
    transition: all 0.2s ease;
  }
  .form-control-glass::placeholder, textarea.form-control-glass::placeholder {
    color: #64748b !important;
    opacity: 1 !important;
    font-weight: 400 !important;
  }
  .form-control-glass:focus, .form-select-glass:focus {
    background: #060911 !important;
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2) !important;
    color: #ffffff !important;
  }
  .admin-input-group-text {
    background: rgba(30, 41, 59, 0.5) !important;
    border: 1px solid #1e293b !important;
    border-right: none !important;
    color: #94a3b8 !important;
    border-top-left-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
  }
  .input-group > .form-control-glass,
  .input-group > .form-select-glass {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }
  .input-group > .btn {
    border-top-right-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
  }
  .form-select-glass option {
    background-color: #0d1527;
    color: #ffffff;
  }
  .form-control-glass.is-invalid, .form-select-glass.is-invalid {
    border-color: #ef4444 !important;
    background: rgba(239, 68, 68, 0.08) !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
  }
  .form-control-glass.is-invalid:focus, .form-select-glass.is-invalid:focus {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
  }

  .form-control-dark {
    background-color: #060911;
    border: 1px solid #1e293b;
    color: #ffffff !important;
  }
  .form-control-dark:focus {
    background-color: #060911;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
  .form-control-dark.is-invalid {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.08);
  }
  .form-control-dark.is-invalid:focus {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
  }
  .form-control-dark::placeholder { color: #64748b !important; }
  .form-control-dark::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
  
  .form-section {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    padding: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.06);
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

  .phone-prefix {
    background-color: #1f2937;
    border: 1px solid #4b5563;
    color: #9ca3af;
    padding: 0.375rem 0.75rem;
    border-right: none;
    border-radius: 0.375rem 0 0 0.375rem;
  }

  /* --- MOBILE RESPONSIVENESS (< 768px) --- */
  @media (max-width: 768px) {
      /* 1. Add offset for floating navbar */
      .mobile-offset {
          padding-top: 85px !important;
      }

      /* 2. Adjust modal width and margin for mobile */
      .custom-modal-content {
          width: 95% !important;
          margin: 10px !important;
          max-height: 85vh;
      }

      /* 3. Button full width on mobile */
      .mobile-w-100 {
          width: 100% !important;
          justify-content: center;
      }
      
      .event-card:hover {
          transform: translateY(-4px) scale(1.01); /* Subtle hover on touch */
      }

      /* 4. Adjust phone input for mobile */
      .phone-input-group {
          flex-direction: column;
      }
      
      .phone-prefix {
          border-radius: 0.375rem 0.375rem 0 0;
          border-right: 1px solid #4b5563;
          border-bottom: none;
      }
      
      .phone-input {
          border-radius: 0 0 0.375rem 0.375rem;
      }
  }
`;

/* Types */
interface ContactPerson {
  name: string;
  phone: string;
}

interface Event {
  _id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  contactPersons: ContactPerson[];
  registrationQuestions: string[];
  customQuestions?: IQuestion[];
  whatsappGroupLink?: string;
  display: boolean;
}

// Validation errors interface
interface ValidationErrors {
  name?: string;
  date?: string;
  time?: string;
  venue?: string;
  description?: string;
  contactPersons?: string[];
  registrationQuestions?: string[];
  whatsappGroupLink?: string;
}

// Image cropping utilities
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('No 2d context');

  canvas.width = Math.max(1, Math.round(pixelCrop.width));
  canvas.height = Math.max(1, Math.round(pixelCrop.height));

  let bgColor = '#ffffff';
  try {
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = 1;
    sampleCanvas.height = 1;
    const sampleCtx = sampleCanvas.getContext('2d');
    if (sampleCtx) {
      sampleCtx.drawImage(image, 0, 0, 1, 1, 0, 0, 1, 1);
      const p = sampleCtx.getImageData(0, 0, 1, 1).data;
      if (p[3] > 0) {
        bgColor = `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
      }
    }
  } catch (_) {}

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const sX = Math.max(0, pixelCrop.x);
  const sY = Math.max(0, pixelCrop.y);
  const sWidth = Math.min(image.naturalWidth - sX, pixelCrop.width - (sX - pixelCrop.x));
  const sHeight = Math.min(image.naturalHeight - sY, pixelCrop.height - (sY - pixelCrop.y));

  const dX = Math.max(0, sX - pixelCrop.x);
  const dY = Math.max(0, sY - pixelCrop.y);
  const dWidth = Math.max(0, sWidth);
  const dHeight = Math.max(0, sHeight);

  if (dWidth > 0 && dHeight > 0) {
    ctx.drawImage(
      image,
      sX,
      sY,
      sWidth,
      sHeight,
      dX,
      dY,
      dWidth,
      dHeight
    );
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      resolve(URL.createObjectURL(blob));
    }, 'image/jpeg', 0.95);
  });
};

// Required registration questions (cannot be edited/removed)
const REQUIRED_REGISTRATION_QUESTIONS = [
  "Name",
  "Register Number",
  "Department",
  "Year",
  "Section",
  "Email ID",
  "Mobile Number"
];

const EventManager: React.FC = () => {
  /* Events list */
  const [events, setEvents] = useState<Event[]>([]);

  /* Modal control */
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  type EventModalTab = 'info' | 'schedule' | 'contacts' | 'form';
  const [eventModalTab, setEventModalTab] = useState<EventModalTab>('info');

  // Media & Crop States
  const [, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>("");

  // Start Time & End Time States
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const [showCropModal, setShowCropModal] = useState(false);
  const [cropTarget, setCropTarget] = useState<'thumbnail' | 'poster' | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [previewModalImage, setPreviewModalImage] = useState<{ src: string; title: string; ratio?: string } | null>(null);

  /* Validation state */
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const [toast, setToast] = useState<{
    show: boolean;
    variant: "success" | "error" | "info" | "warning";
    message: string;
    title?: string;
  }>({
    show: false,
    variant: "info",
    message: "",
  });

  const showToast = (
    variant: "success" | "error" | "info" | "warning",
    message: string,
    title?: string
  ) => {
    setToast({ show: true, variant, message, title });
  };

  // --- VALIDATION UTILITIES ---
  const validateName = (name: string): string => {
    if (!name.trim()) return "Event name is required";
    if (name.length < 3) return "Event name must be at least 3 characters";
    if (name.length > 100) return "Event name must be less than 100 characters";
    return "";
  };

  const validateDate = (date: string, isEditing: boolean = false): string => {
    if (!date) return "Event date is required";

    if (!isEditing) {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return "Event date cannot be in the past";
      }
    }

    return "";
  };

  const validateTime = (start: string, end?: string): string => {
    if (!start || !start.trim()) return "Start time is required";

    const timeRegex = /^(0[1-9]|1[0-2]):([0-5][0-9])\s*(AM|PM)$/i;
    if (!timeRegex.test(start.trim())) {
      return "Start time must be valid (e.g., 09:30 AM)";
    }

    if (end && end.trim() && !timeRegex.test(end.trim())) {
      return "End time must be valid (e.g., 12:30 PM)";
    }

    return "";
  };

  const validateVenue = (venue: string): string => {
    if (!venue.trim()) return "Venue is required";
    if (venue.length < 3) return "Venue must be at least 3 characters";
    if (venue.length > 200) return "Venue must be less than 200 characters";
    return "";
  };

  const validateDescription = (description: string): string => {
    if (!description.trim()) {
      return "Event description is required";
    }
    if (description.length < 10) {
      return "Description must be at least 10 characters";
    }
    if (description.length > 500) {
      return "Description must be less than 500 characters";
    }
    return "";
  };

  const validateContactName = (name: string): string => {
    if (!name.trim()) return "Contact name is required";
    if (name.length < 2) return "Contact name must be at least 2 characters";
    if (name.length > 50) return "Contact name must be less than 50 characters";
    return "";
  };

  const validatePhoneNumber = (phone: string): string => {
    if (!phone.trim()) return "Phone number is required";

    // Remove +91 prefix for validation
    const cleanPhone = phone.replace(/^\+91/, '').trim();

    if (!/^\d{10}$/.test(cleanPhone)) {
      return "Phone number must be 10 digits (e.g., 9876543210)";
    }

    return "";
  };

  const validateRegistrationQuestion = (question: string, index: number): string => {
    // For required questions, they should not be empty
    if (index < REQUIRED_REGISTRATION_QUESTIONS.length) {
      if (question !== REQUIRED_REGISTRATION_QUESTIONS[index]) {
        return `This required question cannot be changed`;
      }
      return "";
    }

    // For custom questions
    if (!question.trim()) {
      return "Question cannot be empty";
    }
    if (question.length < 3) {
      return "Question must be at least 3 characters";
    }
    if (question.length > 200) {
      return "Question must be less than 200 characters";
    }
    return "";
  };

  const validateWhatsAppUrl = (url: string): string => {
    if (!url) return "";

    const trimmedUrl = url.trim();
    if (!trimmedUrl) return "";

    try {
      const urlObj = new URL(trimmedUrl);
      if (!urlObj.hostname.includes('chat.whatsapp.com')) {
        return "Must be a valid WhatsApp invite URL (chat.whatsapp.com)";
      }
    } catch {
      return "Please enter a valid URL";
    }

    return "";
  };

  // Section completion check helpers
  const isStep1Valid = (): boolean => {
    return !validateName(form.name) && !validateDescription(form.description);
  };

  const isStep2Valid = (): boolean => {
    return (
      !validateDate(form.date, Boolean(editingId)) &&
      !validateTime(startTime, endTime) &&
      !validateVenue(form.venue)
    );
  };

  const isStep3Valid = (): boolean => {
    if (!form.contactPersons || form.contactPersons.length === 0) return false;
    const hasContactError = form.contactPersons.some(
      (c) => validateContactName(c.name) !== "" || validatePhoneNumber(c.phone) !== ""
    );
    const whatsappError = validateWhatsAppUrl(form.whatsappGroupLink || "");
    return !hasContactError && !whatsappError;
  };

  const canAccessTab = (tabId: EventModalTab): boolean => {
    if (tabId === 'info') return true;
    if (tabId === 'schedule') return isStep1Valid();
    if (tabId === 'contacts') return isStep1Valid() && isStep2Valid();
    if (tabId === 'form') return isStep1Valid() && isStep2Valid() && isStep3Valid();
    return false;
  };

  const [form, setForm] = useState<Event>({
    _id: "",
    name: "",
    date: "",
    time: "",
    venue: "",
    description: "",
    contactPersons: [{ name: "", phone: "" }],
    registrationQuestions: REQUIRED_REGISTRATION_QUESTIONS,
    customQuestions: [],
    whatsappGroupLink: "",
    display: true,
  });

  const validateAllFields = (): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Validate basic fields
    errors.name = validateName(form.name);
    errors.date = validateDate(form.date, Boolean(editingId));
    errors.time = validateTime(startTime, endTime);
    errors.venue = validateVenue(form.venue);
    errors.description = validateDescription(form.description);
    errors.whatsappGroupLink = validateWhatsAppUrl(form.whatsappGroupLink || "");

    // Validate contact persons
    const contactErrors: string[] = [];
    form.contactPersons.forEach((contact, index) => {
      const nameError = validateContactName(contact.name);
      const phoneError = validatePhoneNumber(contact.phone);

      if (nameError || phoneError) {
        contactErrors[index] = nameError || phoneError;
      }
    });

    if (contactErrors.length > 0) {
      errors.contactPersons = contactErrors;
    }

    // Validate registration questions
    const questionErrors: string[] = [];
    form.registrationQuestions.forEach((question, index) => {
      const error = validateRegistrationQuestion(question, index);
      if (error) {
        questionErrors[index] = error;
      }
    });

    if (questionErrors.length > 0) {
      errors.registrationQuestions = questionErrors;
    }

    // Remove empty error arrays
    if (errors.contactPersons?.every(err => !err)) {
      delete errors.contactPersons;
    }
    if (errors.registrationQuestions?.every(err => !err)) {
      delete errors.registrationQuestions;
    }

    return errors;
  };

  const hasValidationErrors = useMemo(() => {
    const errors = validateAllFields();
    return Object.values(errors).some(error => {
      if (Array.isArray(error)) {
        return error.some(err => err);
      }
      return error !== "";
    });
  }, [form]);

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const res = await getAllEvents();
      setEvents(res.events || []);
    } catch (error: any) {
      showToast("error", error.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAllEvents();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (previewModalImage) {
          setPreviewModalImage(null);
        } else if (showCropModal) {
          setShowCropModal(false);
        } else if (showModal) {
          closeModal();
        }
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showModal, previewModalImage, showCropModal]);

  // Reset validation errors when modal closes
  useEffect(() => {
    if (!showModal) {
      setValidationErrors({});
    }
  }, [showModal]);

  // Recalculate cropper dimensions when crop modal opens
  useEffect(() => {
    if (showCropModal) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [showCropModal]);

  const resetForm = () => {
    setForm({
      _id: "",
      name: "",
      date: "",
      time: "",
      venue: "",
      description: "",
      contactPersons: [{ name: "", phone: "" }],
      registrationQuestions: REQUIRED_REGISTRATION_QUESTIONS,
      customQuestions: [],
      whatsappGroupLink: "",
      display: true,
    });
    setStartTime("");
    setEndTime("");
    setThumbnailFile(null);
    setThumbnailPreview("");
    setPosterFile(null);
    setPosterPreview("");
    setEditingId(null);
    setEventModalTab("info");
    setValidationErrors({});
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        showToast("error", "Thumbnail image must be less than 5MB");
        return;
      }
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setCropTarget('thumbnail');
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
      // Reset input value so same file can be selected again
      e.target.value = "";
    }
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 8 * 1024 * 1024) {
        showToast("error", "Poster image must be less than 8MB");
        return;
      }
      setPosterFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setCropTarget('poster');
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
      // Reset input value so same file can be selected again
      e.target.value = "";
    }
  };

  const handleCropSave = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    try {
      const croppedUrl = await getCroppedImg(imageToCrop, croppedAreaPixels);
      if (cropTarget === 'thumbnail') {
        setThumbnailPreview(croppedUrl);
      } else if (cropTarget === 'poster') {
        setPosterPreview(croppedUrl);
      }
      setShowCropModal(false);
      setImageToCrop("");
      setCropTarget(null);
    } catch {
      showToast("error", "Failed to crop image");
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview("");
  };

  const removePoster = () => {
    setPosterFile(null);
    setPosterPreview("");
  };

  const tabOrder: Array<EventModalTab> = ['info', 'schedule', 'contacts', 'form'];

  const handleTabClick = (tabId: EventModalTab) => {
    if (canAccessTab(tabId)) {
      setEventModalTab(tabId);
      return;
    }

    // Trigger validation on current step to clearly show missing fields
    if (!isStep1Valid()) {
      setValidationErrors((prev) => ({
        ...prev,
        name: validateName(form.name),
        description: validateDescription(form.description),
      }));
      setEventModalTab('info');
      showToast("warning", "Please complete all required fields in Basic Info first");
    } else if (!isStep2Valid()) {
      setValidationErrors((prev) => ({
        ...prev,
        date: validateDate(form.date, Boolean(editingId)),
        time: validateTime(startTime, endTime),
        venue: validateVenue(form.venue),
      }));
      setEventModalTab('schedule');
      showToast("warning", "Please complete Date, Time, and Venue first");
    } else if (!isStep3Valid()) {
      const contactErrors: string[] = [];
      form.contactPersons.forEach((contact, index) => {
        const nameErr = validateContactName(contact.name);
        const phoneErr = validatePhoneNumber(contact.phone);
        if (nameErr || phoneErr) {
          contactErrors[index] = nameErr || phoneErr;
        }
      });
      setValidationErrors((prev) => ({
        ...prev,
        contactPersons: contactErrors.length > 0 ? contactErrors : undefined,
        whatsappGroupLink: validateWhatsAppUrl(form.whatsappGroupLink || ""),
      }));
      setEventModalTab('contacts');
      showToast("warning", "Please provide valid coordinator contact details first");
    }
  };

  const handleNextTab = () => {
    if (eventModalTab === 'info') {
      const nameErr = validateName(form.name);
      const descErr = validateDescription(form.description);
      if (nameErr || descErr) {
        setValidationErrors((prev) => ({
          ...prev,
          name: nameErr,
          description: descErr,
        }));
        showToast("warning", "Please complete all required fields in Basic Info");
        return;
      }
      setEventModalTab('schedule');
    } else if (eventModalTab === 'schedule') {
      const dateErr = validateDate(form.date, Boolean(editingId));
      const timeErr = validateTime(startTime, endTime);
      const venueErr = validateVenue(form.venue);
      if (dateErr || timeErr || venueErr) {
        setValidationErrors((prev) => ({
          ...prev,
          date: dateErr,
          time: timeErr,
          venue: venueErr,
        }));
        showToast("warning", "Please provide valid Date, Time, and Venue");
        return;
      }
      setEventModalTab('contacts');
    } else if (eventModalTab === 'contacts') {
      const contactErrors: string[] = [];
      form.contactPersons.forEach((contact, index) => {
        const nameErr = validateContactName(contact.name);
        const phoneErr = validatePhoneNumber(contact.phone);
        if (nameErr || phoneErr) {
          contactErrors[index] = nameErr || phoneErr;
        }
      });
      const waErr = validateWhatsAppUrl(form.whatsappGroupLink || "");
      if (contactErrors.length > 0 || waErr || form.contactPersons.length === 0) {
        setValidationErrors((prev) => ({
          ...prev,
          contactPersons: contactErrors.length > 0 ? contactErrors : undefined,
          whatsappGroupLink: waErr,
        }));
        showToast("warning", "Please provide valid coordinator contact details");
        return;
      }
      setEventModalTab('form');
    }
  };

  const handlePreviousTab = () => {
    const currentIndex = tabOrder.indexOf(eventModalTab);
    if (currentIndex > 0) {
      setEventModalTab(tabOrder[currentIndex - 1]);
    }
  };

  const getNextTabTitle = () => {
    switch (eventModalTab) {
      case 'info':
        return 'Poster & Schedule';
      case 'schedule':
        return 'Contacts & Links';
      case 'contacts':
        return `Form Builder (${form.customQuestions?.length || 0})`;
      default:
        return 'Submit';
    }
  };

  // --- Modal Logic ---
  const handleCreateEvent = () => {
    resetForm();
    setIsClosing(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setIsClosing(true);

    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
      resetForm();
    }, 300);
  };

  const handleEditEvent = (event: Event) => {
    const formattedDate = event.date
      ? new Date(event.date).toISOString().split("T")[0]
      : "";

    const rawTime = event.time || "";
    let sTime = "";
    let eTime = "";
    if (rawTime.includes(" - ")) {
      const parts = rawTime.split(" - ");
      sTime = parts[0]?.trim() || "";
      eTime = parts[1]?.trim() || "";
    } else if (rawTime.includes("-")) {
      const parts = rawTime.split("-");
      sTime = parts[0]?.trim() || "";
      eTime = parts[1]?.trim() || "";
    } else if (rawTime.toLowerCase().includes(" to ")) {
      const parts = rawTime.split(/ to /i);
      sTime = parts[0]?.trim() || "";
      eTime = parts[1]?.trim() || "";
    } else {
      sTime = rawTime.trim();
      eTime = "";
    }

    setStartTime(sTime);
    setEndTime(eTime);

    const customQuestions: IQuestion[] =
      event.customQuestions && event.customQuestions.length > 0
        ? event.customQuestions
        : (event.registrationQuestions || []).map((q, idx) => ({
            id: `q_legacy_${idx}`,
            type: "text",
            question: q,
            required: idx < REQUIRED_REGISTRATION_QUESTIONS.length,
          }));

    setForm({
      ...event,
      date: formattedDate,
      time: rawTime,
      customQuestions: customQuestions,
    });

    setThumbnailFile(null);
    setThumbnailPreview("");
    setPosterFile(null);
    setPosterPreview("");

    setEditingId(event._id);
    setEventModalTab("info");
    setIsClosing(false);
    setShowModal(true);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete?._id) return;

    try {
      setLoading(true);

      const res = await deleteEvent(eventToDelete._id);

      setEvents(prev => prev.filter(e => e._id !== eventToDelete._id));

      showToast("success", res?.message || "Event deleted successfully");

      setShowDeleteModal(false);
    } catch (error: any) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleToggleDisplay = async (
    id: string,
    currentDisplay: boolean
  ) => {
    try {
      const newDisplay = !currentDisplay;

      const res = await toggleEventDisplay(id, newDisplay);

      setEvents(prev =>
        prev.map(e =>
          e._id === id ? { ...e, display: newDisplay } : e
        )
      );

      showToast("success", res?.message || `Event ${newDisplay ? "shown" : "hidden"}`);
    } catch (error: any) {
      showToast("error", error.message);
    }
  };


  const handleSaveEvent = async () => {
    // Validate all fields before submission
    const errors = validateAllFields();
    setValidationErrors(errors);

    const hasErrors = Object.values(errors).some(error => {
      if (Array.isArray(error)) {
        return error.some(err => err);
      }
      return Boolean(error);
    });

    if (hasErrors) {
      showToast(
        "error",
        "Please fix all validation errors before saving",
        "Validation Failed"
      );
      return;
    }

    try {
      setIsSubmitting(true);

      let res;

      if (editingId) {
        res = await updateEvent(editingId, form);
      } else {
        res = await createEvent(form);
      }

      // ✅ server message
      showToast("success", res?.message || "Operation successful");

      await fetchAllEvents();
      closeModal();
    } catch (error: any) {
      showToast("error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handlePhoneChange = (value: string, index: number) => {
    // Remove any non-digit characters
    const digits = value.replace(/\D/g, '');

    // Limit to 10 digits
    const phone = digits.slice(0, 10);

    const list = [...form.contactPersons];
    list[index].phone = phone;
    setForm({ ...form, contactPersons: list });

    // Validate phone
    const error = validatePhoneNumber(phone);
    if (validationErrors.contactPersons) {
      const newErrors = [...validationErrors.contactPersons];
      newErrors[index] = error;
      setValidationErrors({ ...validationErrors, contactPersons: newErrors });
    }
  };

  const handleContactNameChange = (value: string, index: number) => {
    const list = [...form.contactPersons];
    list[index].name = value;
    setForm({ ...form, contactPersons: list });

    // Validate name
    const error = validateContactName(value);
    if (validationErrors.contactPersons) {
      const newErrors = [...validationErrors.contactPersons];
      newErrors[index] = error;
      setValidationErrors({ ...validationErrors, contactPersons: newErrors });
    }
  };

  return (
    <AdminLayout
      active="Events"
      loading={loading || isSubmitting}
      toast={{
        show: toast.show,
        variant: toast.variant,
        message: toast.message,
        title: toast.title,
      }}
      onCloseToast={() => setToast(prev => ({ ...prev, show: false }))}
    >
      {/* Inject Styles */}
      <style>{styles}</style>

      {/* Main Wrapper with Mobile Offset for Navbar */}
      <div className="mobile-offset">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold text-white mb-1">Events Dashboard</h2>
            <p className="text-secondary m-0">Manage your schedule and registrations</p>
          </div>
          <button
            className="btn btn-primary px-4 py-2 fw-semibold shadow-lg d-flex align-items-center gap-2 mobile-w-100"
            onClick={handleCreateEvent}
            style={{ borderRadius: '12px' }}
          >
            <i className="bi bi-plus-lg"></i>
            <span>Create Event</span>
          </button>
        </div>

        {/* Events Grid */}
        <div className="row g-4">
          {events.length === 0 && (
            <div className="col-12 text-center py-5">
              <i className="bi bi-calendar-x display-1 text-white opacity-50 mb-3 d-block"></i>
              <h4 className="text-white fw-semibold">No events found</h4>
              <p className="text-white-50">Create a new event to get started!</p>
            </div>
          )}

          {events.map((event, index) => (
            <div
              key={event._id}
              className="col-12 col-md-6 col-xl-4"
              style={{ animation: `slideInUp 0.5s ease-out forwards ${index * 0.1}s`, opacity: 0 }}
            >
              <div className="event-card h-100 d-flex flex-column p-4">

                {/* Card Top: Status & Toggle */}
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div
                    className={`badge rounded-pill px-3 py-2 ${event.display
                      ? "bg-success bg-opacity-10 text-success"
                      : "bg-secondary bg-opacity-25 text-secondary"
                      }`}
                  >
                    <i
                      className={`bi ${event.display
                        ? "bi-eye-fill"
                        : "bi-eye-slash-fill"
                        } me-2`}
                    ></i>
                    {event.display ? "Visible" : "Hidden"}
                  </div>

                  <label className="toggle-switch" title="Toggle Active Status">
                    <input
                      type="checkbox"
                      checked={event.display !== false}
                      onChange={() => handleToggleDisplay(event._id, event.display !== false)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                {/* Card Body: Info */}
                <div className="mb-4 flex-grow-1">
                  <h4 className="fw-bold text-white mb-3 text-truncate" title={event.name}>
                    {event.name}
                  </h4>

                  <div className="d-flex flex-column gap-2 text-secondary">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-dark rounded-circle d-flex align-items-center justify-content-center border border-secondary border-opacity-25" style={{ width: 32, height: 32 }}>
                        <i className="bi bi-calendar-event text-info"></i>
                      </div>
                      <span className="small">{event.date}</span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-dark rounded-circle d-flex align-items-center justify-content-center border border-secondary border-opacity-25" style={{ width: 32, height: 32 }}>
                        <i className="bi bi-clock text-warning"></i>
                      </div>
                      <span className="small">{event.time}</span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-dark rounded-circle d-flex align-items-center justify-content-center border border-secondary border-opacity-25" style={{ width: 32, height: 32 }}>
                        <i className="bi bi-geo-alt text-danger"></i>
                      </div>
                      <span className="small text-truncate">{event.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Actions */}
                <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-25">
                  <div className="small text-muted d-flex align-items-center gap-1">
                    <i className="bi bi-people"></i>
                    {event.contactPersons?.length || 0} Contacts
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="card-action-btn btn-edit text-light"
                      onClick={() => handleEditEvent(event)}
                      title="Edit Event"
                    >
                      <i className="bi bi-pencil-fill small"></i>
                    </button>

                    <button
                      className="card-action-btn btn-delete text-light"
                      onClick={() => {
                        setEventToDelete(event);
                        setShowDeleteModal(true);
                      }}
                      title="Delete Event"
                    >
                      <i className="bi bi-trash-fill small"></i>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Unified Modal (Create & Edit) --- */}
      {showModal && (
        <div className={`admin-modal-overlay ${isClosing ? 'closing' : ''}`}>
          <div className="event-studio-modal p-4 p-md-4.5" style={{ maxWidth: '1060px', width: '95%' }}>

            {/* Modal Header */}
            <div className="d-flex justify-content-between align-items-center mb-3 pb-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8'
                  }}
                >
                  <i className={`bi ${editingId ? 'bi-calendar-check' : 'bi-calendar-plus'} fs-5`}></i>
                </div>
                <div>
                  <h5 className="m-0 fw-bold text-white tracking-tight" style={{ fontSize: '1.15rem' }}>
                    {editingId ? "Edit Event Details" : "Create New Event"}
                  </h5>
                  <p className="text-secondary small mb-0 mt-0.5" style={{ fontSize: '0.8rem' }}>
                    Configure event schedule, venue, contact persons, and registration form
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="btn btn-sm btn-link text-secondary text-decoration-none p-1.5 rounded-circle hover-light"
                style={{ lineHeight: 1 }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Modal Tabs - Sleek 4-Step Segmented Studio Design */}
            <div
              className="d-flex mb-3 p-1 rounded-3"
              style={{
                background: '#060911',
                border: '1px solid #1e293b',
                gap: '6px',
                minHeight: '46px'
              }}
            >
              {[
                { id: 'info' as const, label: '1. Basic Info', icon: 'bi-info-circle', isCompleted: isStep1Valid() },
                { id: 'schedule' as const, label: '2. Poster & Schedule', icon: 'bi-calendar-event', isCompleted: isStep1Valid() && isStep2Valid() },
                { id: 'contacts' as const, label: '3. Contacts & Links', icon: 'bi-people', isCompleted: isStep1Valid() && isStep2Valid() && isStep3Valid() },
                { id: 'form' as const, label: '4. Form Builder', icon: 'bi-ui-checks-grid', count: form.customQuestions?.length || 0, isCompleted: false }
              ].map((tab) => {
                const isActive = eventModalTab === tab.id;
                const isAccessible = canAccessTab(tab.id);

                return (
                  <button
                    key={tab.id}
                    type="button"
                    className="btn flex-fill py-2 px-2.5 rounded-2 fw-medium d-flex align-items-center justify-content-center border-0 position-relative text-nowrap"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(59, 130, 246, 0.12) 100%)'
                        : 'transparent',
                      border: isActive
                        ? '1px solid rgba(59, 130, 246, 0.5)'
                        : '1px solid transparent',
                      color: isActive ? '#ffffff' : isAccessible ? '#94a3b8' : '#475569',
                      boxShadow: isActive
                        ? '0 4px 14px -2px rgba(37, 99, 235, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
                        : 'none',
                      transition: 'all 0.25s ease',
                      fontSize: '0.84rem',
                      gap: '8px',
                      opacity: isAccessible ? 1 : 0.55,
                      cursor: isAccessible ? 'pointer' : 'not-allowed'
                    }}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '6px',
                        background: isActive
                          ? 'rgba(56, 189, 248, 0.2)'
                          : tab.isCompleted && !isActive
                          ? 'rgba(34, 197, 94, 0.15)'
                          : 'rgba(255, 255, 255, 0.05)',
                        color: isActive
                          ? '#38bdf8'
                          : tab.isCompleted && !isActive
                          ? '#4ade80'
                          : isAccessible
                          ? '#64748b'
                          : '#334155',
                        border: `1px solid ${
                          isActive
                            ? 'rgba(56, 189, 248, 0.4)'
                            : tab.isCompleted && !isActive
                            ? 'rgba(34, 197, 94, 0.3)'
                            : 'rgba(255, 255, 255, 0.05)'
                        }`,
                        fontSize: '0.75rem'
                      }}
                    >
                      {tab.isCompleted && !isActive ? (
                        <i className="bi bi-check2 fw-bold"></i>
                      ) : !isAccessible ? (
                        <i className="bi bi-lock-fill"></i>
                      ) : (
                        <i className={`bi ${tab.icon}`}></i>
                      )}
                    </div>
                    <span className="fw-semibold">{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className="badge px-1.5 py-0.5 ms-1"
                        style={{
                          fontSize: '0.7rem',
                          background: isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                          color: isActive ? '#38bdf8' : '#94a3b8',
                          border: `1px solid ${isActive ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                          borderRadius: '6px',
                          fontWeight: 600
                        }}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Body with Smooth 4-Step Sliding Track */}
            <div className="tab-slider-wrapper">
              <div
                className="tab-slider-track"
                style={{
                  transform:
                    eventModalTab === 'info'
                      ? 'translateX(0%)'
                      : eventModalTab === 'schedule'
                      ? 'translateX(-25%)'
                      : eventModalTab === 'contacts'
                      ? 'translateX(-50%)'
                      : 'translateX(-75%)'
                }}
              >
                {/* --- SLIDE 1: Basic Info --- */}
                <div className="tab-slide px-1">
                  <div className="row g-3 g-lg-4 align-items-stretch">
                    {/* Left: Name & Description */}
                    <div className="col-lg-7 d-flex flex-column gap-3">
                      {/* Event Name */}
                      <div>
                        <label className="admin-form-label">
                          Event Name <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="admin-input-group-text">
                            <i className="bi bi-card-heading"></i>
                          </span>
                          <input
                            className={`form-control form-control-glass ${validationErrors.name ? 'is-invalid' : ''}`}
                            placeholder="Enter event name"
                            value={form.name}
                            onChange={(e) => {
                              setForm({ ...form, name: e.target.value });
                              setValidationErrors({ ...validationErrors, name: validateName(e.target.value) });
                            }}
                            maxLength={100}
                          />
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-1 px-1">
                          {validationErrors.name ? (
                            <div className="invalid-feedback-custom m-0">{validationErrors.name}</div>
                          ) : <div />}
                          <div className={`character-counter m-0 ${form.name.length > 90 ? 'warning' : ''} ${form.name.length >= 100 ? 'danger' : ''}`}>
                            {form.name.length} / 100
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="flex-grow-1 d-flex flex-column">
                        <label className="admin-form-label">
                          Event Description <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className={`form-control form-control-glass flex-grow-1 ${validationErrors.description ? 'is-invalid' : ''}`}
                          rows={6}
                          placeholder="Describe the event, objectives, and highlights..."
                          value={form.description}
                          onChange={(e) => {
                            setForm({ ...form, description: e.target.value });
                            setValidationErrors({ ...validationErrors, description: validateDescription(e.target.value) });
                          }}
                          maxLength={500}
                          style={{ resize: 'none', height: '145px' }}
                        />
                        <div className="d-flex justify-content-between align-items-center mt-1 px-1">
                          {validationErrors.description ? (
                            <div className="invalid-feedback-custom m-0">{validationErrors.description}</div>
                          ) : <div />}
                          <div className={`character-counter m-0 ${form.description.length > 450 ? 'warning' : ''} ${form.description.length >= 500 ? 'danger' : ''}`}>
                            {form.description.length} / 500
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Thumbnail Upload */}
                    <div className="col-lg-5 d-flex flex-column">
                      <label className="admin-form-label">
                        Event Thumbnail <span className="text-secondary opacity-75 fw-normal">(Optional · 16:9 Card Ratio)</span>
                      </label>
                      <div
                        className={`media-upload-frame d-flex flex-column align-items-center justify-content-center p-3 text-center flex-grow-1 ${thumbnailPreview ? 'has-image' : ''}`}
                        style={{ minHeight: '260px', height: '100%' }}
                      >
                        {thumbnailPreview ? (
                          <div className="position-relative w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                            <img
                              src={thumbnailPreview}
                              alt="Thumbnail preview"
                              className="cursor-pointer"
                              style={{ width: '100%', maxHeight: '180px', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', cursor: 'pointer' }}
                              onClick={() => setPreviewModalImage({ src: thumbnailPreview, title: 'Event Thumbnail Preview', ratio: '16:9 Card' })}
                              title="Click to preview"
                            />
                            <div className="d-flex align-items-center gap-2 mt-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-info py-1 px-2.5 d-inline-flex align-items-center gap-1.5"
                                style={{ fontSize: '0.75rem', borderRadius: '6px' }}
                                onClick={() => setPreviewModalImage({ src: thumbnailPreview, title: 'Event Thumbnail Preview', ratio: '16:9 Card' })}
                              >
                                <i className="bi bi-eye"></i> Preview
                              </button>
                              <label
                                className="btn btn-sm btn-outline-primary py-1 px-2.5 d-inline-flex align-items-center gap-1.5"
                                style={{ fontSize: '0.75rem', cursor: 'pointer', borderRadius: '6px' }}
                              >
                                <i className="bi bi-arrow-repeat"></i> Change
                                <input type="file" accept="image/*" className="d-none" onChange={handleThumbnailChange} />
                              </label>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger py-1 px-2.5 d-inline-flex align-items-center gap-1.5"
                                style={{ fontSize: '0.75rem', borderRadius: '6px' }}
                                onClick={removeThumbnail}
                              >
                                <i className="bi bi-trash"></i> Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="d-flex flex-column align-items-center justify-content-center w-100 h-100 cursor-pointer mb-0" style={{ cursor: 'pointer' }}>
                            <div
                              className="d-flex align-items-center justify-content-center mb-2"
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: '12px',
                                background: 'rgba(56, 189, 248, 0.1)',
                                border: '1px solid rgba(56, 189, 248, 0.25)',
                                color: '#38bdf8'
                              }}
                            >
                              <i className="bi bi-image fs-4"></i>
                            </div>
                            <span className="fw-semibold text-white small mb-1">Click to upload thumbnail</span>
                            <span className="text-secondary" style={{ fontSize: '0.75rem' }}>16:9 Card ratio (Max 5MB)</span>
                            <input type="file" accept="image/*" className="d-none" onChange={handleThumbnailChange} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- SLIDE 2: Poster, Date, Time, Venue --- */}
                <div className="tab-slide px-1">
                  <div className="row g-3 g-lg-4 align-items-stretch">
                    {/* Left: Poster */}
                    <div className="col-lg-5 d-flex flex-column">
                      <label className="admin-form-label">
                        Event Poster <span className="text-secondary opacity-75 fw-normal">(Optional · 1810 × 2560 Portrait)</span>
                      </label>
                      <div
                        className={`media-upload-frame d-flex flex-column align-items-center justify-content-center p-2.5 text-center flex-grow-1 ${posterPreview ? 'has-image' : ''}`}
                        style={{ minHeight: '330px', height: '100%' }}
                      >
                        {posterPreview ? (
                          <div className="position-relative w-100 h-100 d-flex flex-column align-items-center justify-content-center pt-3 pb-2">
                            <img
                              src={posterPreview}
                              alt="Poster preview"
                              className="cursor-pointer"
                              style={{
                                height: '255px',
                                maxHeight: '270px',
                                maxWidth: '100%',
                                aspectRatio: '1810 / 2560',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(56, 189, 248, 0.15)',
                                cursor: 'pointer'
                              }}
                              onClick={() => setPreviewModalImage({ src: posterPreview, title: 'Event Poster Preview', ratio: '1810 × 2560 Portrait' })}
                              title="Click to preview"
                            />
                            <div className="d-flex align-items-center gap-2 mt-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-info py-1 px-2.5 d-inline-flex align-items-center gap-1.5"
                                style={{ fontSize: '0.75rem', borderRadius: '6px' }}
                                onClick={() => setPreviewModalImage({ src: posterPreview, title: 'Event Poster Preview', ratio: '1810 × 2560 Portrait' })}
                              >
                                <i className="bi bi-eye"></i> Preview
                              </button>
                              <label
                                className="btn btn-sm btn-outline-primary py-1 px-2.5 d-inline-flex align-items-center gap-1.5"
                                style={{ fontSize: '0.75rem', cursor: 'pointer', borderRadius: '6px' }}
                              >
                                <i className="bi bi-arrow-repeat"></i> Change
                                <input type="file" accept="image/*" className="d-none" onChange={handlePosterChange} />
                              </label>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger py-1 px-2.5 d-inline-flex align-items-center gap-1.5"
                                style={{ fontSize: '0.75rem', borderRadius: '6px' }}
                                onClick={removePoster}
                              >
                                <i className="bi bi-trash"></i> Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="d-flex flex-column align-items-center justify-content-center w-100 h-100 cursor-pointer mb-0 py-4" style={{ cursor: 'pointer' }}>
                            <div
                              className="d-flex align-items-center justify-content-center mb-2.5"
                              style={{
                                width: 52,
                                height: 52,
                                borderRadius: '14px',
                                background: 'rgba(56, 189, 248, 0.1)',
                                border: '1px solid rgba(56, 189, 248, 0.25)',
                                color: '#38bdf8'
                              }}
                            >
                              <i className="bi bi-file-earmark-image fs-3"></i>
                            </div>
                            <span className="fw-semibold text-white small mb-1">Click to upload poster</span>
                            <span className="text-secondary" style={{ fontSize: '0.75rem' }}>1810 × 2560 portrait poster (Max 8MB)</span>
                            <input type="file" accept="image/*" className="d-none" onChange={handlePosterChange} />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Right: Date, Time, Venue */}
                    <div className="col-lg-7 d-flex flex-column gap-4 py-1">
                      {/* Event Date */}
                      <div>
                        <label className="admin-form-label">
                          Event Date <span className="text-danger">*</span>
                        </label>
                        <CustomDatePicker
                          value={form.date}
                          minDate={getMinDate()}
                          isInvalid={Boolean(validationErrors.date)}
                          placeholder="Select event date"
                          onChange={(dateStr) => {
                            setForm({ ...form, date: dateStr });
                            setValidationErrors({
                              ...validationErrors,
                              date: validateDate(dateStr, Boolean(editingId)),
                            });
                          }}
                        />
                        {validationErrors.date && (
                          <div className="invalid-feedback-custom">
                            {validationErrors.date}
                          </div>
                        )}
                      </div>

                      {/* Start Time & End Time */}
                      <div>
                        <div className="row g-2">
                          <div className="col-6">
                            <label className="admin-form-label">
                              Start Time <span className="text-danger">*</span>
                            </label>
                            <CustomTimePicker
                              value={startTime}
                              isInvalid={Boolean(validationErrors.time)}
                              placeholder="09:30 AM"
                              onChange={(timeStr) => {
                                setStartTime(timeStr);
                                const combined = endTime ? `${timeStr} - ${endTime}` : timeStr;
                                setForm({ ...form, time: combined });
                                setValidationErrors({
                                  ...validationErrors,
                                  time: validateTime(timeStr, endTime),
                                });
                              }}
                            />
                          </div>

                          <div className="col-6">
                            <label className="admin-form-label">
                              End Time <span className="text-secondary small fw-normal">(Optional)</span>
                            </label>
                            <CustomTimePicker
                              value={endTime}
                              placeholder="12:30 PM"
                              onChange={(timeStr) => {
                                setEndTime(timeStr);
                                const combined = timeStr ? `${startTime} - ${timeStr}` : startTime;
                                setForm({ ...form, time: combined });
                                setValidationErrors({
                                  ...validationErrors,
                                  time: validateTime(startTime, timeStr),
                                });
                              }}
                            />
                          </div>
                        </div>
                        {validationErrors.time && (
                          <div className="invalid-feedback-custom mt-1">
                            {validationErrors.time}
                          </div>
                        )}
                      </div>

                      {/* Venue */}
                      <div>
                        <label className="admin-form-label">
                          Venue Location <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="admin-input-group-text">
                            <i className="bi bi-geo-alt"></i>
                          </span>
                          <input
                            className={`form-control form-control-glass ${validationErrors.venue ? 'is-invalid' : ''}`}
                            placeholder="Venue location (e.g. Auditorium 1)"
                            value={form.venue}
                            onChange={(e) => {
                              setForm({ ...form, venue: e.target.value });
                              setValidationErrors({ ...validationErrors, venue: validateVenue(e.target.value) });
                            }}
                            maxLength={200}
                          />
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-1 px-1">
                          {validationErrors.venue ? (
                            <div className="invalid-feedback-custom m-0">{validationErrors.venue}</div>
                          ) : <div />}
                          <div className={`character-counter m-0 ${form.venue.length > 180 ? 'warning' : ''} ${form.venue.length >= 200 ? 'danger' : ''}`}>
                            {form.venue.length} / 200
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- SLIDE 3: Contacts & WhatsApp Link --- */}
                <div className="tab-slide px-1">
                  <div className="d-flex flex-column gap-3">
                    {/* Contact Persons */}
                    <div className="p-3 rounded-3" style={{ background: '#060911', border: '1px solid #1e293b' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2.5">
                        <div>
                          <span className="admin-form-label mb-0 fw-semibold text-white">
                            <i className="bi bi-person-lines-fill me-1 text-primary"></i> Contact Persons <span className="text-danger">*</span>
                          </span>
                          <p className="text-secondary small mb-0" style={{ fontSize: '0.78rem' }}>
                            Add student leads or faculty coordinators for attendee inquiries
                          </p>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary py-1 px-2.5 d-inline-flex align-items-center gap-1"
                          style={{ fontSize: '0.78rem', borderRadius: '6px' }}
                          onClick={() => setForm({ ...form, contactPersons: [...form.contactPersons, { name: "", phone: "" }] })}
                        >
                          <i className="bi bi-plus-lg"></i>
                          <span>Add Contact</span>
                        </button>
                      </div>

                      {/* Column Subheaders */}
                      <div className="row g-2 px-1 mb-1 text-secondary d-none d-md-flex" style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                        <div className="col-5">COORDINATOR NAME <span className="text-danger">*</span></div>
                        <div className="col-5">10-DIGIT MOBILE NUMBER <span className="text-danger">*</span></div>
                        <div className="col-2 text-center">ACTION</div>
                      </div>

                      <div style={{ maxHeight: '190px', overflowY: 'auto' }} className="d-flex flex-column gap-2 pe-1">
                        {form.contactPersons.map((cp, i) => (
                          <div key={i} className="row g-2 align-items-center">
                            <div className="col-5">
                              <div className="input-group input-group-sm">
                                <span className="admin-input-group-text py-1 px-2">
                                  <i className="bi bi-person"></i>
                                </span>
                                <input
                                  className={`form-control form-control-glass form-control-sm ${validationErrors.contactPersons?.[i] ? 'is-invalid' : ''}`}
                                  placeholder="Contact Name"
                                  value={cp.name}
                                  onChange={(e) => handleContactNameChange(e.target.value, i)}
                                  maxLength={50}
                                />
                              </div>
                            </div>
                            <div className="col-5">
                              <div className="input-group input-group-sm">
                                <span className="admin-input-group-text py-1 px-2" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                  +91
                                </span>
                                <input
                                  className={`form-control form-control-glass form-control-sm ${validationErrors.contactPersons?.[i] ? 'is-invalid' : ''}`}
                                  placeholder="10-digit Phone"
                                  value={cp.phone.replace(/^\+91/, '')}
                                  onChange={(e) => handlePhoneChange(e.target.value, i)}
                                  maxLength={10}
                                />
                              </div>
                            </div>
                            <div className="col-2">
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm p-1 w-100"
                                style={{ borderRadius: '6px' }}
                                disabled={form.contactPersons.length === 1}
                                onClick={() => {
                                  const list = form.contactPersons.filter((_, index) => index !== i);
                                  setForm({ ...form, contactPersons: list });
                                  if (validationErrors.contactPersons) {
                                    const newErrors = validationErrors.contactPersons.filter((_, index) => index !== i);
                                    setValidationErrors({ ...validationErrors, contactPersons: newErrors });
                                  }
                                }}
                                title="Remove Contact"
                              >
                                <i className="bi bi-trash small"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* WhatsApp Group Link */}
                    <div>
                      <label className="admin-form-label">
                        WhatsApp Group Link <span className="text-secondary opacity-75 fw-normal text-lowercase">(Optional)</span>
                      </label>
                      <div className="input-group">
                        <span className="admin-input-group-text" style={{ color: '#22c55e' }}>
                          <i className="bi bi-whatsapp"></i>
                        </span>
                        <input
                          className={`form-control form-control-glass ${validationErrors.whatsappGroupLink ? 'is-invalid' : ''}`}
                          placeholder="https://chat.whatsapp.com/..."
                          value={form.whatsappGroupLink || ""}
                          onChange={(e) => {
                            setForm({ ...form, whatsappGroupLink: e.target.value });
                            setValidationErrors({ ...validationErrors, whatsappGroupLink: validateWhatsAppUrl(e.target.value) });
                          }}
                        />
                      </div>
                      {validationErrors.whatsappGroupLink && (
                        <div className="invalid-feedback-custom">
                          {validationErrors.whatsappGroupLink}
                        </div>
                      )}
                      <p className="text-secondary small mt-1 mb-0" style={{ fontSize: '0.78rem' }}>
                        Provide an official WhatsApp group invite link where participants can join for updates.
                      </p>
                    </div>
                  </div>
                </div>

                {/* --- SLIDE 4: Registration Form Builder --- */}
                <div className="tab-slide px-1">
                  <div style={{ maxHeight: 'calc(75vh - 180px)', overflowY: 'auto' }} className="pe-1">
                    <div className="alert border-0 d-flex align-items-center gap-2 mb-3 py-2 px-3 rounded-2" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                      <i className="bi bi-info-circle text-primary fs-6"></i>
                      <span className="small text-light">
                        Configure registration questions, required fields, and input types. Form questions are stored with the event.
                      </span>
                    </div>
                    <FormBuilder
                      questions={form.customQuestions || []}
                      onChange={(questions) =>
                        setForm({
                          ...form,
                          customQuestions: questions,
                          registrationQuestions: questions.map((q) => q.question),
                        })
                      }
                      formTitle={form.name || "Event Registration"}
                      formDescription={form.description || "Please fill in the details below to register for this event."}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Wizard Navigation */}
            <div className="d-flex justify-content-between align-items-center pt-3 mt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div>
                {eventModalTab === 'info' ? (
                  <button type="button" className="btn-admin-secondary px-4 py-2" onClick={closeModal}>
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-admin-outline d-inline-flex align-items-center gap-2 px-3 py-2"
                    onClick={handlePreviousTab}
                  >
                    <i className="bi bi-arrow-left"></i>
                    <span>Previous</span>
                  </button>
                )}
              </div>

              <div className="d-flex align-items-center" style={{ gap: '12px' }}>
                {eventModalTab !== 'form' ? (
                  <button
                    type="button"
                    className="btn-admin-primary px-4 py-2 d-inline-flex align-items-center gap-2"
                    onClick={handleNextTab}
                  >
                    <span>Next: {getNextTabTitle()}</span>
                    <i className="bi bi-arrow-right"></i>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-admin-primary px-4 py-2 d-inline-flex align-items-center gap-2"
                    onClick={handleSaveEvent}
                    disabled={hasValidationErrors || isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="d-inline-flex align-items-center gap-2">
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>{editingId ? 'Updating...' : 'Saving...'}</span>
                      </span>
                    ) : (
                      <span className="d-inline-flex align-items-center gap-2">
                        <i className="bi bi-check2 fs-6"></i>
                        <span>{editingId ? "Save Changes" : "Create Event"}</span>
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CROP STUDIO MODAL --- */}
      {showCropModal && (
        <div className="admin-modal-overlay">
          <div className="event-crop-modal p-4" style={{ maxWidth: '760px', width: '100%' }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3 pb-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8'
                  }}
                >
                  <i className="bi bi-crop fs-5"></i>
                </div>
                <div>
                  <h5 className="m-0 fw-bold text-white tracking-tight" style={{ fontSize: '1.1rem' }}>
                    {cropTarget === 'thumbnail' ? 'Event Thumbnail Framing (16:9 Card Ratio)' : 'Event Poster Framing (1810 × 2560 Poster)'}
                  </h5>
                  <p className="text-secondary small mb-0 mt-0.5" style={{ fontSize: '0.78rem' }}>
                    {cropTarget === 'thumbnail' ? 'Align visual elements for the 16:9 website event cards' : 'Drag and zoom to perfectly frame the event poster visual'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-link text-secondary text-decoration-none p-1.5 rounded-circle hover-light"
                onClick={() => {
                  setShowCropModal(false);
                  setImageToCrop("");
                  setCropTarget(null);
                }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Cropper Viewport */}
            <div
              className="position-relative overflow-hidden rounded-3 mb-3"
              style={{
                height: cropTarget === 'thumbnail' ? '400px' : '460px',
                background: '#020617',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
              }}
            >
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={cropTarget === 'thumbnail' ? 16 / 9 : 1810 / 2560}
                restrictPosition={true}
                minZoom={1}
                maxZoom={4}
                onCropChange={setCrop}
                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                onZoomChange={setZoom}
                showGrid={true}
              />
            </div>

            {/* Footer Controls */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 pt-2">
              <div className="d-flex align-items-center w-100 w-sm-auto" style={{ gap: '12px' }}>
                <i className="bi bi-zoom-out text-secondary" style={{ fontSize: '1rem', flexShrink: 0 }}></i>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="form-range"
                  style={{ width: 140, cursor: 'pointer', margin: '0 4px' }}
                />
                <i className="bi bi-zoom-in text-secondary" style={{ fontSize: '1rem', flexShrink: 0 }}></i>
                <span
                  className="badge rounded-pill bg-dark border border-secondary text-secondary"
                  style={{
                    fontSize: '0.75rem',
                    padding: '6px 12px',
                    marginLeft: '8px',
                    letterSpacing: '0.5px'
                  }}
                >
                  {zoom.toFixed(1)}x
                </span>
              </div>
              <div className="d-flex align-items-center w-100 w-sm-auto justify-content-end" style={{ gap: '14px' }}>
                <button
                  type="button"
                  className="btn-admin-secondary px-4 py-2"
                  onClick={() => {
                    setShowCropModal(false);
                    setImageToCrop("");
                    setCropTarget(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-admin-primary px-4 py-2 d-inline-flex align-items-center"
                  style={{ gap: '8px' }}
                  onClick={handleCropSave}
                >
                  <i className="bi bi-check2 fs-6"></i> <span>Apply Crop</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {showDeleteModal && (
        <div className="admin-modal-overlay">
          <div
            className="event-studio-modal p-4 m-2 text-center"
            style={{
              maxWidth: '460px',
              width: '100%',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 30px rgba(239, 68, 68, 0.15)'
            }}
          >
            {/* Glowing Warning Icon */}
            <div
              className="d-inline-flex align-items-center justify-content-center p-3 mb-3"
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                animation: 'pulseDanger 2s infinite'
              }}
            >
              <i className="bi bi-trash3-fill fs-3 text-danger"></i>
            </div>

            <h4 className="fw-bold text-white mb-1.5" style={{ fontSize: '1.25rem' }}>Delete Event?</h4>
            <p className="text-secondary small mb-3" style={{ fontSize: '0.85rem' }}>
              Are you sure you want to remove <strong>{eventToDelete?.name}</strong>? This action cannot be undone.
            </p>

            {/* Event Identity Chip */}
            {eventToDelete && (
              <div
                className="rounded-3 mb-4 d-flex align-items-center text-start mx-auto"
                style={{
                  maxWidth: '360px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '12px 16px',
                  gap: '14px'
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                  style={{
                    width: 44,
                    height: 44,
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171'
                  }}
                >
                  <i className="bi bi-calendar-x fs-5"></i>
                </div>
                <div className="overflow-hidden flex-grow-1">
                  <div className="text-white fw-bold text-truncate" style={{ fontSize: '0.925rem', lineHeight: 1.3, marginBottom: '2px' }}>
                    {eventToDelete.name}
                  </div>
                  <div className="text-secondary small text-truncate" style={{ fontSize: '0.78rem', lineHeight: 1.3, color: '#94a3b8' }}>
                    <i className="bi bi-calendar3 me-1"></i>{eventToDelete.date} · <i className="bi bi-geo-alt me-1"></i>{eventToDelete.venue}
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-center" style={{ gap: '14px' }}>
              <button
                type="button"
                className="btn-admin-secondary px-4 py-2"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger px-4 py-2 rounded-2 fw-semibold d-inline-flex align-items-center gap-2 shadow"
                onClick={handleDeleteEvent}
                disabled={loading}
                style={{ background: '#dc2626', border: '1px solid #ef4444' }}
              >
                {loading ? (
                  <span className="d-inline-flex align-items-center gap-2">
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Deleting...</span>
                  </span>
                ) : (
                  <span className="d-inline-flex align-items-center gap-2">
                    <i className="bi bi-trash3-fill"></i>
                    <span>Delete Event</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- IMAGE PREVIEW LIGHTBOX MODAL --- */}
      {previewModalImage && (
        <div
          className="admin-modal-overlay"
          style={{ zIndex: 1100, backdropFilter: 'blur(10px)', background: 'rgba(3, 7, 18, 0.88)' }}
          onClick={() => setPreviewModalImage(null)}
        >
          <div
            className="event-studio-modal p-0 m-3 overflow-hidden d-flex flex-column"
            style={{
              maxWidth: '850px',
              width: '100%',
              background: 'linear-gradient(165deg, #090d16 0%, #030712 100%)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(56, 189, 248, 0.2)',
              borderRadius: '16px',
              animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom border-dark border-opacity-50">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-eye text-primary fs-5"></i>
                <h5 className="m-0 text-white fw-bold fs-6">{previewModalImage.title}</h5>
                {previewModalImage.ratio && (
                  <span
                    className="badge ms-2 px-2 py-0.5"
                    style={{
                      background: 'rgba(56, 189, 248, 0.12)',
                      color: '#38bdf8',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    {previewModalImage.ratio}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="btn-close-studio"
                onClick={() => setPreviewModalImage(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Image Preview Container */}
            <div
              className="p-3 d-flex align-items-center justify-content-center"
              style={{
                background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.8) 0%, rgba(3, 7, 18, 0.95) 100%)',
                minHeight: '300px',
                maxHeight: '72vh',
                overflow: 'auto'
              }}
            >
              <img
                src={previewModalImage.src}
                alt={previewModalImage.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '68vh',
                  objectFit: 'contain',
                  borderRadius: '10px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.7), 0 0 20px rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              />
            </div>

            {/* Footer */}
            <div className="d-flex align-items-center justify-content-between px-4 py-2.5 border-top border-dark border-opacity-50">
              <a
                href={previewModalImage.src}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-link text-info text-decoration-none p-0 d-inline-flex align-items-center gap-1.5"
                style={{ fontSize: '0.82rem' }}
              >
                <i className="bi bi-box-arrow-up-right"></i> Open full image in new tab
              </a>
              <button
                type="button"
                className="btn-admin-secondary px-3 py-1.5"
                style={{ fontSize: '0.85rem' }}
                onClick={() => setPreviewModalImage(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default EventManager;