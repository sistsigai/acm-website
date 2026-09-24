import React, { useState, useRef } from "react";
import type { IQuestion } from "../../types/formBuilder";
import { CustomDatePicker } from "../CustomDatePicker";
import { CustomTimePicker } from "../CustomTimePicker";
import {
  uploadEventRegistrationFile,
  deleteEventRegistrationFile,
} from "../../services/website/webeventService";

export interface FileUploadInfo {
  questionId: string;
  url: string;
  public_id?: string;
  resource_type?: string;
}

interface DynamicFormRendererProps {
  questions: IQuestion[];
  answers: Record<string, any>;
  errors?: Record<string, string>;
  onChange: (questionId: string, value: any) => void;
  disabled?: boolean;
  eventId?: string;
  onFileUpload?: (fileInfo: FileUploadInfo) => void;
  onFileRemove?: (fileInfo: FileUploadInfo) => void;
}

/* ---------------- FILE UPLOAD FIELD COMPONENT ---------------- */
interface UploadedFileItem {
  url: string;
  name: string;
  public_id?: string;
  resource_type?: string;
}

const FileUploadField: React.FC<{
  question: IQuestion;
  value: string | string[];
  onChange: (val: string | string[]) => void;
  disabled?: boolean;
  eventId?: string;
  isInvalid?: boolean;
  onFileUpload?: (fileInfo: FileUploadInfo) => void;
  onFileRemove?: (fileInfo: FileUploadInfo) => void;
}> = ({
  question,
  value,
  onChange,
  disabled,
  eventId,
  isInvalid,
  onFileUpload,
  onFileRemove,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFiles = question.maxFiles && question.maxFiles > 0 ? question.maxFiles : 1;
  const isMultiple = maxFiles > 1;
  const maxMb = question.maxFileSize || 5;
  const maxBytes = maxMb * 1024 * 1024;
  const allowedExts =
    question.allowedFormats && question.allowedFormats.length > 0
      ? question.allowedFormats.map((f) => f.toLowerCase().replace(".", ""))
      : ["pdf", "docx", "doc", "jpg", "jpeg", "png"];

  // Normalize initial value to internal list of files
  const [filesList, setFilesList] = useState<UploadedFileItem[]>(() => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.filter(Boolean).map((u) => {
        const parts = u.split("/");
        return {
          url: u,
          name: decodeURIComponent(parts[parts.length - 1]) || "Uploaded File",
        };
      });
    }
    if (typeof value === "string" && value.trim()) {
      const parts = value.split("/");
      return [
        {
          url: value,
          name: decodeURIComponent(parts[parts.length - 1]) || "Uploaded File",
        },
      ];
    }
    return [];
  });

  // Sync internal filesList if value prop is cleared externally (e.g. form reset)
  React.useEffect(() => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      setFilesList([]);
    }
  }, [value]);

  const emitChange = (newList: UploadedFileItem[]) => {
    setFilesList(newList);
    if (!isMultiple) {
      onChange(newList.length > 0 ? newList[0].url : "");
    } else {
      onChange(newList.map((f) => f.url));
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") {
      return <i className="bi bi-file-earmark-pdf-fill fs-3 text-danger"></i>;
    }
    if (ext === "docx" || ext === "doc") {
      return <i className="bi bi-file-earmark-word-fill fs-3 text-primary"></i>;
    }
    if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext || "")) {
      return <i className="bi bi-file-earmark-image-fill fs-3 text-success"></i>;
    }
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext || "")) {
      return <i className="bi bi-file-earmark-zip-fill fs-3 text-warning"></i>;
    }
    return <i className="bi bi-file-earmark-check-fill fs-3 text-info"></i>;
  };

  const handleFilesProcess = async (incomingFiles: File[]) => {
    setFileError(null);
    if (incomingFiles.length === 0) return;

    // 1. Validate total file count
    const currentCount = filesList.length;
    const remainingSlots = maxFiles - currentCount;
    if (remainingSlots <= 0) {
      setFileError(`Maximum limit of ${maxFiles} file(s) already reached.`);
      return;
    }

    if (incomingFiles.length > remainingSlots) {
      setFileError(
        `You can only upload ${remainingSlots} more file(s). You selected ${incomingFiles.length}.`
      );
      return;
    }

    // 2. Validate format and size of EACH file before proceeding
    for (const f of incomingFiles) {
      const ext = f.name.split(".").pop()?.toLowerCase();
      if (!ext || !allowedExts.includes(ext)) {
        setFileError(
          `File "${f.name}" has unsupported format .${ext || "unknown"}. Allowed formats: ${allowedExts.map((e) => e.toUpperCase()).join(", ")}`
        );
        return;
      }

      if (f.size > maxBytes) {
        setFileError(
          `File "${f.name}" (${(f.size / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum allowed size of ${maxMb} MB.`
        );
        return;
      }
    }

    // 3. Process uploads
    setUploading(true);
    setProgress(5);

    try {
      const uploadedResults: UploadedFileItem[] = [];

      for (let i = 0; i < incomingFiles.length; i++) {
        const file = incomingFiles[i];
        if (!eventId) {
          // Preview mode mock upload
          uploadedResults.push({
            url: `https://res.cloudinary.com/mock/${file.name}`,
            name: file.name,
          });
          continue;
        }

        const res = await uploadEventRegistrationFile(eventId, file, (pct) => {
          const overallPct = Math.round(
            ((i + pct / 100) / incomingFiles.length) * 100
          );
          setProgress(overallPct);
        });

        const item: UploadedFileItem = {
          url: res.url,
          name: res.originalName || file.name,
          public_id: res.public_id,
          resource_type: res.resource_type,
        };

        uploadedResults.push(item);

        if (onFileUpload) {
          onFileUpload({
            questionId: question.id,
            url: res.url,
            public_id: res.public_id,
            resource_type: res.resource_type,
          });
        }
      }

      const updatedList = !isMultiple
        ? uploadedResults.slice(0, 1)
        : [...filesList, ...uploadedResults];

      emitChange(updatedList);
    } catch (err: any) {
      setFileError(err.message || "Failed to upload file(s) to Cloudinary.");
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || uploading || deletingUrl) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesProcess(Array.from(e.dataTransfer.files));
    }
  };

  const handleRemoveItem = async (itemToRemove: UploadedFileItem) => {
    if (disabled || deletingUrl) return;
    try {
      setDeletingUrl(itemToRemove.url);
      await deleteEventRegistrationFile({
        public_id: itemToRemove.public_id,
        resource_type: itemToRemove.resource_type,
        url: itemToRemove.url,
      });

      if (onFileRemove) {
        onFileRemove({
          questionId: question.id,
          url: itemToRemove.url,
          public_id: itemToRemove.public_id,
          resource_type: itemToRemove.resource_type,
        });
      }

      const nextList = filesList.filter((f) => f.url !== itemToRemove.url);
      emitChange(nextList);
      setFileError(null);
    } catch (err) {
      console.error("Failed to delete file from Cloudinary:", err);
    } finally {
      setDeletingUrl(null);
    }
  };

  const acceptString = allowedExts
    .flatMap((ext) => {
      if (ext === "jpg") return [".jpg", ".jpeg"];
      return [`.${ext}`];
    })
    .join(",");

  return (
    <div className="dynamic-file-upload-wrapper d-flex flex-column gap-2">
      {/* Uploaded Cards List */}
      {filesList.length > 0 && (
        <div className="d-flex flex-column gap-2">
          {filesList.map((item, idx) => {
            const isItemDeleting = deletingUrl === item.url;
            return (
              <div key={item.url || idx} className="dynamic-file-uploaded-card">
                <div className="d-flex align-items-center gap-3 overflow-hidden">
                  <div className="dynamic-file-icon flex-shrink-0">
                    {getFileIcon(item.name)}
                  </div>
                  <div className="d-flex flex-column overflow-hidden">
                    <span
                      className="text-white fw-semibold text-truncate small"
                      title={item.name}
                    >
                      {item.name}
                    </span>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-info small text-decoration-none d-inline-flex align-items-center gap-1"
                        style={{ fontSize: "0.78rem" }}
                      >
                        <span>View</span>
                        <i className="bi bi-box-arrow-up-right" style={{ fontSize: "0.68rem" }}></i>
                      </a>
                    </div>
                  </div>
                </div>

                {!disabled && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger flex-shrink-0 d-inline-flex align-items-center gap-1 ms-2"
                    style={{ fontSize: "0.75rem", padding: "4px 10px", borderRadius: "8px" }}
                    disabled={isItemDeleting}
                    onClick={() => handleRemoveItem(item)}
                  >
                    {isItemDeleting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          style={{ width: "0.75rem", height: "0.75rem" }}
                        />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-trash3"></i>
                        <span>Remove</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        disabled={disabled || uploading || !!deletingUrl}
        multiple={isMultiple}
        accept={acceptString || undefined}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFilesProcess(Array.from(e.target.files));
          }
        }}
      />

      {/* Dropzone or Maximum Uploaded Indicator */}
      {filesList.length < maxFiles ? (
        <div
          className={`dynamic-file-dropzone ${isDragging ? "dragging" : ""} ${isInvalid || fileError ? "is-invalid" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled && !uploading && !deletingUrl) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => {
            if (!disabled && !uploading && !deletingUrl && fileInputRef.current) {
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
                Formats: {allowedExts.map((e) => e.toUpperCase()).join(", ")} (Max: {maxMb} MB
                {isMultiple ? `, up to ${maxFiles} files` : ""})
              </span>
              {isMultiple && filesList.length > 0 && (
                <span className="text-info mt-1" style={{ fontSize: "0.72rem" }}>
                  {filesList.length} of {maxFiles} file(s) added
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        isMultiple && (
          <div className="dynamic-file-limit-reached">
            <i className="bi bi-check-circle-fill text-success me-1.5"></i>
            Maximum of {maxFiles} files uploaded
          </div>
        )
      )}

      {/* Error Message */}
      {fileError && (
        <div
          className="text-danger small mt-1 d-flex align-items-center gap-1.5"
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
  onFileUpload,
  onFileRemove,
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
                value={val ?? (q.maxFiles && q.maxFiles > 1 ? [] : "")}
                onChange={(fileVal) => onChange(q.id, fileVal)}
                disabled={disabled}
                eventId={eventId}
                isInvalid={!!error}
                onFileUpload={onFileUpload}
                onFileRemove={onFileRemove}
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
