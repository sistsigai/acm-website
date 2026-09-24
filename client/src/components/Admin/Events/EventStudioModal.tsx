import React, { useEffect } from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import FormBuilder from "../../FormBuilder/FormBuilder";
import { CustomDatePicker } from "../../CustomDatePicker";
import { CustomTimePicker } from "../../CustomTimePicker";
import type { IQuestion } from "../../../types/formBuilder";
import type { ContactPerson } from "./EventCard";

export type EventStudioSection = "info" | "media" | "contacts" | "form";

export interface EventFormData {
  _id?: string;
  name: string;
  date: string;
  time: string;
  registrationEndDate?: string;
  venue: string;
  description: string;
  thumbnailUrl?: string;
  thumbnailPublicId?: string;
  posterUrl?: string;
  posterPublicId?: string;
  contactPersons: ContactPerson[];
  registrationQuestions: string[];
  customQuestions?: IQuestion[];
  whatsappGroupLink?: string;
  display: boolean;
}

export interface ValidationErrors {
  name?: string;
  date?: string;
  time?: string;
  registrationEndDate?: string;
  venue?: string;
  description?: string;
  poster?: string;
  contactPersons?: string[];
  registrationQuestions?: string[];
  whatsappGroupLink?: string;
}

interface EventStudioModalProps {
  show: boolean;
  editingId: string | null;
  activeSection: EventStudioSection;
  form: EventFormData;
  validationErrors: ValidationErrors;
  startTime: string;
  endTime: string;
  thumbnailPreview: string;
  posterPreview: string;
  isUploadingThumbnail?: boolean;
  thumbnailUploadProgress?: number;
  isUploadingPoster?: boolean;
  posterUploadProgress?: number;
  isSubmitting: boolean;
  hasValidationErrors: boolean;
  onClose: () => void;
  onSave: () => void;
  onSectionClick: (section: EventStudioSection) => void;
  onPreviousSection: () => void;
  onNextSection: () => void;
  isInfoValid: () => boolean;
  isMediaValid: () => boolean;
  isContactsValid: () => boolean;
  canAccessSection: (section: EventStudioSection) => boolean;
  onNameChange: (val: string) => void;
  onDescriptionChange: (val: string) => void;
  onDateChange: (val: string) => void;
  onRegistrationEndDateChange: (val: string) => void;
  onStartTimeChange: (val: string) => void;
  onEndTimeChange: (val: string) => void;
  onVenueChange: (val: string) => void;
  onWhatsAppChange: (val: string) => void;
  onCustomQuestionsChange: (questions: IQuestion[]) => void;
  onThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPosterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveThumbnail: () => void;
  onRemovePoster: () => void;
  onPreviewImage: (preview: { src: string; title: string; ratio?: string }) => void;
  onContactNameChange: (value: string, index: number) => void;
  onContactRoleChange: (value: string, index: number) => void;
  onPhoneChange: (value: string, index: number) => void;
  onAddContact: () => void;
  onRemoveContact: (index: number) => void;
}

