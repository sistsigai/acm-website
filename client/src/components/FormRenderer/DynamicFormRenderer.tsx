import React from "react";
import { IQuestion } from "../../types/formBuilder";

interface DynamicFormRendererProps {
  questions: IQuestion[];
  answers: Record<string, any>;
  errors?: Record<string, string>;
  onChange: (questionId: string, value: any) => void;
  disabled?: boolean;
}

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  questions,
  answers,
  errors = {},
  onChange,
  disabled = false,
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
              <input
                type="date"
                className={`form-control form-control-glass ${error ? "is-invalid" : ""}`}
                value={val || ""}
                disabled={disabled}
                onChange={(e) => onChange(q.id, e.target.value)}
              />
            )}

            {/* Time */}
            {q.type === "time" && (
              <input
                type="time"
                className={`form-control form-control-glass ${error ? "is-invalid" : ""}`}
                value={val || ""}
                disabled={disabled}
                onChange={(e) => onChange(q.id, e.target.value)}
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
