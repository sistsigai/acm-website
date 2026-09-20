import React from "react";
import { IQuestion, QuestionType, IQuestionOption } from "../../types/formBuilder";

interface QuestionCardProps {
  question: IQuestion;
  index: number;
  totalQuestions: number;
  isActive: boolean;
  onSelect: () => void;
  onChange: (updatedQuestion: IQuestion) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const QUESTION_TYPE_LABELS: { type: QuestionType; label: string; icon: string }[] = [
  { type: "text", label: "Short Answer", icon: "bi-card-text" },
  { type: "textarea", label: "Paragraph", icon: "bi-text-paragraph" },
  { type: "multiple-choice", label: "Multiple Choice", icon: "bi-ui-radios" },
  { type: "checkbox", label: "Checkboxes", icon: "bi-ui-checks" },
  { type: "dropdown", label: "Dropdown", icon: "bi-caret-down-square" },
  { type: "yes-no", label: "Yes / No", icon: "bi-toggles" },
  { type: "file", label: "File Upload", icon: "bi-file-earmark-arrow-up" },
  { type: "date", label: "Date", icon: "bi-calendar-event" },
  { type: "time", label: "Time", icon: "bi-clock" },
];

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  totalQuestions,
  isActive,
  onSelect,
  onChange,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const handleTypeChange = (newType: QuestionType) => {
    let updated: IQuestion = {
      ...question,
      type: newType,
    };

    if (["multiple-choice", "checkbox", "dropdown"].includes(newType)) {
      if (!updated.options || updated.options.length === 0) {
        updated.options = [
          { id: `opt_${Date.now()}_1`, label: "Option 1" },
          { id: `opt_${Date.now()}_2`, label: "Option 2" },
        ];
      }
    } else if (newType === "yes-no") {
      updated.options = [
        { id: "opt_yes", label: "Yes" },
        { id: "opt_no", label: "No" },
      ];
    } else if (newType === "file") {
      if (!updated.allowedFormats) {
        updated.allowedFormats = ["pdf", "jpg", "png", "docx"];
      }
      if (!updated.maxFileSize) {
        updated.maxFileSize = 5; // 5 MB
      }
    }

    onChange(updated);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...question, question: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...question, description: e.target.value });
  };

  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...question, placeholder: e.target.value });
  };

  const handleRequiredToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...question, required: e.target.checked });
  };

  /* ---------------- OPTION HANDLERS ---------------- */
  const handleAddOption = () => {
    const currentOptions = question.options || [];
    const newOption: IQuestionOption = {
      id: `opt_${Date.now()}_${currentOptions.length + 1}`,
      label: `Option ${currentOptions.length + 1}`,
    };
    onChange({
      ...question,
      options: [...currentOptions, newOption],
    });
  };

  const handleOptionLabelChange = (optId: string, label: string) => {
    const currentOptions = question.options || [];
    const updatedOptions = currentOptions.map((opt) =>
      opt.id === optId ? { ...opt, label } : opt
    );
    onChange({
      ...question,
      options: updatedOptions,
    });
  };

  const handleDeleteOption = (optId: string) => {
    const currentOptions = question.options || [];
    if (currentOptions.length <= 1) return;
    onChange({
      ...question,
      options: currentOptions.filter((opt) => opt.id !== optId),
    });
  };

  return (
    <div
      className={`question-card ${isActive ? "active-card" : ""}`}
      onClick={onSelect}
    >
      {/* Header: Title and Type Selector */}
      <div className="question-card-header flex-column flex-sm-row">
        <div className="d-flex align-items-center gap-2 flex-grow-1 w-100">
          <span className="badge bg-indigo-500 text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "26px", height: "26px", background: "#6366f1", fontSize: "0.8rem" }}>
            {index + 1}
          </span>
          <input
            type="text"
            className="question-input-title"
            placeholder="Untitled Question"
            value={question.question}
            onChange={handleTitleChange}
          />
        </div>

        <div className="w-sm-auto w-100 mt-2 mt-sm-0">
          <select
            className="form-select question-type-select"
            value={question.type}
            onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
          >
            {QUESTION_TYPE_LABELS.map((item) => (
              <option key={item.type} value={item.type}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description / Helper text */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control form-control-glass form-control-sm text-secondary"
          placeholder="Description or helper text (optional)"
          value={question.description || ""}
          onChange={handleDescriptionChange}
        />
      </div>

      {/* Dynamic Content based on question type */}
      <div className="question-body mb-3">
        {/* Short Answer */}
        {question.type === "text" && (
          <div>
            <input
              type="text"
              className="form-control form-control-glass"
              placeholder={question.placeholder || "Short answer placeholder (optional)"}
              value={question.placeholder || ""}
              onChange={handlePlaceholderChange}
            />
          </div>
        )}

        {/* Paragraph */}
        {question.type === "textarea" && (
          <div>
            <textarea
              className="form-control form-control-glass"
              rows={2}
              placeholder={question.placeholder || "Long answer placeholder (optional)"}
              value={question.placeholder || ""}
              onChange={(e) => onChange({ ...question, placeholder: e.target.value })}
            />
          </div>
        )}

        {/* Option Based: Multiple Choice / Checkbox / Dropdown */}
        {["multiple-choice", "checkbox", "dropdown"].includes(question.type) && (
          <div className="options-container">
            {(question.options || []).map((opt, optIdx) => (
              <div key={opt.id} className="option-item">
                <span className="text-secondary">
                  {question.type === "multiple-choice" && <i className="bi bi-circle"></i>}
                  {question.type === "checkbox" && <i className="bi bi-square"></i>}
                  {question.type === "dropdown" && <span className="small text-muted">{optIdx + 1}.</span>}
                </span>

                <input
                  type="text"
                  className="form-control option-input"
                  value={opt.label}
                  onChange={(e) => handleOptionLabelChange(opt.id, e.target.value)}
                  placeholder={`Option ${optIdx + 1}`}
                />

                {(question.options || []).length > 1 && (
                  <button
                    type="button"
                    className="option-delete-btn"
                    title="Remove option"
                    onClick={() => handleDeleteOption(opt.id)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="add-option-btn mt-2"
              onClick={handleAddOption}
            >
              <i className="bi bi-plus-circle"></i> Add Option
            </button>
          </div>
        )}

        {/* Yes / No */}
        {question.type === "yes-no" && (
          <div className="d-flex gap-3 text-secondary small p-2 rounded" style={{ background: "rgba(15, 23, 42, 0.4)" }}>
            <span className="badge bg-secondary px-3 py-2">🔘 Yes</span>
            <span className="badge bg-secondary px-3 py-2">🔘 No</span>
          </div>
        )}

        {/* File Upload */}
        {question.type === "file" && (
          <div className="p-3 rounded" style={{ background: "rgba(15, 23, 42, 0.5)", border: "1px dashed rgba(255, 255, 255, 0.15)" }}>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="text-secondary small">
                <i className="bi bi-cloud-arrow-up me-1"></i> Max File Size:
              </div>
              <select
                className="form-select form-select-sm w-auto form-control-glass"
                value={question.maxFileSize || 5}
                onChange={(e) => onChange({ ...question, maxFileSize: Number(e.target.value) })}
              >
                <option value={2}>2 MB</option>
                <option value={5}>5 MB</option>
                <option value={10}>10 MB</option>
                <option value={20}>20 MB</option>
              </select>
            </div>
            <div className="mt-2 text-muted small">
              Allowed formats: PDF, DOCX, JPG, PNG
            </div>
          </div>
        )}

        {/* Date / Time */}
        {(question.type === "date" || question.type === "time") && (
          <div className="p-3 rounded text-secondary small" style={{ background: "rgba(15, 23, 42, 0.5)" }}>
            <i className={`bi ${question.type === "date" ? "bi-calendar-event" : "bi-clock"} me-2`}></i>
            Respondent will select a {question.type === "date" ? "valid date (DD/MM/YYYY)" : "time (HH:MM AM/PM)"}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="question-card-footer">
        {/* Reordering */}
        <div className="d-flex gap-1 me-auto">
          <button
            type="button"
            className="card-action-btn"
            disabled={index === 0}
            title="Move Up"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
          >
            <i className="bi bi-chevron-up"></i>
          </button>
          <button
            type="button"
            className="card-action-btn"
            disabled={index === totalQuestions - 1}
            title="Move Down"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
          >
            <i className="bi bi-chevron-down"></i>
          </button>
        </div>

        {/* Duplicate */}
        <button
          type="button"
          className="card-action-btn"
          title="Duplicate Question"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
        >
          <i className="bi bi-copy"></i>
        </button>

        {/* Delete */}
        <button
          type="button"
          className="card-action-btn delete-btn"
          title="Delete Question"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <i className="bi bi-trash3"></i>
        </button>

        {/* Required Switch */}
        <div className="form-check form-switch ms-2 d-flex align-items-center gap-2">
          <input
            className="form-check-input"
            type="checkbox"
            id={`req_toggle_${question.id}`}
            checked={question.required}
            onChange={handleRequiredToggle}
            style={{ cursor: "pointer" }}
          />
          <label
            className="form-check-label text-secondary small user-select-none"
            htmlFor={`req_toggle_${question.id}`}
            style={{ cursor: "pointer" }}
          >
            Required
          </label>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
