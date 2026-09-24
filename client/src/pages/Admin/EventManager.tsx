import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import AdminLayout from "../../components/AdminLayout";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  toggleEventDisplay,
  updateEvent,
  uploadEventImageDirect,
  deleteEventImageDirect,
} from "../../services/admin/eventService";
import type { Area, Point } from "react-easy-crop";
import { getCroppedBlob } from "../../utils/cropUtils";
import EventCard, { type AdminEvent } from "../../components/Admin/Events/EventCard";
import EventStudioModal, {
  type EventFormData,
  type EventStudioSection,
  type ValidationErrors,
} from "../../components/Admin/Events/EventStudioModal";
import EventCropperModal from "../../components/Admin/Events/EventCropperModal";
import ImagePreviewModal from "../../components/Admin/Events/ImagePreviewModal";
import AdminEventDetailModal from "../../components/Admin/Events/AdminEventDetailModal";
import EventAttendeesModal from "../../components/Admin/Events/EventAttendeesModal";
import ConfirmModal from "../../components/Common/ConfirmModal";
import { DEFAULT_INITIAL_EVENT_QUESTIONS } from "../../types/formBuilder";

// Default registration questions derived from form builder defaults (Name, Register Number, Email ID, Phone Number)
const INITIAL_REGISTRATION_QUESTIONS = DEFAULT_INITIAL_EVENT_QUESTIONS.map((q) => q.question);