export const EventStudioModal: React.FC<EventStudioModalProps> = ({
  show,
  editingId,
  activeSection,
  form,
  validationErrors,
  startTime,
  endTime,
  thumbnailPreview,
  posterPreview,
  isUploadingThumbnail = false,
  thumbnailUploadProgress = 0,
  isUploadingPoster = false,
  posterUploadProgress = 0,
  isSubmitting,
  hasValidationErrors,
  onClose,
  onSave,
  onSectionClick,
  onPreviousSection,
  onNextSection,
  isInfoValid,
  isMediaValid,
  isContactsValid,
  canAccessSection,
  onNameChange,
  onDescriptionChange,
  onDateChange,
  onRegistrationEndDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onVenueChange,
  onWhatsAppChange,
  onCustomQuestionsChange,
  onThumbnailChange,
  onPosterChange,
  onRemoveThumbnail,
  onRemovePoster,
  onPreviewImage,
  onContactNameChange,
  onContactRoleChange,
  onPhoneChange,
  onAddContact,
  onRemoveContact,
}) => {
  // ESC key listener to close modal
  useEffect(() => {
    if (!show) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, isSubmitting, onClose]);

  if (!show) return null;

  const minDate = new Date().toISOString().split("T")[0];

  const getNextSectionLabel = () => {
    switch (activeSection) {
      case "info":
        return "Event Media";
      case "media":
        return "Coordinators";
      case "contacts":
        return "Form Builder";
      default:
        return "Submit";
    }
  };

  const sectionsConfig = [
    {
      id: "info" as const,
      label: "Info & Schedule",
      icon: "bi-calendar-event",
      isCompleted: isInfoValid(),
    },
    {
      id: "media" as const,
      label: "Event Media",
      icon: "bi-images",
      isCompleted: isMediaValid(),
    },
    {
      id: "contacts" as const,
      label: "Coordinators",
      icon: "bi-people",
      isCompleted: isContactsValid(),
    },
    {
      id: "form" as const,
      label: "Form Builder",
      icon: "bi-ui-checks-grid",
      count: form.customQuestions?.length || 0,
      isCompleted: false,
    },
  ];

  return (
    <AnimatePresence>
      {show && (
        <m.div
          className="admin-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmitting) {
              onClose();
            }
          }}
        >
          <m.div
            className="admin-modal-container p-3 p-md-4"
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 320, damping: 25 }}
            style={{
              maxWidth: "1020px",
              width: "95%",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              background: "linear-gradient(165deg, #0f172a 0%, #090d16 100%)",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-dark border-opacity-50 flex-shrink-0">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "12px",
                    background: "rgba(56, 189, 248, 0.15)",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    color: "#38bdf8",
                  }}
                >
                  <i className={`bi ${editingId ? "bi-calendar-check" : "bi-calendar-plus"} fs-5`}></i>
                </div>
                <div>
                  <h5 className="m-0 fw-bold text-white tracking-tight" style={{ fontSize: "1.2rem" }}>
                    {editingId ? "Edit Event Details" : "Create New Event"}
                  </h5>
                  <p className="text-secondary small mb-0 mt-0.5" style={{ fontSize: "0.8rem" }}>
                    Configure event schedule, venue, media posters, coordinators, and registration form
                  </p>
                </div>
              </div>
              <m.button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="btn btn-sm btn-link text-secondary text-decoration-none p-2 rounded-circle"
                style={{ lineHeight: 1 }}
                whileHover={{ scale: 1.15, rotate: 90, color: "#f87171" }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close dialog"
              >
                <i className="bi bi-x-lg fs-6"></i>
              </m.button>
            </div>

            {/* Section Steps Navigation Bar (Clean & Numberless) */}
            <div
              className="d-flex mb-3 p-1 rounded-3 flex-shrink-0 position-relative"
              style={{
                background: "#060911",
                border: "1px solid #1e293b",
                gap: "6px",
                minHeight: "46px",
              }}
            >
              {sectionsConfig.map((sec) => {
                const isActive = activeSection === sec.id;
                const isAccessible = canAccessSection(sec.id);

                return (
                  <m.button
                    key={sec.id}
                    type="button"
                    className="btn flex-fill py-2 px-2.5 rounded-2 fw-medium d-flex align-items-center justify-content-center border-0 position-relative text-nowrap"
                    whileHover={isAccessible ? { scale: 1.02 } : {}}
                    whileTap={isAccessible ? { scale: 0.98 } : {}}
                    style={{
                      background: "transparent",
                      color: isActive ? "#ffffff" : isAccessible ? "#94a3b8" : "#475569",
                      transition: "color 0.2s ease, opacity 0.2s ease",
                      fontSize: "0.84rem",
                      gap: "8px",
                      opacity: isAccessible ? 1 : 0.55,
                      cursor: isAccessible ? "pointer" : "not-allowed",
                      zIndex: 1,
                    }}
                    onClick={() => {
                      if (isAccessible) {
                        onSectionClick(sec.id);
                      }
                    }}
                  >
                    {isActive && (
                      <m.div
                        layoutId="activeStudioTab"
                        className="position-absolute top-0 start-0 w-100 h-100 rounded-2"
                        style={{
                          background: "linear-gradient(135deg, rgba(37, 99, 235, 0.28) 0%, rgba(59, 130, 246, 0.14) 100%)",
                          border: "1px solid rgba(59, 130, 246, 0.5)",
                          boxShadow: "0 4px 14px -2px rgba(37, 99, 235, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
                          zIndex: -1,
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}

                    <div
                      className="d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "6px",
                        background: isActive
                          ? "rgba(56, 189, 248, 0.2)"
                          : sec.isCompleted && !isActive
                            ? "rgba(34, 197, 94, 0.15)"
                            : "rgba(255, 255, 255, 0.05)",
                        color: isActive
                          ? "#38bdf8"
                          : sec.isCompleted && !isActive
                            ? "#4ade80"
                            : isAccessible
                              ? "#64748b"
                              : "#334155",
                        border: `1px solid ${isActive
                            ? "rgba(56, 189, 248, 0.4)"
                            : sec.isCompleted && !isActive
                              ? "rgba(34, 197, 94, 0.3)"
                              : "rgba(255, 255, 255, 0.05)"
                          }`,
                        fontSize: "0.75rem",
                        transition: "all 0.25s ease",
                      }}
                    >
                      {sec.isCompleted && !isActive ? (
                        <i className="bi bi-check2 fw-bold"></i>
                      ) : !isAccessible ? (
                        <i className="bi bi-lock-fill"></i>
                      ) : (
                        <i className={`bi ${sec.icon}`}></i>
                      )}
                    </div>
                    <span className="fw-semibold">{sec.label}</span>
                    {sec.count !== undefined && (
                      <span
                        className="badge px-1.5 py-0.5 ms-1"
                        style={{
                          fontSize: "0.7rem",
                          background: isActive ? "rgba(56, 189, 248, 0.2)" : "rgba(255, 255, 255, 0.06)",
                          color: isActive ? "#38bdf8" : "#94a3b8",
                          border: `1px solid ${isActive ? "rgba(56, 189, 248, 0.4)" : "rgba(255, 255, 255, 0.08)"}`,
                          borderRadius: "6px",
                          fontWeight: 600,
                          transition: "all 0.25s ease",
                        }}
                      >
                        {sec.count}
                      </span>
                    )}
                  </m.button>
                );
              })}
            </div>

            {/* Modal Body - Focused Single-Section View */}
            <div
              className="admin-modal-body-scroll flex-grow-1 pe-1 d-flex flex-column overflow-hidden position-relative"
              style={{ minHeight: "360px" }}
            >
              <AnimatePresence mode="wait">
                {/* SECTION: Event Information & Schedule */}
                {activeSection === "info" && (
                  <m.div
                    key="info"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="p-3 p-md-4 rounded-3 h-100 d-flex flex-column"
                    style={{
                      background: "#060911",
                      border: "1px solid #1e293b",
                      overflowY: "auto",
                    }}
                  >
              <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-secondary border-opacity-20 flex-shrink-0">
                <i className="bi bi-info-circle-fill text-primary"></i>
                <span className="fw-semibold text-white" style={{ fontSize: "0.95rem" }}>
                  Event Information & Schedule
                </span>
              </div>

              <div className="row g-3 flex-grow-1">
                {/* Left Column: Name & Description */}
                <div className="col-12 col-lg-6 d-flex flex-column gap-3">
                  <div>
                    <label className="admin-form-label">
                      Event Name <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="admin-input-group-text">
                        <i className="bi bi-card-heading"></i>
                      </span>
                      <input
                        className={`form-control form-control-glass ${validationErrors.name ? "is-invalid" : ""}`}
                        placeholder="Enter event name (e.g. AI Odyssey Hackathon)"
                        value={form.name}
                        onChange={(e) => onNameChange(e.target.value)}
                        maxLength={100}
                        autoFocus
                      />
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-1 px-1">
                      {validationErrors.name ? (
                        <div className="text-danger small">{validationErrors.name}</div>
                      ) : <div />}
                      <div className="small text-secondary">{form.name.length} / 100</div>
                    </div>
                  </div>

                  <div className="flex-grow-1 d-flex flex-column">
                    <label className="admin-form-label">
                      Event Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className={`form-control form-control-glass flex-grow-1 ${validationErrors.description ? "is-invalid" : ""}`}
                      rows={6}
                      placeholder="Describe the event, agenda, prizes, and key highlights..."
                      value={form.description}
                      onChange={(e) => onDescriptionChange(e.target.value)}
                      maxLength={500}
                      style={{ resize: "none", minHeight: "140px" }}
                    />
                    <div className="d-flex justify-content-between align-items-center mt-1 px-1">
                      {validationErrors.description ? (
                        <div className="text-danger small">{validationErrors.description}</div>
                      ) : <div />}
                      <div className="small text-secondary">{form.description.length} / 500</div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Date, Time, Venue */}
                <div className="col-12 col-lg-6 d-flex flex-column gap-3">
                  <div>
                    <label className="admin-form-label">
                      Event Date <span className="text-danger">*</span>
                    </label>
                    <CustomDatePicker
                      value={form.date}
                      minDate={minDate}
                      isInvalid={Boolean(validationErrors.date)}
                      placeholder="Select event date"
                      onChange={onDateChange}
                    />
                    {validationErrors.date && (
                      <div className="text-danger small mt-1">{validationErrors.date}</div>
                    )}
                  </div>

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
                          onChange={onStartTimeChange}
                        />
                      </div>
                      <div className="col-6">
                        <label className="admin-form-label">
                          End Time <span className="text-secondary small fw-normal">(Optional)</span>
                        </label>
                        <CustomTimePicker
                          value={endTime}
                          placeholder="12:30 PM"
                          onChange={onEndTimeChange}
                          align="right"
                        />
                      </div>
                    </div>
                    {validationErrors.time && (
                      <div className="text-danger small mt-1">{validationErrors.time}</div>
                    )}
                  </div>

                  {/* Registration Deadline Field */}
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <label className="admin-form-label mb-0">
                        Registration Deadline <span className="text-danger">*</span>
                      </label>
                    </div>
                    <CustomDatePicker
                      value={form.registrationEndDate || ""}
                      minDate={minDate}
                      maxDate={form.date || undefined}
                      placement="top"
                      isInvalid={Boolean(validationErrors.registrationEndDate)}
                      placeholder="Select registration deadline"
                      onChange={onRegistrationEndDateChange}
                    />
                    {validationErrors.registrationEndDate ? (
                      <div className="text-danger small mt-1">{validationErrors.registrationEndDate}</div>
                    ) : (
                      <div className="small text-secondary mt-1" style={{ fontSize: "0.72rem" }}>
                        Registrations will automatically close after this date.
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="admin-form-label">
                      Venue Location <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="admin-input-group-text">
                        <i className="bi bi-geo-alt"></i>
                      </span>
                      <input
                        className={`form-control form-control-glass ${validationErrors.venue ? "is-invalid" : ""}`}
                        placeholder="Venue location (e.g. Auditorium 1 / Online)"
                        value={form.venue}
                        onChange={(e) => onVenueChange(e.target.value)}
                        maxLength={200}
                      />
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-1 px-1">
                      {validationErrors.venue ? (
                        <div className="text-danger small">{validationErrors.venue}</div>
                      ) : <div />}
                      <div className="small text-secondary">{form.venue.length} / 200</div>
                    </div>
                  </div>
                </div>
              </div>
            </m.div>
          )}

          {/* SECTION: Event Media */}
          {activeSection === "media" && (
            <m.div
              key="media"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="p-3 p-md-4 rounded-3 h-100 d-flex flex-column"
              style={{
                background: "#060911",
                border: "1px solid #1e293b",
                overflowY: "auto",
              }}
            >
              <div className="d-flex align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-20 flex-shrink-0">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-images text-info"></i>
                  <span className="fw-semibold text-white" style={{ fontSize: "0.95rem" }}>
                    Event Media
                  </span>
                </div>
              </div>

              <div className="row g-4 align-items-stretch flex-grow-1">
                {/* Event Thumbnail (Optional · 16:9 Banner Card) */}
                <div className="col-12 col-md-6 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="admin-form-label mb-0">
                      Event Thumbnail <span className="text-secondary opacity-75 fw-normal">(Optional · 16:9 Banner)</span>
                    </label>
                    <span className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      Card ratio · Max 5MB
                    </span>
                  </div>

                  <div
                    className="position-relative media-upload-frame d-flex flex-column align-items-center justify-content-center text-center flex-grow-1 rounded-3 overflow-hidden"
                    style={{
                      minHeight: "260px",
                      background: "rgba(15, 23, 42, 0.6)",
                      border: "2px dashed rgba(59, 130, 246, 0.35)",
                    }}
                  >
                    {thumbnailPreview ? (
                      <div className="position-relative w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          style={{
                            width: "100%",
                            maxHeight: "180px",
                            aspectRatio: "16 / 9",
                            objectFit: "cover",
                            borderRadius: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => onPreviewImage({ src: thumbnailPreview, title: "Event Thumbnail Preview", ratio: "16:9 Banner" })}
                        />
                        <div className="d-flex align-items-center gap-2 mt-3">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-info py-1 px-2.5"
                            style={{ fontSize: "0.75rem", borderRadius: "6px" }}
                            onClick={() => onPreviewImage({ src: thumbnailPreview, title: "Event Thumbnail Preview", ratio: "16:9 Banner" })}
                            disabled={isUploadingThumbnail}
                          >
                            <i className="bi bi-eye"></i> Preview
                          </button>
                          <label
                            className={`btn btn-sm btn-outline-primary py-1 px-2.5 mb-0 ${isUploadingThumbnail ? "disabled" : ""}`}
                            style={{ fontSize: "0.75rem", cursor: isUploadingThumbnail ? "not-allowed" : "pointer", borderRadius: "6px" }}
                          >
                            <i className="bi bi-arrow-repeat"></i> Change
                            <input
                              type="file"
                              accept="image/*"
                              className="d-none"
                              onChange={onThumbnailChange}
                              disabled={isUploadingThumbnail}
                            />
                          </label>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger py-1 px-2.5"
                            style={{ fontSize: "0.75rem", borderRadius: "6px" }}
                            onClick={onRemoveThumbnail}
                            disabled={isUploadingThumbnail}
                          >
                            <i className="bi bi-trash"></i> Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        className={`d-flex flex-column align-items-center justify-content-center w-100 h-100 p-4 mb-0 ${isUploadingThumbnail ? "" : "cursor-pointer"}`}
                        style={{ cursor: isUploadingThumbnail ? "default" : "pointer" }}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center mb-2"
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: "14px",
                            background: "rgba(56, 189, 248, 0.1)",
                            color: "#38bdf8",
                          }}
                        >
                          <i className="bi bi-image fs-3"></i>
                        </div>
                        <span className="fw-semibold text-white small mb-1">Click to upload thumbnail</span>
                        <span className="text-secondary" style={{ fontSize: "0.75rem" }}>
                          16:9 ratio for card grids & previews
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="d-none"
                          onChange={onThumbnailChange}
                          disabled={isUploadingThumbnail}
                        />
                      </label>
                    )}

                    {/* Real-time Thumbnail Upload Progress Overlay */}
                    {isUploadingThumbnail && (
                      <div className="admin-upload-progress-overlay">
                        <div className="progress-ring-container">
                          <svg width="64" height="64" viewBox="0 0 64 64" className="overflow-visible">
                            <circle
                              stroke="rgba(255, 255, 255, 0.12)"
                              strokeWidth="4.5"
                              fill="transparent"
                              r="26"
                              cx="32"
                              cy="32"
                            />
                            <circle
                              className="progress-ring-circle"
                              stroke="#38bdf8"
                              strokeWidth="4.5"
                              strokeDasharray={2 * Math.PI * 26}
                              strokeDashoffset={
                                2 * Math.PI * 26 -
                                (Math.max(0, Math.min(100, thumbnailUploadProgress)) / 100) * (2 * Math.PI * 26)
                              }
                              strokeLinecap="round"
                              fill="transparent"
                              r="26"
                              cx="32"
                              cy="32"
                              transform="rotate(-90 32 32)"
                              style={{ transition: "stroke-dashoffset 0.2s ease-out" }}
                            />
                            <text
                              x="32"
                              y="32"
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill="#ffffff"
                              fontSize="13"
                              fontWeight="700"
                              fontFamily="inherit"
                              style={{ userSelect: "none" }}
                            >
                              {Math.round(thumbnailUploadProgress)}%
                            </text>
                          </svg>
                        </div>
                        <div className="upload-progress-pill">
                          <i className="bi bi-cloud-arrow-up-fill text-info"></i>
                          <span>Uploading Thumbnail...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Poster (Compulsory · 1810 × 2560 Portrait) */}
                <div className="col-12 col-md-6 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="admin-form-label mb-0">
                      Event Poster <span className="text-danger">*</span> <span className="text-secondary opacity-75 fw-normal">(1810 × 2560 Portrait)</span>
                    </label>
                    <span className="text-secondary" style={{ fontSize: "0.72rem" }}>
                      High-res portrait · Max 8MB
                    </span>
                  </div>

                  <div
                    className={`position-relative media-upload-frame d-flex flex-column align-items-center justify-content-center text-center flex-grow-1 rounded-3 overflow-hidden ${validationErrors.poster ? "border-danger" : ""
                      }`}
                    style={{
                      minHeight: "260px",
                      background: "rgba(15, 23, 42, 0.6)",
                      border: validationErrors.poster
                        ? "2px dashed rgba(239, 68, 68, 0.7)"
                        : "2px dashed rgba(59, 130, 246, 0.35)",
                    }}
                  >
                    {posterPreview ? (
                      <div className="position-relative w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3">
                        <img
                          src={posterPreview}
                          alt="Poster preview"
                          style={{
                            height: "180px",
                            maxWidth: "100%",
                            aspectRatio: "1810 / 2560",
                            objectFit: "contain",
                            borderRadius: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => onPreviewImage({ src: posterPreview, title: "Event Poster Preview", ratio: "1810 × 2560 Portrait" })}
                        />
                        <div className="d-flex align-items-center gap-2 mt-3">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-info py-1 px-2.5"
                            style={{ fontSize: "0.75rem", borderRadius: "6px" }}
                            onClick={() => onPreviewImage({ src: posterPreview, title: "Event Poster Preview", ratio: "1810 × 2560 Portrait" })}
                            disabled={isUploadingPoster}
                          >
                            <i className="bi bi-eye"></i> Preview
                          </button>
                          <label
                            className={`btn btn-sm btn-outline-primary py-1 px-2.5 mb-0 ${isUploadingPoster ? "disabled" : ""}`}
                            style={{ fontSize: "0.75rem", cursor: isUploadingPoster ? "not-allowed" : "pointer", borderRadius: "6px" }}
                          >
                            <i className="bi bi-arrow-repeat"></i> Change
                            <input
                              type="file"
                              accept="image/*"
                              className="d-none"
                              onChange={onPosterChange}
                              disabled={isUploadingPoster}
                            />
                          </label>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger py-1 px-2.5"
                            style={{ fontSize: "0.75rem", borderRadius: "6px" }}
                            onClick={onRemovePoster}
                            disabled={isUploadingPoster}
                          >
                            <i className="bi bi-trash"></i> Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        className={`d-flex flex-column align-items-center justify-content-center w-100 h-100 p-4 mb-0 ${isUploadingPoster ? "" : "cursor-pointer"}`}
                        style={{ cursor: isUploadingPoster ? "default" : "pointer" }}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center mb-2"
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: "14px",
                            background: "rgba(56, 189, 248, 0.1)",
                            color: "#38bdf8",
                          }}
                        >
                          <i className="bi bi-file-earmark-image fs-3"></i>
                        </div>
                        <span className="fw-semibold text-white small mb-1">Click to upload poster <span className="text-danger">*</span></span>
                        <span className="text-secondary" style={{ fontSize: "0.75rem" }}>
                          3:4 portrait poster for modal lightbox & announcements
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="d-none"
                          onChange={onPosterChange}
                          disabled={isUploadingPoster}
                        />
                      </label>
                    )}

                    {/* Real-time Poster Upload Progress Overlay */}
                    {isUploadingPoster && (
                      <div className="admin-upload-progress-overlay">
                        <div className="progress-ring-container">
                          <svg width="64" height="64" viewBox="0 0 64 64" className="overflow-visible">
                            <circle
                              stroke="rgba(255, 255, 255, 0.12)"
                              strokeWidth="4.5"
                              fill="transparent"
                              r="26"
                              cx="32"
                              cy="32"
                            />
                            <circle
                              className="progress-ring-circle"
                              stroke="#38bdf8"
                              strokeWidth="4.5"
                              strokeDasharray={2 * Math.PI * 26}
                              strokeDashoffset={
                                2 * Math.PI * 26 -
                                (Math.max(0, Math.min(100, posterUploadProgress)) / 100) * (2 * Math.PI * 26)
                              }
                              strokeLinecap="round"
                              fill="transparent"
                              r="26"
                              cx="32"
                              cy="32"
                              transform="rotate(-90 32 32)"
                              style={{ transition: "stroke-dashoffset 0.2s ease-out" }}
                            />
                            <text
                              x="32"
                              y="32"
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill="#ffffff"
                              fontSize="13"
                              fontWeight="700"
                              fontFamily="inherit"
                              style={{ userSelect: "none" }}
                            >
                              {Math.round(posterUploadProgress)}%
                            </text>
                          </svg>
                        </div>
                        <div className="upload-progress-pill">
                          <i className="bi bi-cloud-arrow-up-fill text-info"></i>
                          <span>Uploading Poster...</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {validationErrors.poster && (
                    <div className="text-danger small mt-1">{validationErrors.poster}</div>
                  )}
                </div>
              </div>
            </m.div>
          )}

          {/* SECTION: Coordinators & WhatsApp Community Link */}
          {activeSection === "contacts" && (
            <m.div
              key="contacts"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="p-3 p-md-4 rounded-3 h-100 d-flex flex-column"
              style={{
                background: "#060911",
                border: "1px solid #1e293b",
                overflowY: "auto",
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-secondary border-opacity-20 flex-shrink-0">
                <i className="bi bi-people-fill text-primary"></i>
                <span className="fw-semibold text-white" style={{ fontSize: "0.95rem" }}>
                  Coordinators & Contact Details
                </span>
              </div>

              <div className="d-flex flex-column gap-3 flex-grow-1">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2.5">
                    <div>
                      <span className="admin-form-label mb-0 fw-semibold text-white">
                        Contact Persons <span className="text-danger">*</span>
                      </span>
                      <p className="text-secondary small mb-0" style={{ fontSize: "0.78rem" }}>
                        Student leads or faculty coordinators for attendee inquiries
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary py-1 px-2.5 d-inline-flex align-items-center gap-1"
                      style={{ fontSize: "0.78rem", borderRadius: "6px" }}
                      onClick={onAddContact}
                    >
                      <i className="bi bi-plus-lg"></i>
                      <span>Add Coordinator</span>
                    </button>
                  </div>

                  <div className="row g-2 px-1 mb-1 text-secondary d-none d-md-flex" style={{ fontSize: "0.72rem", fontWeight: 600 }}>
                    <div className="col-4">COORDINATOR NAME <span className="text-danger">*</span></div>
                    <div className="col-3">COORDINATOR TYPE</div>
                    <div className="col-4">10-DIGIT MOBILE NUMBER <span className="text-danger">*</span></div>
                    <div className="col-1 text-center">ACTION</div>
                  </div>

                  <div style={{ maxHeight: "230px", overflowY: "auto" }} className="d-flex flex-column gap-2 pe-1">
                    {form.contactPersons.map((cp, i) => (
                      <div key={i} className="row g-2 align-items-center">
                        {/* Coordinator Name */}
                        <div className="col-12 col-md-4">
                          <div className="input-group input-group-sm">
                            <span className="admin-input-group-text py-1 px-2">
                              <i className="bi bi-person"></i>
                            </span>
                            <input
                              className={`form-control form-control-glass form-control-sm ${validationErrors.contactPersons?.[i] ? "is-invalid" : ""}`}
                              placeholder="Coordinator Name"
                              value={cp.name}
                              onChange={(e) => onContactNameChange(e.target.value, i)}
                              maxLength={50}
                            />
                          </div>
                        </div>

                        {/* Coordinator Type / Role */}
                        <div className="col-12 col-md-3">
                          <div className="input-group input-group-sm">
                            <span
                              className="admin-input-group-text py-1 px-2"
                              style={{
                                color: cp.role === "Faculty Coordinator" ? "#c084fc" : "#38bdf8",
                              }}
                            >
                              <i
                                className={
                                  cp.role === "Faculty Coordinator"
                                    ? "bi bi-award-fill"
                                    : "bi bi-person-badge"
                                }
                              ></i>
                            </span>
                            <select
                              className="form-select form-control-glass form-control-sm"
                              value={cp.role || "Student Coordinator"}
                              onChange={(e) => onContactRoleChange(e.target.value, i)}
                              style={{
                                background: "rgba(15, 23, 42, 0.7)",
                                color: "#f8fafc",
                                borderColor: "rgba(59, 130, 246, 0.25)",
                                fontSize: "0.8rem",
                                cursor: "pointer",
                              }}
                            >
                              <option value="Student Coordinator" style={{ background: "#0f172a", color: "#f8fafc" }}>
                                Student Coordinator
                              </option>
                              <option value="Faculty Coordinator" style={{ background: "#0f172a", color: "#f8fafc" }}>
                                Faculty Coordinator
                              </option>
                            </select>
                          </div>
                        </div>

                        {/* Phone Number */}
                        <div className="col-10 col-md-4">
                          <div className="input-group input-group-sm">
                            <span className="admin-input-group-text py-1 px-2" style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                              +91
                            </span>
                            <input
                              className={`form-control form-control-glass form-control-sm ${validationErrors.contactPersons?.[i] ? "is-invalid" : ""}`}
                              placeholder="10-digit Phone"
                              value={cp.phone.replace(/^\+91/, "")}
                              onChange={(e) => onPhoneChange(e.target.value, i)}
                              maxLength={10}
                            />
                          </div>
                        </div>

                        {/* Action (Delete) */}
                        <div className="col-2 col-md-1">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm p-1 w-100 d-flex align-items-center justify-content-center"
                            style={{ borderRadius: "6px", height: "31px" }}
                            disabled={form.contactPersons.length === 1}
                            onClick={() => onRemoveContact(i)}
                            title="Remove Contact"
                          >
                            <i className="bi bi-trash small"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-top border-secondary border-opacity-20 mt-auto">
                  <label className="admin-form-label">
                    WhatsApp Group Link <span className="text-secondary opacity-75 fw-normal text-lowercase">(Optional)</span>
                  </label>
                  <div className="input-group">
                    <span className="admin-input-group-text" style={{ color: "#22c55e" }}>
                      <i className="bi bi-whatsapp"></i>
                    </span>
                    <input
                      className={`form-control form-control-glass ${validationErrors.whatsappGroupLink ? "is-invalid" : ""}`}
                      placeholder="https://chat.whatsapp.com/..."
                      value={form.whatsappGroupLink || ""}
                      onChange={(e) => onWhatsAppChange(e.target.value)}
                    />
                  </div>
                  {validationErrors.whatsappGroupLink && (
                    <div className="text-danger small mt-1">{validationErrors.whatsappGroupLink}</div>
                  )}
                  <p className="text-secondary small mt-1 mb-0" style={{ fontSize: "0.78rem" }}>
                    Provide an official WhatsApp group invite link where participants can join for direct updates.
                  </p>
                </div>
              </div>
            </m.div>
          )}

          {/* SECTION: Registration Form Builder */}
          {activeSection === "form" && (
            <m.div
              key="form"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="p-3 p-md-4 rounded-3 h-100 d-flex flex-column"
              style={{
                background: "#060911",
                border: "1px solid #1e293b",
                overflowY: "auto",
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary border-opacity-20 flex-shrink-0">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-ui-checks-grid text-primary"></i>
                  <span className="fw-semibold text-white" style={{ fontSize: "0.95rem" }}>
                    Registration Form Builder
                  </span>
                  <span
                    className="badge ms-1 px-2.5 py-1"
                    style={{
                      background: "rgba(56, 189, 248, 0.15)",
                      color: "#38bdf8",
                      border: "1px solid rgba(56, 189, 248, 0.3)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      borderRadius: "6px",
                    }}
                  >
                    {form.customQuestions?.length || 0} Questions
                  </span>
                </div>
              </div>

              <div className="alert border-0 d-flex align-items-center gap-2 mb-3 py-2 px-3 rounded-2 flex-shrink-0" style={{ background: "#1e293b", border: "1px solid #334155" }}>
                <i className="bi bi-info-circle text-primary fs-6"></i>
                <span className="small text-light">
                  Configure registration questions, required fields, options, and input types.
                </span>
              </div>

              <div className="flex-grow-1" style={{ minHeight: "260px" }}>
                <FormBuilder
                  questions={form.customQuestions || []}
                  onChange={onCustomQuestionsChange}
                  formTitle={form.name || "Event Registration"}
                  formDescription={form.description || "Please fill in the details below to register for this event."}
                />
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

        {/* Modal Footer */}
        <div className="d-flex justify-content-between align-items-center pt-3 mt-3 border-top border-dark border-opacity-50 flex-shrink-0">
          <div>
            {activeSection === "info" ? (
              <m.button
                type="button"
                className="btn-admin-secondary px-4 py-2"
                onClick={onClose}
                disabled={isSubmitting}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancel
              </m.button>
            ) : (
              <m.button
                type="button"
                className="btn-admin-outline d-inline-flex align-items-center gap-2 px-3 py-2"
                onClick={onPreviousSection}
                disabled={isSubmitting}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <i className="bi bi-arrow-left"></i>
                <span>Previous</span>
              </m.button>
            )}
          </div>

          <div className="d-flex align-items-center gap-2">
            {activeSection !== "form" ? (
              <m.button
                type="button"
                className="btn-admin-primary px-4 py-2 d-inline-flex align-items-center gap-2"
                onClick={onNextSection}
                disabled={isSubmitting || isUploadingThumbnail || isUploadingPoster}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>Next: {getNextSectionLabel()}</span>
                <i className="bi bi-arrow-right"></i>
              </m.button>
            ) : (
              <m.button
                type="button"
                className="btn-admin-primary px-4 py-2 d-inline-flex align-items-center gap-2"
                onClick={onSave}
                disabled={hasValidationErrors || isSubmitting || isUploadingThumbnail || isUploadingPoster}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {isSubmitting ? (
                  <span className="d-inline-flex align-items-center gap-2">
                    <span className="spinner-border spinner-border-sm"></span>
                    <span>{editingId ? "Updating Event..." : "Creating Event..."}</span>
                  </span>
                ) : (
                  <span className="d-inline-flex align-items-center gap-2">
                    <i className="bi bi-check2 fs-6"></i>
                    <span>{editingId ? "Save Changes" : "Create Event"}</span>
                  </span>
                )}
              </m.button>
            )}
          </div>
        </div>
      </m.div>
    </m.div>
  )}
</AnimatePresence>
  );
};

export default EventStudioModal;
