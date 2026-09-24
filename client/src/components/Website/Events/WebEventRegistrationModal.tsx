import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion as m, AnimatePresence } from "framer-motion";
import { FaTimes, FaPaperPlane, FaExclamationTriangle } from "react-icons/fa";
import DynamicFormRenderer, { type FileUploadInfo } from "../../FormRenderer/DynamicFormRenderer";
import { CustomDatePicker } from "../../CustomDatePicker";
import { CustomTimePicker } from "../../CustomTimePicker";
import type { ExtendedEventData } from "./WebEventCard";
import {
  type EventRegistrationPayload,
  deleteEventRegistrationFile,
} from "../../../services/website/webeventService";

interface WebEventRegistrationModalProps {
  show: boolean;
  selectedEvent: ExtendedEventData | null;
  useDynamicForm: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: EventRegistrationPayload) => Promise<void>;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

export const WebEventRegistrationModal: React.FC<WebEventRegistrationModalProps> = ({
  show,
  selectedEvent,
  useDynamicForm,
  isSubmitting,
  onClose,
  onSubmit,
  showToast,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [dynamicAnswers, setDynamicAnswers] = useState<Record<string, any>>({});
  const [dynamicErrors, setDynamicErrors] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadInfo[]>([]);
  const uploadedFilesRef = useRef<FileUploadInfo[]>([]);

  useEffect(() => {
    uploadedFilesRef.current = uploadedFiles;
  }, [uploadedFiles]);

  useEffect(() => {
    if (show) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [show]);

  const handleClose = () => {
    // If there are uploaded files in this session that haven't been submitted, delete them from Cloudinary
    if (uploadedFilesRef.current.length > 0) {
      deleteEventRegistrationFile({ files: uploadedFilesRef.current }).catch((err) =>
        console.error("Cleanup on modal close failed:", err)
      );
      setUploadedFiles([]);
      uploadedFilesRef.current = [];
    }
    setDynamicAnswers({});
    setFormData({});
    setTouchedFields(new Set());
    setFormErrors({});
    setDynamicErrors({});
    onClose();
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && show) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show]);

  // Clean up if user closes browser tab or navigates away before submitting
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (uploadedFilesRef.current.length > 0) {
        const payload = JSON.stringify({ files: uploadedFilesRef.current });
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon?.("/api/events/delete-file", blob);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  if (!show || !selectedEvent) return null;

  const handleDynamicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent?.customQuestions) return;

    const newErrors: Record<string, string> = {};
    selectedEvent.customQuestions.forEach((q) => {
      const val = dynamicAnswers[q.id];
      if (q.required) {
        if (!val || (typeof val === "string" && !val.trim()) || (Array.isArray(val) && val.length === 0)) {
          newErrors[q.id] = `${q.question} is required`;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setDynamicErrors(newErrors);
      showToast("Please fill all required fields", "error");
      return;
    }

    const answersMap: Record<string, any> = {};
    selectedEvent.customQuestions.forEach((q) => {
      answersMap[q.question] = dynamicAnswers[q.id] || "";
    });

    const findAnswer = (keywords: string[]): string => {
      for (const q of selectedEvent.customQuestions!) {
        const lower = q.question.toLowerCase();
        for (const kw of keywords) {
          if (lower.includes(kw)) {
            return String(dynamicAnswers[q.id] || "");
          }
        }
      }
      return "";
    };

    const payload: EventRegistrationPayload = {
      eventId: selectedEvent._id,
      name: findAnswer(["name"]),
      registerNo: findAnswer(["register", "reg no", "registration"]),
      dept: findAnswer(["department", "dept"]),
      year: findAnswer(["year"]),
      section: findAnswer(["section"]),
      email: findAnswer(["email"]),
      phone: findAnswer(["phone", "mobile", "whatsapp"]),
      answers: answersMap,
    };

    try {
      await onSubmit(payload);
      // On successful submission, files are retained in Cloudinary
      setUploadedFiles([]);
      uploadedFilesRef.current = [];
    } catch (err) {
      throw err;
    }
  };

  const handleLegacySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    const newErrors: Record<string, string> = {};
    selectedEvent.registrationQuestions?.forEach((q) => {
      if (!formData[q]?.trim()) {
        newErrors[q] = `${q} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      showToast("Please fill all required fields", "error");
      return;
    }

    const payload: EventRegistrationPayload = {
      eventId: selectedEvent._id,
      name: formData["Name"] || formData["Full Name"] || "",
      registerNo: formData["Register Number"] || formData["Register No"] || "",
      dept: formData["Department"] || formData["Dept"] || "",
      year: formData["Year"] || "",
      section: formData["Section"] || "",
      email: formData["Email"] || formData["Email ID"] || "",
      phone: formData["Mobile Number"] || formData["Phone"] || "",
      answers: Object.fromEntries(
        Object.entries(formData).filter(
          ([key]) =>
            ![
              "Name",
              "Full Name",
              "Register Number",
              "Register No",
              "Department",
              "Dept",
              "Year",
              "Section",
              "Email",
              "Email ID",
              "Mobile Number",
              "Phone",
            ].includes(key)
        )
      ),
    };

    if (!payload.name || !payload.registerNo || !payload.email || !payload.phone) {
      showToast("Please fill all required fields", "error");
      return;
    }

    await onSubmit(payload);
  };

  return createPortal(
    <AnimatePresence>
      <m.div
        className="reg-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reg-title"
        onClick={handleClose}
      >
        <m.div
          className="reg-modal-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Static Modal Header */}
          <div className="reg-modal-header">
            <h2 id="reg-title" className="reg-title">
              Event Registration
            </h2>
            <button
              className="modal-close-btn"
              onClick={handleClose}
              aria-label="Close registration form"
            >
              <FaTimes />
            </button>
          </div>

          {/* Scrollable Modal Body */}
          <div className="reg-modal-body">
            {useDynamicForm && selectedEvent.customQuestions && selectedEvent.customQuestions.length > 0 ? (
              <form onSubmit={handleDynamicSubmit} noValidate autoComplete="off">
                <DynamicFormRenderer
                  questions={selectedEvent.customQuestions}
                  answers={dynamicAnswers}
                  errors={dynamicErrors}
                  eventId={selectedEvent._id}
                  onFileUpload={(info) => {
                    setUploadedFiles((prev) => [
                      ...prev.filter((f) => f.url !== info.url),
                      info,
                    ]);
                  }}
                  onFileRemove={(info) => {
                    setUploadedFiles((prev) =>
                      prev.filter((f) => f.url !== info.url)
                    );
                  }}
                  onChange={(questionId, value) => {
                    setDynamicAnswers((prev) => ({ ...prev, [questionId]: value }));
                    if (dynamicErrors[questionId]) {
                      setDynamicErrors((prev) => {
                        const next = { ...prev };
                        delete next[questionId];
                        return next;
                      });
                    }
                  }}
                  disabled={isSubmitting}
                />
                <button type="submit" className="btn-submit-reg mt-3" disabled={isSubmitting}>
                  <FaPaperPlane />
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLegacySubmit} noValidate autoComplete="off">
                {selectedEvent.registrationQuestions?.map((question, idx) => {
                  const error = formErrors[question];
                  const isTouched = touchedFields.has(question);
                  const isDateQ = /date|dob|birth/i.test(question);
                  const isTimeQ = /time/i.test(question);

                  return (
                    <div key={idx} className="reg-form-group">
                      <label className="reg-label" htmlFor={`field-${idx}`}>
                        {question} *
                      </label>
                      {isDateQ ? (
                        <CustomDatePicker
                          value={formData[question] || ""}
                          onChange={(val) => {
                            setFormData((prev) => ({ ...prev, [question]: val }));
                            setTouchedFields((prev) => new Set(prev).add(question));
                          }}
                          isInvalid={isTouched && !!error}
                          placeholder={`Select ${question}`}
                          disabled={isSubmitting}
                        />
                      ) : isTimeQ ? (
                        <CustomTimePicker
                          value={formData[question] || ""}
                          onChange={(val) => {
                            setFormData((prev) => ({ ...prev, [question]: val }));
                            setTouchedFields((prev) => new Set(prev).add(question));
                          }}
                          isInvalid={isTouched && !!error}
                          placeholder={`Select ${question}`}
                          disabled={isSubmitting}
                        />
                      ) : (
                        <input
                          id={`field-${idx}`}
                          type="text"
                          className={`reg-input ${isTouched && error ? "reg-input-error" : ""}`}
                          value={formData[question] || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, [question]: e.target.value }))
                          }
                          onBlur={() => setTouchedFields((prev) => new Set(prev).add(question))}
                        />
                      )}
                      {isTouched && error && (
                        <div className="reg-error-message">
                          <FaExclamationTriangle size={12} />
                          {error}
                        </div>
                      )}
                    </div>
                  );
                })}
                <button type="submit" className="btn-submit-reg" disabled={isSubmitting}>
                  <FaPaperPlane />
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </button>
              </form>
            )}
          </div>
        </m.div>
      </m.div>
    </AnimatePresence>,
    document.body
  );
};

export default WebEventRegistrationModal;