const EventManager: React.FC = () => {
  /* Events list */
  const [events, setEvents] = useState<AdminEvent[]>([]);

  /* Modal control */
  const [showModal, setShowModal] = useState(false);
  const [activeSection, setActiveSection] = useState<EventStudioSection>("info");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDetailEvent, setSelectedDetailEvent] = useState<AdminEvent | null>(null);
  const [selectedAttendeesEvent, setSelectedAttendeesEvent] = useState<AdminEvent | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<AdminEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Media & Crop States
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [posterPreview, setPosterPreview] = useState<string>("");
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [posterUploadProgress, setPosterUploadProgress] = useState(0);

  // Tracking refs for automatic deletion of unsaved Cloudinary uploads
  const unsavedThumbnailPublicIdRef = useRef<string | null>(null);
  const unsavedPosterPublicIdRef = useRef<string | null>(null);
  const initialThumbnailPublicIdRef = useRef<string | null>(null);
  const initialPosterPublicIdRef = useRef<string | null>(null);

  // Start Time & End Time States
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const [showCropModal, setShowCropModal] = useState(false);
  const [cropTarget, setCropTarget] = useState<"thumbnail" | "poster" | null>(null);
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

  /* Form state */
  const [form, setForm] = useState<EventFormData>({
    _id: "",
    name: "",
    date: "",
    time: "",
    registrationEndDate: "",
    venue: "",
    description: "",
    thumbnailUrl: "",
    thumbnailPublicId: "",
    posterUrl: "",
    posterPublicId: "",
    contactPersons: [{ name: "", phone: "", role: "Student Coordinator" }],
    registrationQuestions: INITIAL_REGISTRATION_QUESTIONS,
    customQuestions: DEFAULT_INITIAL_EVENT_QUESTIONS,
    whatsappGroupLink: "",
    display: true,
  });

  // Clean up any unsaved Cloudinary uploads when component unmounts
  useEffect(() => {
    return () => {
      if (unsavedThumbnailPublicIdRef.current) {
        deleteEventImageDirect(unsavedThumbnailPublicIdRef.current);
      }
      if (unsavedPosterPublicIdRef.current) {
        deleteEventImageDirect(unsavedPosterPublicIdRef.current);
      }
    };
  }, []);

  /* Validation rules */
  const validateName = (name: string): string => {
    if (!name || name.trim() === "") return "Event name is required";
    if (name.trim().length < 3) return "Event name must be at least 3 characters";
    if (name.length > 100) return "Event name cannot exceed 100 characters";
    return "";
  };

  const validateDate = (date: string, isEditing: boolean = false): string => {
    if (!date) return "Event date is required";
    if (!isEditing) {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) return "Event date cannot be in the past";
    }
    return "";
  };

  const validateRegistrationEndDate = (regEndDate?: string, eventDate?: string, isEditing: boolean = false): string => {
    if (!regEndDate || regEndDate.trim() === "") return "Registration deadline is required";
    const selectedReg = new Date(regEndDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!isEditing && selectedReg < today) {
      return "Registration deadline cannot be in the past";
    }

    if (eventDate) {
      const selectedEvent = new Date(eventDate);
      if (selectedReg > selectedEvent) {
        return "Registration deadline cannot be after the event date";
      }
    }
    return "";
  };

  const validateTime = (sTime: string, eTime?: string): string => {
    if (!sTime) return "Start time is required";
    if (eTime && sTime && eTime === sTime) {
      return "End time cannot be the same as start time";
    }
    return "";
  };

  const validateVenue = (venue: string): string => {
    if (!venue || venue.trim() === "") return "Venue is required";
    if (venue.trim().length < 2) return "Venue must be at least 2 characters";
    if (venue.length > 200) return "Venue cannot exceed 200 characters";
    return "";
  };

  const validateDescription = (desc: string): string => {
    if (!desc || desc.trim() === "") return "Event description is required";
    if (desc.trim().length < 10) return "Description must be at least 10 characters";
    if (desc.length > 500) return "Description cannot exceed 500 characters";
    return "";
  };

  const validateContactName = (name: string): string => {
    if (!name || name.trim() === "") return "Contact name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (name.length > 50) return "Name cannot exceed 50 characters";
    if (!/^[a-zA-Z\s.]+$/.test(name)) return "Name can only contain letters, dots, and spaces";
    return "";
  };

  const validatePhoneNumber = (phone: string): string => {
    const cleanPhone = phone.replace(/^\+91/, "").replace(/\D/g, "");
    if (!cleanPhone) return "Phone number is required";
    if (cleanPhone.length !== 10) return "Phone number must be exactly 10 digits";
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) return "Invalid Indian mobile number (must start with 6-9)";
    return "";
  };

  const validateWhatsAppUrl = (url: string): string => {
    if (!url || url.trim() === "") return "";
    const waRegex = /^https:\/\/(chat\.whatsapp\.com\/[A-Za-z0-9_-]{20,24}|wa\.me\/[0-9]{10,15})$/;
    if (!waRegex.test(url.trim())) {
      return "Please enter a valid WhatsApp group or invite link";
    }
    return "";
  };

  const validateAllFields = (): ValidationErrors => {
    const errors: ValidationErrors = {};
    const nameErr = validateName(form.name);
    if (nameErr) errors.name = nameErr;

    const dateErr = validateDate(form.date, Boolean(editingId));
    if (dateErr) errors.date = dateErr;

    const regEndErr = validateRegistrationEndDate(form.registrationEndDate, form.date, Boolean(editingId));
    if (regEndErr) errors.registrationEndDate = regEndErr;

    const timeErr = validateTime(startTime, endTime);
    if (timeErr) errors.time = timeErr;

    const venueErr = validateVenue(form.venue);
    if (venueErr) errors.venue = venueErr;

    const descErr = validateDescription(form.description);
    if (descErr) errors.description = descErr;

    const waErr = validateWhatsAppUrl(form.whatsappGroupLink || "");
    if (waErr) errors.whatsappGroupLink = waErr;

    if (!posterPreview && !form.posterUrl) {
      errors.poster = "Event poster is required";
    }

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

    return errors;
  };

  const hasValidationErrors = useMemo(() => {
    const errors = validateAllFields();
    return Object.values(errors).some((error) => {
      if (Array.isArray(error)) return error.some((err) => err);
      return error !== "";
    });
  }, [form, startTime, endTime, editingId, posterPreview]);

  const isInfoValid = (): boolean => {
    return Boolean(
      form.name &&
        form.name.trim().length >= 3 &&
        form.description &&
        form.description.trim().length >= 10 &&
        form.date &&
        startTime &&
        form.venue &&
        form.venue.trim().length >= 2 &&
        validateRegistrationEndDate(form.registrationEndDate, form.date, Boolean(editingId)) === ""
    );
  };

  const isMediaValid = (): boolean => {
    return Boolean(posterPreview || form.posterUrl);
  };

  const isContactsValid = (): boolean => {
    if (form.contactPersons.length === 0) return false;
    const allContactsValid = form.contactPersons.every(
      (c) => validateContactName(c.name) === "" && validatePhoneNumber(c.phone) === ""
    );
    const waValid = validateWhatsAppUrl(form.whatsappGroupLink || "") === "";
    return allContactsValid && waValid;
  };

  const canAccessSection = (sec: EventStudioSection): boolean => {
    if (sec === "info") return true;
    if (sec === "media") return isInfoValid();
    if (sec === "contacts") return isInfoValid() && isMediaValid();
    if (sec === "form") return isInfoValid() && isMediaValid() && isContactsValid();
    return false;
  };

  const sectionOrder: EventStudioSection[] = ["info", "media", "contacts", "form"];

  const handleNextSection = () => {
    if (activeSection === "info") {
      const nameErr = validateName(form.name);
      const descErr = validateDescription(form.description);
      const dateErr = validateDate(form.date, Boolean(editingId));
      const regEndErr = validateRegistrationEndDate(form.registrationEndDate, form.date, Boolean(editingId));
      const timeErr = validateTime(startTime, endTime);
      const venueErr = validateVenue(form.venue);

      if (nameErr || descErr || dateErr || regEndErr || timeErr || venueErr) {
        setValidationErrors((prev) => ({
          ...prev,
          name: nameErr,
          description: descErr,
          date: dateErr,
          registrationEndDate: regEndErr,
          time: timeErr,
          venue: venueErr,
        }));
        showToast("warning", "Please fill in all required fields in Info & Schedule");
        return;
      }
      setActiveSection("media");
    } else if (activeSection === "media") {
      if (!posterPreview && !form.posterUrl) {
        setValidationErrors((prev) => ({ ...prev, poster: "Event poster is required" }));
        showToast("warning", "Please upload an event poster to proceed");
        return;
      }
      setValidationErrors((prev) => ({ ...prev, poster: undefined }));
      setActiveSection("contacts");
    } else if (activeSection === "contacts") {
      const contactErrors: string[] = [];
      form.contactPersons.forEach((contact, index) => {
        const nameErr = validateContactName(contact.name);
        const phoneErr = validatePhoneNumber(contact.phone);
        if (nameErr || phoneErr) contactErrors[index] = nameErr || phoneErr;
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
      setActiveSection("form");
    }
  };

  const handlePreviousSection = () => {
    const currentIndex = sectionOrder.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(sectionOrder[currentIndex - 1]);
    }
  };

  const handleSectionClick = (sec: EventStudioSection) => {
    if (canAccessSection(sec)) {
      setActiveSection(sec);
    } else {
      showToast("warning", "Please complete preceding steps first");
    }
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

  const resetForm = () => {
    setForm({
      _id: "",
      name: "",
      date: "",
      time: "",
      registrationEndDate: "",
      venue: "",
      description: "",
      thumbnailUrl: "",
      thumbnailPublicId: "",
      posterUrl: "",
      posterPublicId: "",
      contactPersons: [{ name: "", phone: "", role: "Student Coordinator" }],
      registrationQuestions: INITIAL_REGISTRATION_QUESTIONS,
      customQuestions: DEFAULT_INITIAL_EVENT_QUESTIONS,
      whatsappGroupLink: "",
      display: true,
    });
    setStartTime("");
    setEndTime("");
    setThumbnailPreview("");
    setPosterPreview("");
    setActiveSection("info");
    setValidationErrors({});
    unsavedThumbnailPublicIdRef.current = null;
    unsavedPosterPublicIdRef.current = null;
    initialThumbnailPublicIdRef.current = null;
    initialPosterPublicIdRef.current = null;
  };

  const closeModal = () => {
    // If user uploaded unsaved images and closed the modal, delete them from Cloudinary
    if (unsavedThumbnailPublicIdRef.current) {
      if (!editingId || unsavedThumbnailPublicIdRef.current !== initialThumbnailPublicIdRef.current) {
        deleteEventImageDirect(unsavedThumbnailPublicIdRef.current);
      }
      unsavedThumbnailPublicIdRef.current = null;
    }

    if (unsavedPosterPublicIdRef.current) {
      if (!editingId || unsavedPosterPublicIdRef.current !== initialPosterPublicIdRef.current) {
        deleteEventImageDirect(unsavedPosterPublicIdRef.current);
      }
      unsavedPosterPublicIdRef.current = null;
    }

    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  const handleCreateEvent = () => {
    resetForm();
    setActiveSection("info");
    setShowModal(true);
  };

  const handleEditEvent = (event: AdminEvent) => {
    setEditingId(event._id);
    let sTime = "";
    let eTime = "";
    if (event.time) {
      const parts = event.time.split(" - ");
      sTime = parts[0]?.trim() || "";
      eTime = parts[1]?.trim() || "";
    }
    setStartTime(sTime);
    setEndTime(eTime);

    setThumbnailPreview(event.thumbnailUrl || "");
    setPosterPreview(event.posterUrl || "");

    initialThumbnailPublicIdRef.current = event.thumbnailPublicId || null;
    initialPosterPublicIdRef.current = event.posterPublicId || null;
    unsavedThumbnailPublicIdRef.current = null;
    unsavedPosterPublicIdRef.current = null;

    setForm({
      _id: event._id,
      name: event.name || "",
      date: event.date || "",
      time: event.time || "",
      registrationEndDate: event.registrationEndDate || "",
      venue: event.venue || "",
      description: event.description || "",
      thumbnailUrl: event.thumbnailUrl || "",
      thumbnailPublicId: event.thumbnailPublicId || "",
      posterUrl: event.posterUrl || "",
      posterPublicId: event.posterPublicId || "",
      contactPersons:
        event.contactPersons && event.contactPersons.length > 0
          ? event.contactPersons.map((cp) => ({
              name: cp.name || "",
              phone: cp.phone || "",
              role: cp.role || "Student Coordinator",
            }))
          : [{ name: "", phone: "", role: "Student Coordinator" }],
      registrationQuestions: event.registrationQuestions || INITIAL_REGISTRATION_QUESTIONS,
      customQuestions:
        event.customQuestions && event.customQuestions.length > 0
          ? event.customQuestions
          : DEFAULT_INITIAL_EVENT_QUESTIONS,
      whatsappGroupLink: event.whatsappGroupLink || "",
      display: event.display !== false,
    });

    setActiveSection("info");
    setShowModal(true);
  };

  const handleToggleDisplay = async (id: string, currentDisplay: boolean) => {
    try {
      const newDisplay = !currentDisplay;
      const res = await toggleEventDisplay(id, newDisplay);
      setEvents((prev) =>
        prev.map((e) => (e._id === id ? { ...e, display: newDisplay } : e))
      );
      showToast("success", res?.message || `Event ${newDisplay ? "shown" : "hidden"}`);
    } catch (error: any) {
      showToast("error", error.message);
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    try {
      setLoading(true);
      const res = await deleteEvent(eventToDelete._id);
      showToast("success", res?.message || "Event deleted successfully");
      await fetchAllEvents();
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch (error: any) {
      showToast("error", error.message || "Failed to delete event");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEvent = async () => {
    const errors = validateAllFields();
    setValidationErrors(errors);
    const hasErrors = Object.values(errors).some((error) => {
      if (Array.isArray(error)) return error.some((err) => err);
      return Boolean(error);
    });

    if (hasErrors) {
      showToast("error", "Please fix all validation errors before saving", "Validation Failed");
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
      showToast("success", res?.message || "Event saved successfully");

      // Clear tracking refs so close doesn't delete saved assets
      unsavedThumbnailPublicIdRef.current = null;
      unsavedPosterPublicIdRef.current = null;
      initialThumbnailPublicIdRef.current = null;
      initialPosterPublicIdRef.current = null;

      setShowModal(false);
      setEditingId(null);
      resetForm();
      await fetchAllEvents();
    } catch (error: any) {
      showToast("error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image Upload Handlers
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        showToast("error", "Thumbnail image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageToCrop(reader.result as string);
        setCropTarget("thumbnail");
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setShowCropModal(true);
      });
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 8 * 1024 * 1024) {
        showToast("error", "Poster image must be less than 8MB");
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageToCrop(reader.result as string);
        setCropTarget("poster");
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setShowCropModal(true);
      });
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleRemoveThumbnail = () => {
    if (unsavedThumbnailPublicIdRef.current) {
      if (!editingId || unsavedThumbnailPublicIdRef.current !== initialThumbnailPublicIdRef.current) {
        deleteEventImageDirect(unsavedThumbnailPublicIdRef.current);
      }
      unsavedThumbnailPublicIdRef.current = null;
    }
    setThumbnailPreview("");
    setForm((prev) => ({ ...prev, thumbnailUrl: "", thumbnailPublicId: "" }));
  };

  const handleRemovePoster = () => {
    if (unsavedPosterPublicIdRef.current) {
      if (!editingId || unsavedPosterPublicIdRef.current !== initialPosterPublicIdRef.current) {
        deleteEventImageDirect(unsavedPosterPublicIdRef.current);
      }
      unsavedPosterPublicIdRef.current = null;
    }
    setPosterPreview("");
    setForm((prev) => ({ ...prev, posterUrl: "", posterPublicId: "" }));
  };

  const handleCropSave = async () => {
    if (!imageToCrop || !croppedAreaPixels || !cropTarget) return;
    const target = cropTarget;
    try {
      setShowCropModal(false);

      // 1. Get Blob directly from cropped canvas
      const croppedBlob = await getCroppedBlob(imageToCrop, croppedAreaPixels);

      // 2. Set instant local preview while uploading to Cloudinary
      const localUrl = URL.createObjectURL(croppedBlob);

      if (target === "thumbnail") {
        setIsUploadingThumbnail(true);
        setThumbnailUploadProgress(0);
        setThumbnailPreview(localUrl);

        // Delete previous unsaved temporary thumbnail if user re-crops in the same session
        if (unsavedThumbnailPublicIdRef.current) {
          if (!editingId || unsavedThumbnailPublicIdRef.current !== initialThumbnailPublicIdRef.current) {
            deleteEventImageDirect(unsavedThumbnailPublicIdRef.current);
          }
          unsavedThumbnailPublicIdRef.current = null;
        }

        // Upload directly to Cloudinary with real-time percentage progress
        const res = await uploadEventImageDirect(croppedBlob, "thumbnail", (progress) => {
          setThumbnailUploadProgress(progress);
        });

        unsavedThumbnailPublicIdRef.current = res.public_id;
        setThumbnailPreview(res.url);
        setForm((prev) => ({
          ...prev,
          thumbnailUrl: res.url,
          thumbnailPublicId: res.public_id,
        }));
      } else if (target === "poster") {
        setIsUploadingPoster(true);
        setPosterUploadProgress(0);
        setPosterPreview(localUrl);

        // Delete previous unsaved temporary poster if user re-crops in the same session
        if (unsavedPosterPublicIdRef.current) {
          if (!editingId || unsavedPosterPublicIdRef.current !== initialPosterPublicIdRef.current) {
            deleteEventImageDirect(unsavedPosterPublicIdRef.current);
          }
          unsavedPosterPublicIdRef.current = null;
        }

        // Upload directly to Cloudinary with real-time percentage progress
        const res = await uploadEventImageDirect(croppedBlob, "poster", (progress) => {
          setPosterUploadProgress(progress);
        });

        unsavedPosterPublicIdRef.current = res.public_id;
        setPosterPreview(res.url);
        setForm((prev) => ({
          ...prev,
          posterUrl: res.url,
          posterPublicId: res.public_id,
        }));
      }

      setImageToCrop("");
      setCropTarget(null);
    } catch (e: any) {
      console.error("Direct upload failed:", e);
      showToast("error", e?.message || "Failed to upload image");
    } finally {
      if (target === "thumbnail") {
        setIsUploadingThumbnail(false);
        setThumbnailUploadProgress(0);
      } else if (target === "poster") {
        setIsUploadingPoster(false);
        setPosterUploadProgress(0);
      }
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
      onCloseToast={() => setToast((prev) => ({ ...prev, show: false }))}
    >
      <div className="mobile-offset">
        {/* Animated Header */}
        <m.div
          className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div>
            <h2 className="fw-bold text-white mb-1" style={{ letterSpacing: "-0.3px" }}>Events Dashboard</h2>
            <p className="text-secondary m-0 small">Manage your schedule, media, and registrations</p>
          </div>
          <m.button
            className="btn btn-primary px-4 py-2 fw-semibold shadow-lg d-flex align-items-center gap-2"
            onClick={handleCreateEvent}
            style={{ borderRadius: "12px" }}
            whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(56, 189, 248, 0.4)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            <i className="bi bi-plus-lg"></i>
            <span>Create Event</span>
          </m.button>
        </m.div>

        {/* Animated Events Grid */}
        <m.div
          className="row g-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.07,
              },
            },
          }}
        >
          {events.length === 0 && (
            <m.div
              className="col-12 text-center py-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <i className="bi bi-calendar-x display-1 text-white opacity-50 mb-3 d-block"></i>
              <h4 className="text-white fw-semibold">No events found</h4>
              <p className="text-white-50">Create a new event to get started!</p>
            </m.div>
          )}

          <AnimatePresence mode="popLayout">
            {events.map((event, index) => (
              <EventCard
                key={event._id}
                event={event}
                index={index}
                onToggleDisplay={handleToggleDisplay}
                onEdit={handleEditEvent}
                onDelete={(ev) => {
                  setEventToDelete(ev);
                  setShowDeleteModal(true);
                }}
                onViewDetails={(ev) => setSelectedDetailEvent(ev)}
                onOpenAttendees={(ev) => setSelectedAttendeesEvent(ev)}
              />
            ))}
          </AnimatePresence>
        </m.div>
      </div>

      {/* Admin Event Detail Split Popup Modal */}
      <AdminEventDetailModal
        selectedEvent={selectedDetailEvent}
        onClose={() => setSelectedDetailEvent(null)}
        onEdit={handleEditEvent}
        onToggleDisplay={handleToggleDisplay}
        onOpenAttendees={(ev) => setSelectedAttendeesEvent(ev)}
      />

      {/* Event Studio Modal (Section-by-Section Step Wizard) */}
      <EventStudioModal
        show={showModal}
        editingId={editingId}
        activeSection={activeSection}
        form={form}
        validationErrors={validationErrors}
        startTime={startTime}
        endTime={endTime}
        thumbnailPreview={thumbnailPreview}
        posterPreview={posterPreview}
        isUploadingThumbnail={isUploadingThumbnail}
        thumbnailUploadProgress={thumbnailUploadProgress}
        isUploadingPoster={isUploadingPoster}
        posterUploadProgress={posterUploadProgress}
        isSubmitting={isSubmitting}
        hasValidationErrors={hasValidationErrors}
        onClose={closeModal}
        onSave={handleSaveEvent}
        onSectionClick={handleSectionClick}
        onPreviousSection={handlePreviousSection}
        onNextSection={handleNextSection}
        isInfoValid={isInfoValid}
        isMediaValid={isMediaValid}
        isContactsValid={isContactsValid}
        canAccessSection={canAccessSection}
        onNameChange={(val) => {
          setForm({ ...form, name: val });
          setValidationErrors({ ...validationErrors, name: validateName(val) });
        }}
        onDescriptionChange={(val) => {
          setForm({ ...form, description: val });
          setValidationErrors({ ...validationErrors, description: validateDescription(val) });
        }}
        onDateChange={(val) => {
          setForm({ ...form, date: val });
          setValidationErrors({
            ...validationErrors,
            date: validateDate(val, Boolean(editingId)),
            registrationEndDate: validateRegistrationEndDate(form.registrationEndDate, val, Boolean(editingId)),
          });
        }}
        onRegistrationEndDateChange={(val) => {
          setForm({ ...form, registrationEndDate: val });
          setValidationErrors({
            ...validationErrors,
            registrationEndDate: validateRegistrationEndDate(val, form.date, Boolean(editingId)),
          });
        }}
        onStartTimeChange={(val) => {
          setStartTime(val);
          const combined = endTime ? `${val} - ${endTime}` : val;
          setForm({ ...form, time: combined });
          setValidationErrors({ ...validationErrors, time: validateTime(val, endTime) });
        }}
        onEndTimeChange={(val) => {
          setEndTime(val);
          const combined = val ? `${startTime} - ${val}` : startTime;
          setForm({ ...form, time: combined });
          setValidationErrors({ ...validationErrors, time: validateTime(startTime, val) });
        }}
        onVenueChange={(val) => {
          setForm({ ...form, venue: val });
          setValidationErrors({ ...validationErrors, venue: validateVenue(val) });
        }}
        onWhatsAppChange={(val) => {
          setForm({ ...form, whatsappGroupLink: val });
          setValidationErrors({ ...validationErrors, whatsappGroupLink: validateWhatsAppUrl(val) });
        }}
        onCustomQuestionsChange={(questions) =>
          setForm({
            ...form,
            customQuestions: questions,
            registrationQuestions: questions.map((q) => q.question),
          })
        }
        onThumbnailChange={handleThumbnailChange}
        onPosterChange={handlePosterChange}
        onRemoveThumbnail={handleRemoveThumbnail}
        onRemovePoster={handleRemovePoster}
        onPreviewImage={setPreviewModalImage}
        onContactNameChange={(value, index) => {
          const list = [...form.contactPersons];
          list[index].name = value;
          setForm({ ...form, contactPersons: list });
          const error = validateContactName(value);
          if (validationErrors.contactPersons) {
            const newErrors = [...validationErrors.contactPersons];
            newErrors[index] = error;
            setValidationErrors({ ...validationErrors, contactPersons: newErrors });
          }
        }}
        onContactRoleChange={(value, index) => {
          const list = [...form.contactPersons];
          list[index].role = value;
          setForm({ ...form, contactPersons: list });
        }}
        onPhoneChange={(value, index) => {
          const digits = value.replace(/\D/g, "").slice(0, 10);
          const list = [...form.contactPersons];
          list[index].phone = digits;
          setForm({ ...form, contactPersons: list });
          const error = validatePhoneNumber(digits);
          if (validationErrors.contactPersons) {
            const newErrors = [...validationErrors.contactPersons];
            newErrors[index] = error;
            setValidationErrors({ ...validationErrors, contactPersons: newErrors });
          }
        }}
        onAddContact={() =>
          setForm({
            ...form,
            contactPersons: [
              ...form.contactPersons,
              { name: "", phone: "", role: "Student Coordinator" },
            ],
          })
        }
        onRemoveContact={(index) => {
          const list = form.contactPersons.filter((_, i) => i !== index);
          setForm({ ...form, contactPersons: list });
          if (validationErrors.contactPersons) {
            const newErrors = validationErrors.contactPersons.filter((_, i) => i !== index);
            setValidationErrors({ ...validationErrors, contactPersons: newErrors });
          }
        }}
      />

      {/* Cropper Modal */}
      <EventCropperModal
        show={showCropModal}
        imageToCrop={imageToCrop}
        cropTarget={cropTarget}
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
        onSave={handleCropSave}
        onCancel={() => {
          setShowCropModal(false);
          setImageToCrop("");
          setCropTarget(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        title="Delete Event?"
        message="Are you sure you want to remove"
        itemName={eventToDelete?.name}
        confirmText="Delete Event"
        confirmVariant="danger"
        isProcessing={loading}
        onConfirm={handleDeleteEvent}
        onCancel={() => {
          setShowDeleteModal(false);
          setEventToDelete(null);
        }}
      />

      {/* Lightbox Preview Modal */}
      <ImagePreviewModal
        previewImage={previewModalImage}
        onClose={() => setPreviewModalImage(null)}
      />

      {/* Event Attendees Roster & QR Attendance Check-in Modal */}
      <EventAttendeesModal
        event={selectedAttendeesEvent}
        onClose={() => setSelectedAttendeesEvent(null)}
        showToast={(msg, variant) => showToast(variant, msg)}
      />
    </AdminLayout>
  );
};

export default EventManager;