import React, { useState } from "react";
import { createPortal } from "react-dom";
import type { IQuestion } from "../../types/formBuilder";
import { CustomDatePicker } from "../CustomDatePicker";
import { CustomTimePicker } from "../CustomTimePicker";

interface FormPreviewModalProps {
  title: string;
  description?: string;
  questions: IQuestion[];
  show: boolean;
  onClose: () => void;
}

const FormPreviewModal: React.FC<FormPreviewModalProps> = ({
  title,
  description,
  questions,
  show,
  onClose,
}) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!show) return null;

  const handleInputChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  const handleCheckboxChange = (questionId: string, optionLabel: string, checked: boolean) => {
    const currentSelections: string[] = answers[questionId] || [];
    let updated: string[];
    if (checked) {
      updated = [...currentSelections, optionLabel];
    } else {
      updated = currentSelections.filter((item) => item !== optionLabel);
    }
    handleInputChange(questionId, updated);
  };

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    questions.forEach((q) => {
      if (q.required) {
        const val = answers[q.id];
        if (!val || (Array.isArray(val) && val.length === 0) || (typeof val === "string" && !val.trim())) {
          newErrors[q.id] = "This question is required";
        }
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setErrors({});
    setSubmitted(false);
  };

  return createPortal(
    <div
      className="modal show d-block"
      tabIndex={-1}
      style={{
        backgroundColor: "rgba(0,0,0,0.85)",
        zIndex: 9999,
        backdropFilter: "blur(14px)",
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" style={{ maxWidth: "820px" }}>
        <div
          className="modal-content border-0 shadow-2xl"
          style={{
            background: "linear-gradient(165deg, #090d16 0%, #030712 100%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 30px rgba(99, 102, 241, 0.15)",
          }}
        >
          {/* Header */}
          <div className="modal-header border-bottom border-secondary border-opacity-20 px-4 py-3">
            <div className="d-flex align-items-center gap-3">
              <span
                className="badge p-2.5 d-flex align-items-center justify-content-center rounded-3"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
                  boxShadow: "0 0 14px rgba(99, 102, 241, 0.4)",
                  width: "36px",
                  height: "36px",
                }}
              >
                <i className="bi bi-eye-fill fs-5 text-white"></i>
              </span>
              <div>
                <h5 className="modal-title fw-bold text-white mb-0" style={{ fontSize: "1.15rem", letterSpacing: "-0.3px" }}>
                  Live Form Preview
                </h5>
                <small className="text-secondary" style={{ fontSize: "0.78rem" }}>
                  Simulated applicant / attendee view
                </small>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4 d-flex flex-column" style={{ maxHeight: "75vh", overflowY: "auto" }}>
            {/* Form Title Banner */}
            <div
              className="p-4 rounded-3 mb-4 position-relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)",
                borderTop: "4px solid #6366f1",
                borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
                borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 24px -6px rgba(0, 0, 0, 0.5)",
              }}
            >
              <h3 className="fw-bold text-white mb-2" style={{ fontSize: "1.45rem", letterSpacing: "-0.4px" }}>
                {title || "Untitled Form"}
              </h3>
              {description && (
                <p className="text-secondary mb-3" style={{ fontSize: "0.92rem", lineHeight: "1.5" }}>
                  {description}
                </p>
              )}
              <div className="d-flex align-items-center">
                <span
                  className="badge px-2.5 py-1 fw-medium d-inline-flex align-items-center"
                  style={{
                    background: "rgba(244, 63, 94, 0.12)",
                    color: "#fb7185",
                    border: "1px solid rgba(244, 63, 94, 0.25)",
                    fontSize: "0.74rem",
                    borderRadius: "6px",
                    gap: "6px",
                  }}
                >
                  <i className="bi bi-asterisk" style={{ fontSize: "0.65rem" }}></i>
                  <span>Indicates required question</span>
                </span>
              </div>
            </div>

            {submitted ? (
              <div
                className="text-center py-5 px-4 rounded-3 my-auto"
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  boxShadow: "0 0 30px rgba(16, 185, 129, 0.1)",
                }}
              >
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle shadow-lg"
                  style={{
                    width: "68px",
                    height: "68px",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "#ffffff",
                    fontSize: "2rem",
                    boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)",
                  }}
                >
                  <i className="bi bi-check-lg"></i>
                </div>
                <h4 className="fw-bold text-white mb-2">Test Submission Successful!</h4>
                <p className="text-secondary mb-4 small" style={{ maxWidth: "450px", margin: "0 auto 1.5rem auto" }}>
                  All required fields and validations passed successfully. Form is ready to receive attendee responses.
                </p>
                <button
                  type="button"
                  className="btn btn-outline-light px-4 py-2 fw-semibold rounded-2"
                  style={{ fontSize: "0.88rem" }}
                  onClick={handleReset}
                >
                  <i className="bi bi-arrow-repeat me-1.5"></i> Submit Another Test Response
                </button>
              </div>
            ) : (
              <form onSubmit={handleTestSubmit} className="d-flex flex-column gap-3">
                {questions.length === 0 ? (
                  <div className="text-center py-5 text-secondary">
                    <i className="bi bi-question-circle display-4 mb-2 d-block text-muted"></i>
                    No questions added yet. Add questions in the builder to preview them here.
                  </div>
                ) : (
                  questions.map((q, idx) => (
                    <div key={q.id} className="preview-question-card mb-0">
                      <div className="d-flex align-items-baseline gap-2 mb-2">
                        <span
                          className="badge rounded-circle d-flex align-items-center justify-content-center fw-bold"
                          style={{
                            width: "22px",
                            height: "22px",
                            fontSize: "0.72rem",
                            background: "rgba(99, 102, 241, 0.2)",
                            color: "#a5b4fc",
                            border: "1px solid rgba(99, 102, 241, 0.35)",
                            flexShrink: 0,
                          }}
                        >
                          {idx + 1}
                        </span>
                        <label className="fw-bold text-white mb-0" style={{ fontSize: "0.95rem" }}>
                          {q.question || "Untitled Question"}
                          {q.required && <span className="text-danger ms-1.5">*</span>}
                        </label>
                      </div>

                      {q.description && (
                        <p className="text-secondary small mb-2.5 ms-4">{q.description}</p>
                      )}

                      <div className="ms-md-4">
                        {/* Short Answer */}
                        {q.type === "text" && (
                          <input
                            type="text"
                            className={`form-control form-control-glass ${errors[q.id] ? "border-danger" : ""}`}
                            placeholder={q.placeholder || "Enter your answer..."}
                            value={answers[q.id] || ""}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                          />
                        )}

                        {/* Paragraph */}
                        {q.type === "textarea" && (
                          <textarea
                            className={`form-control form-control-glass ${errors[q.id] ? "border-danger" : ""}`}
                            rows={3}
                            placeholder={q.placeholder || "Enter your detailed response..."}
                            value={answers[q.id] || ""}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                          />
                        )}

                        {/* Multiple Choice */}
                        {q.type === "multiple-choice" && (
                          <div className="d-flex flex-column gap-2 mt-1">
                            {(q.options || []).map((opt) => (
                              <div
                                key={opt.id}
                                className="form-check p-2 rounded-2 transition-all"
                                style={{
                                  background: answers[q.id] === opt.label ? "rgba(99, 102, 241, 0.12)" : "rgba(255, 255, 255, 0.02)",
                                  border: answers[q.id] === opt.label ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid rgba(255, 255, 255, 0.04)",
                                }}
                              >
                                <input
                                  className="form-check-input ms-0 me-2"
                                  type="radio"
                                  name={`preview_${q.id}`}
                                  id={`preview_opt_${opt.id}`}
                                  checked={answers[q.id] === opt.label}
                                  onChange={() => handleInputChange(q.id, opt.label)}
                                />
                                <label
                                  className="form-check-label text-light fw-medium small"
                                  htmlFor={`preview_opt_${opt.id}`}
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
                          <div className="d-flex flex-column gap-2 mt-1">
                            {(q.options || []).map((opt) => {
                              const isChecked = (answers[q.id] || []).includes(opt.label);
                              return (
                                <div
                                  key={opt.id}
                                  className="form-check p-2 rounded-2 transition-all"
                                  style={{
                                    background: isChecked ? "rgba(99, 102, 241, 0.12)" : "rgba(255, 255, 255, 0.02)",
                                    border: isChecked ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid rgba(255, 255, 255, 0.04)",
                                  }}
                                >
                                  <input
                                    className="form-check-input ms-0 me-2"
                                    type="checkbox"
                                    id={`preview_chk_${opt.id}`}
                                    checked={isChecked}
                                    onChange={(e) => handleCheckboxChange(q.id, opt.label, e.target.checked)}
                                  />
                                  <label
                                    className="form-check-label text-light fw-medium small"
                                    htmlFor={`preview_chk_${opt.id}`}
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
                            className={`form-select form-control-glass ${errors[q.id] ? "border-danger" : ""}`}
                            value={answers[q.id] || ""}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                          >
                            <option value="">Choose an option...</option>
                            {(q.options || []).map((opt) => (
                              <option key={opt.id} value={opt.label}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        )}

                        {/* Yes / No */}
                        {q.type === "yes-no" && (
                          <div className="d-flex mt-1" style={{ gap: "10px" }}>
                            {["Yes", "No"].map((choice) => {
                              const isSelected = answers[q.id] === choice;
                              return (
                                <button
                                  key={choice}
                                  type="button"
                                  className="btn btn-sm px-4 py-1.5 fw-semibold rounded-2 transition-all"
                                  style={{
                                    background: isSelected
                                      ? "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)"
                                      : "rgba(255, 255, 255, 0.05)",
                                    color: isSelected ? "#ffffff" : "#cbd5e1",
                                    border: isSelected ? "1px solid #6366f1" : "1px solid rgba(255, 255, 255, 0.1)",
                                    boxShadow: isSelected ? "0 0 12px rgba(99, 102, 241, 0.35)" : "none",
                                  }}
                                  onClick={() => handleInputChange(q.id, choice)}
                                >
                                  {choice}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* File Upload */}
                        {q.type === "file" && (() => {
                          const maxFiles = q.maxFiles || 1;
                          const isMultiple = maxFiles > 1;
                          const rawVal = answers[q.id];
                          const fileNames: string[] = Array.isArray(rawVal)
                            ? rawVal.filter(Boolean)
                            : rawVal
                            ? [String(rawVal)]
                            : [];

                          const handlePreviewAdd = (files: FileList | null) => {
                            if (!files || files.length === 0) return;
                            const newNames = Array.from(files).map((f) => f.name);
                            if (isMultiple) {
                              const combined = [...fileNames, ...newNames].slice(0, maxFiles);
                              handleInputChange(q.id, combined);
                            } else {
                              handleInputChange(q.id, newNames[0]);
                            }
                          };

                          const handlePreviewRemove = (nameToRemove: string) => {
                            if (isMultiple) {
                              handleInputChange(
                                q.id,
                                fileNames.filter((n) => n !== nameToRemove)
                              );
                            } else {
                              handleInputChange(q.id, "");
                            }
                          };

                          return (
                            <div className="dynamic-file-upload-wrapper d-flex flex-column gap-2">
                              {fileNames.map((name, fIdx) => (
                                <div key={fIdx} className="dynamic-file-uploaded-card">
                                  <div className="d-flex align-items-center gap-3 overflow-hidden">
                                    <div className="dynamic-file-icon flex-shrink-0">
                                      <i className="bi bi-file-earmark-check-fill fs-3 text-info"></i>
                                    </div>
                                    <div className="d-flex flex-column overflow-hidden">
                                      <span className="text-white fw-semibold text-truncate small">
                                        {name}
                                      </span>
                                      <span
                                        className="text-secondary small mt-0.5"
                                        style={{ fontSize: "0.72rem" }}
                                      >
                                        Simulated Preview File
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger flex-shrink-0 d-inline-flex align-items-center gap-1 ms-2"
                                    style={{ fontSize: "0.75rem", padding: "4px 10px", borderRadius: "8px" }}
                                    onClick={() => handlePreviewRemove(name)}
                                  >
                                    <i className="bi bi-trash3"></i>
                                    <span>Remove</span>
                                  </button>
                                </div>
                              ))}

                              {fileNames.length < maxFiles && (
                                <label
                                  className="dynamic-file-dropzone d-block mb-0 cursor-pointer"
                                  style={{ border: "1.5px dashed rgba(99, 102, 241, 0.4)" }}
                                >
                                  <input
                                    type="file"
                                    multiple={isMultiple}
                                    style={{ display: "none" }}
                                    onChange={(e) => handlePreviewAdd(e.target.files)}
                                  />
                                  <div className="d-flex flex-column align-items-center gap-1 py-1">
                                    <i className="bi bi-cloud-arrow-up fs-2 text-primary" style={{ color: "#818cf8" }}></i>
                                    <span className="text-white fw-semibold small">
                                      Click to browse or drag & drop file here
                                    </span>
                                    <span className="text-secondary" style={{ fontSize: "0.74rem" }}>
                                      Formats: {(q.allowedFormats || ["PDF", "DOCX", "JPG", "PNG"]).map((f) => f.toUpperCase()).join(", ")} (Max: {q.maxFileSize || 5} MB
                                      {isMultiple ? `, up to ${maxFiles} files` : ""})
                                    </span>
                                  </div>
                                </label>
                              )}
                            </div>
                          );
                        })()}

                        {/* Date */}
                        {q.type === "date" && (
                          <CustomDatePicker
                            value={answers[q.id] || ""}
                            onChange={(dateStr) => handleInputChange(q.id, dateStr)}
                            isInvalid={!!errors[q.id]}
                            placeholder={q.placeholder || "Select Date"}
                          />
                        )}

                        {/* Time */}
                        {q.type === "time" && (
                          <CustomTimePicker
                            value={answers[q.id] || ""}
                            onChange={(timeStr) => handleInputChange(q.id, timeStr)}
                            isInvalid={!!errors[q.id]}
                            placeholder={q.placeholder || "Select Time"}
                          />
                        )}

                        {/* Error text */}
                        {errors[q.id] && (
                          <div className="text-danger small mt-2 d-flex align-items-center gap-1">
                            <i className="bi bi-exclamation-circle-fill"></i>
                            <span>{errors[q.id]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer border-top border-secondary border-opacity-20 px-4 py-3 d-flex justify-content-between">
            <div>
              {!submitted && questions.length > 0 && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary px-3 py-1.5 text-secondary"
                  style={{ fontSize: "0.82rem" }}
                  onClick={handleReset}
                >
                  <i className="bi bi-trash3 me-1"></i> Clear Form
                </button>
              )}
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-secondary px-3 py-1.5"
                style={{ fontSize: "0.82rem" }}
                onClick={onClose}
              >
                Close Preview
              </button>

              {!submitted && questions.length > 0 && (
                <button
                  type="button"
                  className="btn btn-sm btn-primary px-3.5 py-1.5 fw-semibold"
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
                    borderColor: "#6366f1",
                    fontSize: "0.82rem",
                    boxShadow: "0 0 12px rgba(99, 102, 241, 0.3)",
                  }}
                  onClick={handleTestSubmit}
                >
                  <i className="bi bi-send me-1"></i> Test Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FormPreviewModal;
