import React, { useState, useRef } from "react";
import type { IQuestion } from "../../types/formBuilder";
import { CustomDatePicker } from "../CustomDatePicker";
import { CustomTimePicker } from "../CustomTimePicker";
import { uploadEventRegistrationFile } from "../../services/website/webeventService";

interface DynamicFormRendererProps {
  questions: IQuestion[];
  answers: Record<string, any>;
  errors?: Record<string, string>;
  onChange: (questionId: string, value: any) => void;
  disabled?: boolean;
  eventId?: string;
}

/* ---------------- FILE UPLOAD FIELD COMPONENT ---------------- */
const FileUploadField: React.FC<{
  question: IQuestion;
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  eventId?: string;
  isInvalid?: boolean;
}> = ({ question, value, onChange, disabled, eventId, isInvalid }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>(() => {
    if (value) {
      try {
        const parts = value.split("/");
        return decodeURIComponent(parts[parts.length - 1]);
      } catch {
        return "Uploaded File";
      }
    }
    return "";
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxMb = question.maxFileSize || 5;
  const maxBytes = maxMb * 1024 * 1024;
  const allowedExts =
    question.allowedFormats && question.allowedFormats.length > 0
      ? question.allowedFormats
      : ["pdf", "docx", "doc", "jpg", "jpeg", "png"];

  const handleFileProcess = async (file: File) => {
    setFileError(null);

    // Validate size
    if (file.size > maxBytes) {
      setFileError(
        `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds maximum allowed size of ${maxMb} MB`
      );
      return;
    }

    // Validate extension if specified
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext && allowedExts.length > 0) {
      const match = allowedExts.some(
        (a) => a.toLowerCase().replace(".", "") === ext
      );
      if (!match) {
        setFileError(
          `File type .${ext} is not allowed. Supported formats: ${allowedExts.join(", ")}`
        );
        return;
      }
    }

    if (!eventId) {
      // Mock upload for standalone testing
      setUploading(true);
      setProgress(40);
      setTimeout(() => setProgress(80), 300);
      setTimeout(() => {
        setUploading(false);
        setFileName(file.name);
        onChange(`https://res.cloudinary.com/mock/${file.name}`);
      }, 700);
      return;
    }

    try {
      setUploading(true);
      setProgress(10);
      const res = await uploadEventRegistrationFile(eventId, file, (pct) => {
        setProgress(pct);
      });
      setFileName(file.name);
      onChange(res.url);
    } catch (err: any) {
      setFileError(err.message || "Failed to upload file to Cloudinary");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || uploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  if (value) {
    return (
      <div className="dynamic-file-uploaded-card">
        <div className="d-flex align-items-center gap-3 overflow-hidden">
          <div className="dynamic-file-icon flex-shrink-0">
            <i className="bi bi-file-earmark-check-fill fs-3 text-info"></i>
          </div>
          <div className="d-flex flex-column overflow-hidden">
            <span
              className="text-white fw-semibold text-truncate small"
              title={fileName}
            >
              {fileName || "Uploaded File"}
            </span>
            <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
              <span
                className="badge bg-success-subtle text-success border border-success-subtle"
                style={{ fontSize: "0.7rem", padding: "2px 7px" }}
              >
                <i className="bi bi-cloud-check-fill me-1"></i> Saved to Cloudinary
              </span>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-info small text-decoration-none d-inline-flex align-items-center gap-1"
                style={{ fontSize: "0.75rem" }}
              >
                <span>View</span>
                <i className="bi bi-box-arrow-up-right" style={{ fontSize: "0.65rem" }}></i>
              </a>
            </div>
          </div>
        </div>

        {!disabled && (
          <button
            type="button"
            className="btn btn-sm btn-outline-danger flex-shrink-0 d-inline-flex align-items-center gap-1 ms-2"
            style={{ fontSize: "0.75rem", padding: "4px 10px", borderRadius: "8px" }}
            onClick={() => {
              onChange("");
              setFileName("");
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          >
            <i className="bi bi-trash3"></i>
            <span>Remove</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="dynamic-file-upload-wrapper">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        disabled={disabled || uploading}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileProcess(e.target.files[0]);
          }
        }}
      />

      <div
        className={`dynamic-file-dropzone ${isDragging ? "dragging" : ""} ${isInvalid || fileError ? "is-invalid" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !uploading) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled && !uploading && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
      >
        {uploading ? (
          <div className="d-flex flex-column align-items-center gap-2 py-2">
            <div
              className="spinner-border text-info spinner-border-sm"
              role="status"
              style={{ width: "1.8rem", height: "1.8rem" }}
            />
            <span className="text-white small fw-medium">
              Uploading to event folder in Cloudinary... {progress > 0 ? `${progress}%` : ""}
            </span>
            <div
              className="progress w-75"
              style={{ height: "4px", background: "rgba(255,255,255,0.1)" }}
            >
              <div
                className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                role="progressbar"
                style={{ width: `${progress || 50}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center gap-1 py-1">
            <i className="bi bi-cloud-arrow-up fs-2 text-info"></i>
            <span className="text-white fw-semibold small">
              Click to browse or drag & drop file here
            </span>
            <span className="text-secondary" style={{ fontSize: "0.74rem" }}>
              Formats: {allowedExts.map((e) => e.toUpperCase()).join(", ")} (Max: {maxMb} MB)
            </span>
          </div>
        )}
      </div>

      {fileError && (
        <div
          className="text-danger small mt-1.5 d-flex align-items-center gap-1"
          style={{ fontSize: "0.8rem" }}
        >
          <i className="bi bi-exclamation-triangle-fill"></i>
          <span>{fileError}</span>
        </div>
      )}
    </div>
  );
};

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  questions,
  answers,
  errors = {},
  onChange,
  disabled = false,
  eventId,
}) => {
  const handleCheckboxToggle = (questionId: string, optionLabel: string, checked: boolean) => {
    const currentList: string[] = answers[questionId] || [];
    let updated: string[];
    if (checked) {
      updated = [...currentList, optionLabel];
    } else {
      updated = currentList.filter((item) => item !== optionLabel);
    }
    onChange(questionId, updated);
  };

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className="dynamic-form-fields d-flex flex-column gap-3">
      {questions.map((q, idx) => {
        const error = errors[q.id];
        const val = answers[q.id];

        return (
          <div
            key={q.id || `q_${idx}`}
            className="dynamic-question-block p-3 rounded-3"
            style={{
              background: "rgba(15, 23, 42, 0.45)",
              border: error ? "1px solid rgba(239, 68, 68, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Question Label */}
            <label className="form-label text-light fw-semibold d-block mb-1">
              {q.question}
              {q.required && <span className="text-danger ms-1">*</span>}
            </label>

            {/* Description / Help text */}
            {q.description && (
              <p className="text-secondary small mb-2" style={{ fontSize: "0.825rem" }}>
                {q.description}
              </p>
            )}

            {/* Short Answer */}
            {q.type === "text" && (
              <input
                type="text"
                className={`form-control form-control-glass ${error ? "is-invalid" : ""}`}
                placeholder={q.placeholder || "Enter your answer"}
                value={val || ""}
                disabled={disabled}
                onChange={(e) => onChange(q.id, e.target.value)}
              />
            )}

            {/* Paragraph */}
            {q.type === "textarea" && (
              <textarea
                className={`form-control form-control-glass ${error ? "is-invalid" : ""}`}
                rows={3}
                placeholder={q.placeholder || "Enter your detailed response"}
                value={val || ""}
                disabled={disabled}
                onChange={(e) => onChange(q.id, e.target.value)}
              />
            )}

            {/* Multiple Choice (Radio) */}
            {q.type === "multiple-choice" && (
              <div className="d-flex flex-column gap-2 mt-2">
                {(q.options || []).map((opt) => (
                  <div key={opt.id} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question_${q.id}`}
                      id={`opt_${q.id}_${opt.id}`}
                      checked={val === opt.label}
                      disabled={disabled}
                      onChange={() => onChange(q.id, opt.label)}
                    />
                    <label
                      className="form-check-label text-light"
                      htmlFor={`opt_${q.id}_${opt.id}`}
                      style={{ cursor: "pointer" }}
                    >
                      {opt.label}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* Checkboxes */}
            {q.type === "checkbox" && (
              <div className="d-flex flex-column gap-2 mt-2">
                {(q.options || []).map((opt) => {
                  const isChecked = Array.isArray(val) && val.includes(opt.label);
                  return (
                    <div key={opt.id} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`chk_${q.id}_${opt.id}`}
                        checked={isChecked}
                        disabled={disabled}
                        onChange={(e) => handleCheckboxToggle(q.id, opt.label, e.target.checked)}
                      />
                      <label
                        className="form-check-label text-light"
                        htmlFor={`chk_${q.id}_${opt.id}`}
                        style={{ cursor: "pointer" }}
                      >
                        {opt.label}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Dropdown */}
            {q.type === "dropdown" && (
              <select
                className={`form-select form-control-glass ${error ? "is-invalid" : ""}`}
                value={val || ""}
                disabled={disabled}
                onChange={(e) => onChange(q.id, e.target.value)}
              >
                <option value="">Select an option...</option>
                {(q.options || []).map((opt) => (
                  <option key={opt.id} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {/* Yes / No */}
            {q.type === "yes-no" && (
              <div className="d-flex gap-3 mt-2">
                <button
                  type="button"
                  disabled={disabled}
                  className={`btn px-4 py-1 rounded-pill ${val === "Yes" ? "btn-primary" : "btn-outline-secondary"}`}
                  style={val === "Yes" ? { background: "#6366f1", borderColor: "#6366f1" } : {}}
                  onClick={() => onChange(q.id, "Yes")}
                >
                  Yes
                </button>
                <button
                  type="button"
                  disabled={disabled}
                  className={`btn px-4 py-1 rounded-pill ${val === "No" ? "btn-primary" : "btn-outline-secondary"}`}
                  style={val === "No" ? { background: "#6366f1", borderColor: "#6366f1" } : {}}
                  onClick={() => onChange(q.id, "No")}
                >
                  No
                </button>
              </div>
            )}

            {/* Date */}
            {q.type === "date" && (
              <CustomDatePicker
                value={val || ""}
                onChange={(dateStr) => onChange(q.id, dateStr)}
                isInvalid={!!error}
                placeholder={q.placeholder || "Select Date"}
                disabled={disabled}
              />
            )}

            {/* Time */}
            {q.type === "time" && (
              <CustomTimePicker
                value={val || ""}
                onChange={(timeStr) => onChange(q.id, timeStr)}
                isInvalid={!!error}
                placeholder={q.placeholder || "Select Time"}
                disabled={disabled}
              />
            )}

            {/* File Upload */}
            {q.type === "file" && (
              <FileUploadField
                question={q}
                value={val || ""}
                onChange={(url) => onChange(q.id, url)}
                disabled={disabled}
                eventId={eventId}
                isInvalid={!!error}
              />
            )}

            {/* Validation Error Message */}
            {error && (
              <div className="text-danger small mt-2 d-flex align-items-center gap-1">
                <i className="bi bi-exclamation-circle"></i> {error}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DynamicFormRenderer;
