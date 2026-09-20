import React, { useState } from "react";
import { IQuestion } from "../../types/formBuilder";

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

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      style={{
        backgroundColor: "rgba(0,0,0,0.85)",
        zIndex: 9999,
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content modal-content-glass">
          {/* Header */}
          <div className="modal-header border-bottom border-secondary border-opacity-25 pb-3">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-indigo-500 p-2" style={{ background: "#6366f1" }}>
                <i className="bi bi-eye fs-6"></i>
              </span>
              <div>
                <h5 className="modal-title fw-bold text-white mb-0">Live Form Preview</h5>
                <small className="text-secondary">Simulated applicant/attendee view</small>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4" style={{ maxHeight: "75vh", overflowY: "auto" }}>
            {/* Form Title Banner */}
            <div
              className="p-4 rounded-3 mb-4"
              style={{
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)",
                borderTop: "6px solid #6366f1",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <h3 className="fw-bold text-white mb-2">{title || "Untitled Form"}</h3>
              {description && <p className="text-light text-opacity-75 mb-0">{description}</p>}
              <div className="text-danger small mt-2">* Indicates required question</div>
            </div>

            {submitted ? (
              <div className="text-center py-5">
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "70px",
                    height: "70px",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#10b981",
                    fontSize: "2.2rem",
                  }}
                >
                  <i className="bi bi-check-circle-fill"></i>
                </div>
                <h4 className="fw-bold text-white mb-2">Test Submission Successful!</h4>
                <p className="text-secondary mb-4">
                  All validations passed. Form is configured correctly.
                </p>
                <button
                  type="button"
                  className="btn btn-outline-light px-4"
                  onClick={handleReset}
                >
                  Submit Another Test Response
                </button>
              </div>
            ) : (
              <form onSubmit={handleTestSubmit}>
                {questions.length === 0 ? (
                  <div className="text-center py-5 text-secondary">
                    <i className="bi bi-question-circle display-4 mb-2 d-block text-muted"></i>
                    No questions added yet. Add questions in the builder to preview them here.
                  </div>
                ) : (
                  questions.map((q, idx) => (
                    <div key={q.id} className="preview-question-card">
                      <label className="fw-semibold text-light mb-1 d-block">
                        {idx + 1}. {q.question || "Untitled Question"}
                        {q.required && <span className="text-danger ms-1">*</span>}
                      </label>

                      {q.description && (
                        <p className="text-secondary small mb-2">{q.description}</p>
                      )}

                      {/* Short Answer */}
                      {q.type === "text" && (
                        <input
                          type="text"
                          className={`form-control form-control-glass ${errors[q.id] ? "border-danger" : ""}`}
                          placeholder={q.placeholder || "Your answer"}
                          value={answers[q.id] || ""}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                        />
                      )}

                      {/* Paragraph */}
                      {q.type === "textarea" && (
                        <textarea
                          className={`form-control form-control-glass ${errors[q.id] ? "border-danger" : ""}`}
                          rows={3}
                          placeholder={q.placeholder || "Your detailed response"}
                          value={answers[q.id] || ""}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                        />
                      )}

                      {/* Multiple Choice */}
                      {q.type === "multiple-choice" && (
                        <div className="mt-2 d-flex flex-column gap-2">
                          {(q.options || []).map((opt) => (
                            <div key={opt.id} className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name={`preview_${q.id}`}
                                id={`preview_opt_${opt.id}`}
                                checked={answers[q.id] === opt.label}
                                onChange={() => handleInputChange(q.id, opt.label)}
                              />
                              <label
                                className="form-check-label text-light"
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
                        <div className="mt-2 d-flex flex-column gap-2">
                          {(q.options || []).map((opt) => {
                            const isChecked = (answers[q.id] || []).includes(opt.label);
                            return (
                              <div key={opt.id} className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`preview_chk_${opt.id}`}
                                  checked={isChecked}
                                  onChange={(e) => handleCheckboxChange(q.id, opt.label, e.target.checked)}
                                />
                                <label
                                  className="form-check-label text-light"
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
                        <div className="mt-2 d-flex gap-3">
                          <button
                            type="button"
                            className={`btn px-4 py-2 ${answers[q.id] === "Yes" ? "btn-primary" : "btn-outline-secondary"}`}
                            style={answers[q.id] === "Yes" ? { background: "#6366f1", borderColor: "#6366f1" } : {}}
                            onClick={() => handleInputChange(q.id, "Yes")}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            className={`btn px-4 py-2 ${answers[q.id] === "No" ? "btn-primary" : "btn-outline-secondary"}`}
                            style={answers[q.id] === "No" ? { background: "#6366f1", borderColor: "#6366f1" } : {}}
                            onClick={() => handleInputChange(q.id, "No")}
                          >
                            No
                          </button>
                        </div>
                      )}

                      {/* File Upload */}
                      {q.type === "file" && (
                        <div className="p-3 rounded text-center" style={{ background: "rgba(15, 23, 42, 0.4)", border: "1px dashed rgba(255, 255, 255, 0.2)" }}>
                          <i className="bi bi-cloud-arrow-up display-6 text-indigo-400 mb-2 d-block" style={{ color: "#818cf8" }}></i>
                          <div className="small text-light mb-1">Click to browse or drag file here</div>
                          <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                            Max file size: {q.maxFileSize || 5} MB (PDF, DOCX, JPG, PNG)
                          </div>
                        </div>
                      )}

                      {/* Date */}
                      {q.type === "date" && (
                        <input
                          type="date"
                          className="form-control form-control-glass"
                          value={answers[q.id] || ""}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                        />
                      )}

                      {/* Time */}
                      {q.type === "time" && (
                        <input
                          type="time"
                          className="form-control form-control-glass"
                          value={answers[q.id] || ""}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                        />
                      )}

                      {/* Error text */}
                      {errors[q.id] && (
                        <div className="text-danger small mt-2">
                          <i className="bi bi-exclamation-circle me-1"></i>
                          {errors[q.id]}
                        </div>
                      )}
                    </div>
                  ))
                )}

                {questions.length > 0 && (
                  <div className="d-flex justify-content-end gap-3 mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4 py-2"
                      onClick={handleReset}
                    >
                      Clear Form
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary px-4 py-2"
                      style={{ background: "#6366f1", borderColor: "#6366f1" }}
                    >
                      Test Submit Response
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>

          <div className="modal-footer border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreviewModal;
