import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../components/AdminLayout";
import { createEvent, deleteEvent, getAllEvents, toggleEventDisplay, updateEvent } from "../../services/admin/eventService";
import FormBuilder from "../../components/FormBuilder/FormBuilder";
import { type IQuestion, ACM_STANDARD_STUDENT_QUESTIONS } from "../../types/formBuilder";

// --- CSS Styles for Animation & Design ---
const styles = `
  /* --- Keyframes --- */
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

  /* --- Modal & Form (Preserved) --- */
  .custom-modal-overlay {
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    z-index: 1050;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.3s ease-out;
  }
  
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .custom-modal-content {
    background: #1f2937;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    border-radius: 20px;
    width: 100%; max-width: 800px; max-height: 90vh; overflow-y: auto;
  }

  /* Scrollbar */
  .custom-modal-content::-webkit-scrollbar { width: 8px; }
  .custom-modal-content::-webkit-scrollbar-track { background: transparent; }
  .custom-modal-content::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.2); border-radius: 4px; }

  /* --- Inputs & Selects Glassmorphism --- */
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
  .form-select-glass option {
    background-color: #111827;
    color: #ffffff;
  }
  .form-control-glass.is-invalid, .form-select-glass.is-invalid {
    border-color: #dc3545 !important;
    background: rgba(220, 53, 69, 0.1) !important;
  }
  .form-control-glass.is-invalid:focus, .form-select-glass.is-invalid:focus {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.2) !important;
  }

  .form-control-dark {
    background-color: #374151;
    border: 1px solid #4b5563;
    color: #ffffff !important;
  }
  .form-control-dark:focus {
    background-color: #374151;
    border-color: #3b82f6;
    box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.25);
  }
  .form-control-dark.is-invalid {
    border-color: #dc3545;
    background: rgba(220, 53, 69, 0.1);
  }
  .form-control-dark.is-invalid:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
  }
  .form-control-dark::placeholder { color: #9ca3af !important; }
  .form-control-dark::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
  
  .form-section {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .custom-modal-overlay.closing {
    animation: fadeOut 0.3s ease-in forwards;
  }

  .custom-modal-overlay.closing .custom-modal-content {
    animation: scaleOut 0.25s ease-in forwards;
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes scaleOut {
    from { transform: scale(1); opacity: 1; }
    to { transform: scale(0.92); opacity: 0; }
  }

  .modal-content-glass {
    background: #1f2937 !important;
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
    color: #ffffff;
  }

  .modal-content-glass .modal-body {
    background: transparent;
  }

  .modal-content-glass h4 {
    color: #ffffff;
  }

  .modal-content-glass p {
    color: #9ca3af;
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
  contactPersons?: string[]; // Array of errors for each contact
  registrationQuestions?: string[]; // Array of errors for each question
  whatsappGroupLink?: string;
}

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
  const [eventModalTab, setEventModalTab] = useState<'details' | 'form'>('details');

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

  const validateTime = (time: string): string => {
    if (!time) return "Event time is required";

    // Validate HH:MM AM/PM format
    const timeRegex = /^(0[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/;
    if (!timeRegex.test(time)) {
      return "Time must be in HH:MM AM/PM format (e.g., 02:30 PM)";
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

  const [form, setForm] = useState<Event>({
    _id: "",
    name: "",
    date: "",
    time: "",
    venue: "",
    description: "",
    contactPersons: [{ name: "", phone: "" }],
    registrationQuestions: REQUIRED_REGISTRATION_QUESTIONS,
    customQuestions: [...ACM_STANDARD_STUDENT_QUESTIONS],
    whatsappGroupLink: "",
    display: true,
  });

  const validateAllFields = (): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Validate basic fields
    errors.name = validateName(form.name);
    errors.date = validateDate(form.date, Boolean(editingId));
    errors.time = validateTime(form.time);
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

  const parseTime = (time?: string) => {
    if (!time) return { hour: "", minute: "", meridian: "" };

    if (time.includes("T")) {
      const date = new Date(time);
      let h = date.getHours();
      const m = date.getMinutes();

      const meridian = h >= 12 ? "PM" : "AM";
      if (h > 12) h -= 12;
      if (h === 0) h = 12;

      return {
        hour: String(h).padStart(2, "0"),
        minute: String(m).padStart(2, "0"),
        meridian,
      };
    }

    if (time.split(":").length === 3) {
      let [hour, minute] = time.split(":");
      let h = parseInt(hour, 10);

      const meridian = h >= 12 ? "PM" : "AM";
      if (h > 12) h -= 12;
      if (h === 0) h = 12;

      return {
        hour: String(h).padStart(2, "0"),
        minute: minute,
        meridian,
      };
    }

    if (time.includes(" ")) {
      const [hm, meridian] = time.split(" ");
      const [hour, minute] = hm.split(":");
      return { hour, minute, meridian };
    }

    if (time.includes(":")) {
      let [hour, minute] = time.split(":");
      let h = parseInt(hour, 10);

      const meridian = h >= 12 ? "PM" : "AM";
      if (h > 12) h -= 12;
      if (h === 0) h = 12;

      return {
        hour: String(h).padStart(2, "0"),
        minute: minute || "00",
        meridian,
      };
    }

    return { hour: "", minute: "", meridian: "" };
  };

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
      if (e.key === "Escape" && showModal) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showModal]);

  // Reset validation errors when modal closes
  useEffect(() => {
    if (!showModal) {
      setValidationErrors({});
    }
  }, [showModal]);

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
      customQuestions: [...ACM_STANDARD_STUDENT_QUESTIONS],
      whatsappGroupLink: "",
      display: true,
    });
    setEditingId(null);
    setEventModalTab("details");
    setValidationErrors({});
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

    const formattedTime = event.time || "";

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
      time: formattedTime,
      customQuestions: customQuestions.length > 0 ? customQuestions : [...ACM_STANDARD_STUDENT_QUESTIONS],
    });

    setEditingId(event._id);
    setEventModalTab("details");
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

  const { hour, minute, meridian } = parseTime(form.time);

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
                  <i className={`bi ${editingId ? 'bi-calendar-check text-primary' : 'bi-calendar-plus text-primary'} fs-5`}></i>
                </div>
                <div>
                  <h4 className="m-0 fw-bold text-white">
                    {editingId ? "Edit Event Details" : "Create New Event"}
                  </h4>
                  <p className="text-secondary small mb-0 mt-1">Configure event details, schedule, contact info, and registration form</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="btn btn-link text-secondary text-decoration-none fs-4 p-0"
                style={{ lineHeight: 1 }}
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
                  transform: eventModalTab === 'details' ? 'translateX(0%)' : 'translateX(100%)',
                  transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />

              {/* Tab 1: Details */}
              <button
                type="button"
                className={`btn flex-fill py-2 rounded-2 fw-semibold d-flex align-items-center justify-content-center gap-2 border-0 position-relative ${
                  eventModalTab === 'details' ? 'text-white' : 'text-secondary'
                }`}
                style={{ zIndex: 2, transition: 'color 0.25s ease', background: 'transparent' }}
                onClick={() => setEventModalTab('details')}
              >
                <i className="bi bi-calendar-event"></i>
                <span>1. Event Details</span>
              </button>

              {/* Tab 2: Form Builder */}
              <button
                type="button"
                className={`btn flex-fill py-2 rounded-2 fw-semibold d-flex align-items-center justify-content-center gap-2 border-0 position-relative ${
                  eventModalTab === 'form' ? 'text-white' : 'text-secondary'
                }`}
                style={{ zIndex: 2, transition: 'color 0.25s ease', background: 'transparent' }}
                onClick={() => setEventModalTab('form')}
              >
                <i className="bi bi-ui-checks-grid"></i>
                <span>2. Registration Form Builder</span>
                <span
                  className={`badge rounded-pill px-2 ${
                    eventModalTab === 'form' ? 'bg-white bg-opacity-25 text-white' : 'bg-secondary bg-opacity-50 text-light'
                  }`}
                  style={{ transition: 'all 0.25s ease' }}
                >
                  {form.customQuestions?.length || 0}
                </span>
              </button>
            </div>

            {/* Modal Body with Smooth Sliding Tabs */}
            <div className="tab-slider-wrapper">
              <div
                className="tab-slider-track"
                style={{
                  transform: eventModalTab === 'details' ? 'translateX(0%)' : 'translateX(-50%)'
                }}
              >
                {/* Slide 1: Event Details (2-Column Non-Scrollable Layout) */}
                <div className="tab-slide px-1">
                  <div className="row g-3">
                    {/* Left Column */}
                    <div className="col-lg-6 d-flex flex-column gap-3">
                      {/* Event Name */}
                      <div>
                        <label className="form-label text-secondary small fw-bold mb-1">
                          Event Name <span className="required-asterisk">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-dark bg-opacity-50 border-secondary border-opacity-50 text-primary">
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
                        {validationErrors.name && (
                          <div className="invalid-feedback-custom">
                            {validationErrors.name}
                          </div>
                        )}
                        <div className={`character-counter ${form.name.length > 90 ? 'warning' : ''} ${form.name.length >= 100 ? 'danger' : ''}`}>
                          {form.name.length} / 100
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="row g-2">
                        <div className="col-6">
                          <label className="form-label text-secondary small fw-bold mb-1">
                            Event Date <span className="required-asterisk">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text bg-dark bg-opacity-50 border-secondary border-opacity-50 text-info">
                              <i className="bi bi-calendar3"></i>
                            </span>
                            <input
                              type="date"
                              className={`form-control form-control-glass ${validationErrors.date ? 'is-invalid' : ''}`}
                              value={form.date}
                              min={getMinDate()}
                              onChange={(e) => {
                                setForm({ ...form, date: e.target.value });
                                setValidationErrors({ ...validationErrors, date: validateDate(e.target.value) });
                              }}
                            />
                          </div>
                          {validationErrors.date && (
                            <div className="invalid-feedback-custom">
                              {validationErrors.date}
                            </div>
                          )}
                        </div>

                        <div className="col-6">
                          <label className="form-label text-secondary small fw-bold mb-1">
                            Event Time <span className="required-asterisk">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text bg-dark bg-opacity-50 border-secondary border-opacity-50 text-warning">
                              <i className="bi bi-clock"></i>
                            </span>
                            <select
                              className={`form-select form-select-glass p-1 text-center ${validationErrors.time ? 'is-invalid' : ''}`}
                              value={hour}
                              onChange={(e) => {
                                const newTime = `${e.target.value || "01"}:${minute || "00"} ${meridian || "AM"}`;
                                setForm({ ...form, time: newTime });
                                setValidationErrors({ ...validationErrors, time: validateTime(newTime) });
                              }}
                            >
                              <option value="">HH</option>
                              {Array.from({ length: 12 }, (_, i) => {
                                const h = String(i + 1).padStart(2, "0");
                                return (
                                  <option key={h} value={h}>
                                    {h}
                                  </option>
                                );
                              })}
                            </select>

                            <select
                              className={`form-select form-select-glass p-1 text-center ${validationErrors.time ? 'is-invalid' : ''}`}
                              value={minute}
                              onChange={(e) => {
                                const newTime = `${hour || "01"}:${e.target.value || "00"} ${meridian || "AM"}`;
                                setForm({ ...form, time: newTime });
                                setValidationErrors({ ...validationErrors, time: validateTime(newTime) });
                              }}
                            >
                              <option value="">MM</option>
                              {["00", "15", "30", "45"].map((m) => (
                                <option key={m} value={m}>
                                  {m}
                                </option>
                              ))}
                            </select>

                            <select
                              className={`form-select form-select-glass p-1 text-center ${validationErrors.time ? 'is-invalid' : ''}`}
                              value={meridian}
                              onChange={(e) => {
                                const newTime = `${hour || "01"}:${minute || "00"} ${e.target.value || "AM"}`;
                                setForm({ ...form, time: newTime });
                                setValidationErrors({ ...validationErrors, time: validateTime(newTime) });
                              }}
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>
                          {validationErrors.time && (
                            <div className="invalid-feedback-custom">
                              {validationErrors.time}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Venue */}
                      <div>
                        <label className="form-label text-secondary small fw-bold mb-1">
                          Venue <span className="required-asterisk">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-dark bg-opacity-50 border-secondary border-opacity-50 text-danger">
                            <i className="bi bi-geo-alt-fill"></i>
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
                        {validationErrors.venue && (
                          <div className="invalid-feedback-custom">
                            {validationErrors.venue}
                          </div>
                        )}
                        <div className={`character-counter ${form.venue.length > 180 ? 'warning' : ''} ${form.venue.length >= 200 ? 'danger' : ''}`}>
                          {form.venue.length} / 200
                        </div>
                      </div>

                      {/* WhatsApp */}
                      <div>
                        <label className="form-label text-secondary small fw-bold mb-1">
                          WhatsApp Group Link <span className="text-secondary opacity-75 fw-normal">(Optional)</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-dark bg-opacity-50 border-secondary border-opacity-50 text-success">
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
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-lg-6 d-flex flex-column gap-3">
                      {/* Description */}
                      <div>
                        <label className="form-label text-secondary small fw-bold mb-1">
                          Event Description
                        </label>
                        <textarea
                          className={`form-control form-control-glass ${validationErrors.description ? 'is-invalid' : ''}`}
                          rows={3}
                          placeholder="Describe the event, objectives, and highlights..."
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

                      {/* Contact Persons */}
                      <div className="form-section p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="m-0 text-info small fw-bold">
                            <i className="bi bi-person-lines-fill me-1"></i> Contact Persons <span className="required-asterisk">*</span>
                          </h6>
                          <button
                            type="button"
                            className="btn btn-xs btn-outline-info rounded-pill py-1 px-3"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => setForm({ ...form, contactPersons: [...form.contactPersons, { name: "", phone: "" }] })}
                          >
                            <i className="bi bi-plus-lg me-1"></i>Add Contact
                          </button>
                        </div>

                        <div style={{ maxHeight: '135px', overflowY: 'auto' }} className="d-flex flex-column gap-2 pe-1">
                          {form.contactPersons.map((cp, i) => (
                            <div key={i} className="row g-2 align-items-center">
                              <div className="col-5">
                                <div className="input-group input-group-sm">
                                  <span className="input-group-text bg-dark bg-opacity-50 border-secondary border-opacity-50 text-secondary">
                                    <i className="bi bi-person"></i>
                                  </span>
                                  <input
                                    className={`form-control form-control-glass form-control-sm ${validationErrors.contactPersons?.[i] ? 'is-invalid' : ''}`}
                                    placeholder="Name"
                                    value={cp.name}
                                    onChange={(e) => handleContactNameChange(e.target.value, i)}
                                    maxLength={50}
                                  />
                                </div>
                              </div>
                              <div className="col-5">
                                <div className="input-group input-group-sm">
                                  <span className="input-group-text bg-dark bg-opacity-50 border-secondary border-opacity-50 text-secondary">
                                    <i className="bi bi-telephone"></i>
                                  </span>
                                  <input
                                    className={`form-control form-control-glass form-control-sm ${validationErrors.contactPersons?.[i] ? 'is-invalid' : ''}`}
                                    placeholder="10-digit Phone"
                                    value={cp.phone}
                                    onChange={(e) => handlePhoneChange(e.target.value, i)}
                                    maxLength={10}
                                  />
                                </div>
                              </div>
                              <div className="col-2">
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm p-1 w-100"
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
                    </div>
                  </div>
                </div>

                {/* Slide 2: Form Builder */}
                <div className="tab-slide px-1">
                  <div style={{ maxHeight: 'calc(75vh - 180px)', overflowY: 'auto' }} className="pe-1">
                    <div className="alert alert-info border-0 bg-opacity-10 bg-info d-flex align-items-center gap-2 mb-3 py-2 px-3">
                      <i className="bi bi-info-circle-fill text-info fs-6"></i>
                      <span className="small text-light">
                        Customize registration questions, input types, and required validations just like Google Forms. Changes are saved with the event.
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

            {/* Modal Footer */}
            <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-25 mt-3">
              <div>
                {eventModalTab === 'details' ? (
                  <button
                    type="button"
                    className="btn btn-outline-info rounded-pill px-3"
                    onClick={() => setEventModalTab('form')}
                  >
                    <i className="bi bi-arrow-right me-1"></i>Next: Form Builder ({form.customQuestions?.length || 0})
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-3"
                    onClick={() => setEventModalTab('details')}
                  >
                    <i className="bi bi-arrow-left me-1"></i>Back: Event Details
                  </button>
                )}
              </div>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-light px-4 rounded-pill" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-5 rounded-pill fw-bold shadow"
                  onClick={handleSaveEvent}
                  disabled={hasValidationErrors || isSubmitting}
                >
                  {isSubmitting ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {editingId ? 'Updating...' : 'Saving...'}
                    </span>
                  ) : (
                    editingId ? "Save Changes" : "Create Event"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {showDeleteModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-glass rounded-4 p-3 text-center">
              <div className="modal-body">
                <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex p-3 mb-3">
                  <i className="bi bi-exclamation-triangle-fill fs-3"></i>
                </div>
                <h4 className="fw-bold mb-2 text-white">Delete Event?</h4>
                <p className="text-secondary mb-4">Are you sure you want to remove <strong>{eventToDelete?.name}</strong>? This action cannot be undone.</p>
                <div className="d-flex gap-2 justify-content-center">
                  <button className="btn btn-outline-light rounded-pill px-4" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                  <button
                    className="btn btn-danger rounded-pill px-4 fw-bold"
                    onClick={handleDeleteEvent}
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

export default EventManager;