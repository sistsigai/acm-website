import React, { useState, useRef, useEffect } from "react";
import type { IQuestion, QuestionType, IQuestionOption } from "../../types/formBuilder";
import { isCompulsoryQuestion } from "../../types/formBuilder";

interface QuestionCardProps {
  question: IQuestion;
  index: number;
  totalQuestions: number;
  isActive: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onSelect: () => void;
  onChange: (updatedQuestion: IQuestion) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const QUESTION_TYPE_LABELS: { type: QuestionType; label: string; icon: string; badgeColor: string }[] = [
  { type: "text", label: "Short Answer", icon: "bi-card-text", badgeColor: "#38bdf8" },
  { type: "textarea", label: "Paragraph", icon: "bi-text-paragraph", badgeColor: "#818cf8" },
  { type: "multiple-choice", label: "Multiple Choice", icon: "bi-ui-radios", badgeColor: "#4ade80" },
  { type: "checkbox", label: "Checkboxes", icon: "bi-ui-checks", badgeColor: "#fbbf24" },
  { type: "dropdown", label: "Dropdown", icon: "bi-caret-down-square", badgeColor: "#a78bfa" },
  { type: "yes-no", label: "Yes / No", icon: "bi-toggles", badgeColor: "#f472b6" },
  { type: "file", label: "File Upload", icon: "bi-file-earmark-arrow-up", badgeColor: "#38bdf8" },
  { type: "date", label: "Date", icon: "bi-calendar-event", badgeColor: "#34d399" },
  { type: "time", label: "Time", icon: "bi-clock", badgeColor: "#fb923c" },
];

const AVAILABLE_FILE_FORMATS = ["pdf", "jpg", "png", "docx", "zip"];

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  totalQuestions,
  isActive,
  isCollapsed = false,
  onToggleCollapse,
  onSelect,
  onChange,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);

  const typeMenuRef = useRef<HTMLDivElement>(null);

  // Click-outside listener for type dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typeMenuRef.current && !typeMenuRef.current.contains(e.target as Node)) {
        setIsTypeMenuOpen(false);
      }
    };
    if (isTypeMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTypeMenuOpen]);

  const currentTypeInfo =
    QUESTION_TYPE_LABELS.find((t) => t.type === question.type) || QUESTION_TYPE_LABELS[0];

  const handleTypeChange = (newType: QuestionType) => {
    setIsTypeMenuOpen(false);
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
      if (!updated.allowedFormats || updated.allowedFormats.length === 0) {
        updated.allowedFormats = ["pdf", "jpg", "png", "docx"];
      }
      if (!updated.maxFileSize) {
        updated.maxFileSize = 5;
      }
      if (!updated.maxFiles) {
        updated.maxFiles = 1;
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

  const handleAddOtherOption = () => {
    const currentOptions = question.options || [];
    const hasOther = currentOptions.some((o) =>
      o.label.toLowerCase().includes("other")
    );
    if (hasOther) return;

    const otherOption: IQuestionOption = {
      id: `opt_other_${Date.now()}`,
      label: "Other (Please specify)",
    };
    onChange({
      ...question,
      options: [...currentOptions, otherOption],
    });
  };

  const handleBulkAddOptions = () => {
    if (!bulkText.trim()) {
      setShowBulkAdd(false);
      return;
    }

    const lines = bulkText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setShowBulkAdd(false);
      return;
    }

    const newOptions: IQuestionOption[] = lines.map((line, idx) => ({
      id: `opt_${Date.now()}_bulk_${idx}`,
      label: line,
    }));

    const currentOptions = question.options || [];
    onChange({
      ...question,
      options: [...currentOptions, ...newOptions],
    });

    setBulkText("");
    setShowBulkAdd(false);
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

  /* ---------------- FILE FORMAT TOGGLE ---------------- */
  const handleToggleFormat = (format: string) => {
    const currentFormats = question.allowedFormats || ["pdf", "jpg", "png", "docx"];
    let updatedFormats: string[];
    if (currentFormats.includes(format)) {
      if (currentFormats.length === 1) return;
      updatedFormats = currentFormats.filter((f) => f !== format);
    } else {
      updatedFormats = [...currentFormats, format];
    }
    onChange({ ...question, allowedFormats: updatedFormats });
  };

  const isCompulsory = isCompulsoryQuestion(question);

  return (
    <div
      className={`question-card ${isActive ? "active-card" : ""}`}
      onClick={onSelect}
      style={{
        background: isActive ? "#0c1322" : "#080c16",
        border: isActive
          ? "1px solid rgba(56, 189, 248, 0.4)"
          : "1px solid rgba(255, 255, 255, 0.08)",
        borderLeft: isActive
          ? "3px solid #38bdf8"
          : "3px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        boxShadow: isActive
          ? "0 8px 24px -4px rgba(0, 0, 0, 0.7), 0 0 20px rgba(56, 189, 248, 0.12)"
          : "0 4px 12px rgba(0, 0, 0, 0.4)",
        padding: "1rem 1.25rem",
        transition: "all 0.2s ease",
      }}
    >
      {/* Card Header */}
      <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-2">
        {/* Left: Collapse, Number & Title */}
        <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ minWidth: "220px" }}>
          {onToggleCollapse && (
            <button
              type="button"
              className="btn btn-sm p-0 text-secondary border-0 d-flex align-items-center justify-content-center"
              style={{ width: "24px", height: "24px", cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse();
              }}
              title={isCollapsed ? "Expand question" : "Collapse question"}
            >
              <i className={`bi ${isCollapsed ? "bi-chevron-right" : "bi-chevron-down"} fs-6`}></i>
            </button>
          )}

          <div
            className="d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: isActive ? "rgba(56, 189, 248, 0.2)" : "rgba(255, 255, 255, 0.08)",
              color: isActive ? "#38bdf8" : "#cbd5e1",
              border: `1px solid ${isActive ? "rgba(56, 189, 248, 0.4)" : "rgba(255, 255, 255, 0.1)"}`,
              fontSize: "0.85rem",
            }}
          >
            {index + 1}
          </div>

          {isCompulsory && (
            <span
              className="badge px-2 py-0.5"
              style={{
                background: "rgba(56, 189, 248, 0.15)",
                color: "#38bdf8",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                fontSize: "0.68rem",
                fontWeight: 600,
              }}
            >
              Compulsory
            </span>
          )}

          {isCollapsed ? (
            <div
              className="fw-semibold text-white text-truncate cursor-pointer flex-grow-1"
              style={{ fontSize: "0.95rem" }}
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleCollapse) onToggleCollapse();
              }}
            >
              {question.question || <span className="text-secondary italic">Untitled Question</span>}
              {(question.required || isCompulsory) && <span className="text-danger ms-1">*</span>}
            </div>
          ) : (
            <input
              type="text"
              className="question-input-title flex-grow-1"
              placeholder="Enter Question Title (e.g., Select your track / What is your GitHub?)"
              value={question.question}
              onChange={handleTitleChange}
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "#ffffff",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid rgba(56, 189, 248, 0.3)",
                borderRadius: "0",
                padding: "4px 6px",
                outline: "none",
              }}
            />
          )}
        </div>

        {/* Right: Controlled Type Dropdown & Quick Actions */}
        <div className="d-flex align-items-center gap-2">
          {/* Controlled Type Selector Dropdown */}
          <div className="position-relative" ref={typeMenuRef}>
            <button
              type="button"
              className="btn btn-sm d-flex align-items-center rounded-2"
              disabled={isCompulsory}
              style={{
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#f8fafc",
                fontSize: "0.82rem",
                padding: "5px 10px",
                gap: "8px",
                opacity: isCompulsory ? 0.75 : 1,
                cursor: isCompulsory ? "not-allowed" : "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!isCompulsory) {
                  setIsTypeMenuOpen((prev) => !prev);
                }
              }}
              title={isCompulsory ? "Type is locked for compulsory fields" : undefined}
            >
              <i className={`bi ${currentTypeInfo.icon} me-1.5`} style={{ color: currentTypeInfo.badgeColor }}></i>
              <span>{currentTypeInfo.label}</span>
              {!isCompulsory && (
                <i className={`bi ${isTypeMenuOpen ? "bi-chevron-up" : "bi-chevron-down"} small opacity-50 ms-1.5`}></i>
              )}
            </button>

            {isTypeMenuOpen && (
              <div
                className="dropdown-menu dropdown-menu-dark show shadow-lg border border-secondary border-opacity-25 py-1.5 position-absolute"
                style={{
                  top: "calc(100% + 4px)",
                  right: 0,
                  zIndex: 1100,
                  minWidth: "175px",
                  background: "#0f172a",
                  borderRadius: "8px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
                }}
              >
                {QUESTION_TYPE_LABELS.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    className={`dropdown-item d-flex align-items-center py-1.5 px-3 ${question.type === item.type ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTypeChange(item.type);
                    }}
                    style={{ fontSize: "0.82rem", cursor: "pointer", gap: "8px" }}
                  >
                    <i className={`bi ${item.icon} me-2`} style={{ color: item.badgeColor, width: "18px" }}></i>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Header Action Buttons */}
          <div className="d-flex align-items-center gap-1 border-start border-secondary border-opacity-25 ps-2">
            <button
              type="button"
              className="btn btn-sm btn-icon text-secondary p-1"
              disabled={index === 0}
              title="Move Up"
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              style={{ width: "28px", height: "28px" }}
            >
              <i className="bi bi-arrow-up"></i>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-icon text-secondary p-1"
              disabled={index === totalQuestions - 1}
              title="Move Down"
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              style={{ width: "28px", height: "28px" }}
            >
              <i className="bi bi-arrow-down"></i>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-icon text-secondary p-1"
              title="Duplicate Question"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              style={{ width: "28px", height: "28px" }}
            >
              <i className="bi bi-copy"></i>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-icon text-danger p-1"
              disabled={isCompulsory}
              title={isCompulsory ? "Compulsory question cannot be deleted" : "Delete Question"}
              onClick={(e) => {
                e.stopPropagation();
                if (!isCompulsory) {
                  onDelete();
                }
              }}
              style={{
                width: "28px",
                height: "28px",
                opacity: isCompulsory ? 0.25 : 1,
                cursor: isCompulsory ? "not-allowed" : "pointer",
              }}
            >
              <i className="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Body Content */}
      {!isCollapsed && (
        <div className="mt-3 pt-2 border-top border-secondary border-opacity-15">
          {/* Description / Helper text */}
          <div className="mb-3">
            <div className="input-group input-group-sm">
              <span className="admin-input-group-text py-1 px-2 text-secondary" style={{ fontSize: "0.75rem" }}>
                <i className="bi bi-info-circle me-1"></i> Help text
              </span>
              <input
                type="text"
                className="form-control form-control-glass form-control-sm text-secondary"
                placeholder="Description or helper text for participants (optional)"
                value={question.description || ""}
                onChange={handleDescriptionChange}
                style={{ fontSize: "0.82rem" }}
              />
            </div>
          </div>

          {/* Dynamic Question Type Configuration */}
          <div className="question-body mb-3">
            {/* Short Answer (Text) */}
            {question.type === "text" && (
              <div className="row g-2">
                <div className="col-12 col-md-8">
                  <label className="admin-form-label mb-1" style={{ fontSize: "0.75rem" }}>
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-glass form-control-sm"
                    placeholder={question.placeholder || "e.g. Enter your GitHub profile URL"}
                    value={question.placeholder || ""}
                    onChange={handlePlaceholderChange}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="admin-form-label mb-1" style={{ fontSize: "0.75rem" }}>
                    Max Characters (Optional)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    className="form-control form-control-glass form-control-sm"
                    placeholder="e.g. 100"
                    value={question.maxLength || ""}
                    onChange={(e) =>
                      onChange({
                        ...question,
                        maxLength: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>
            )}

            {/* Paragraph (Textarea) */}
            {question.type === "textarea" && (
              <div className="row g-2">
                <div className="col-12 col-md-8">
                  <label className="admin-form-label mb-1" style={{ fontSize: "0.75rem" }}>
                    Placeholder Text
                  </label>
                  <textarea
                    className="form-control form-control-glass form-control-sm"
                    rows={2}
                    placeholder={question.placeholder || "e.g. Describe your prior project experience..."}
                    value={question.placeholder || ""}
                    onChange={(e) => onChange({ ...question, placeholder: e.target.value })}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="admin-form-label mb-1" style={{ fontSize: "0.75rem" }}>
                    Max Characters (Optional)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={2000}
                    className="form-control form-control-glass form-control-sm"
                    placeholder="e.g. 500"
                    value={question.maxLength || ""}
                    onChange={(e) =>
                      onChange({
                        ...question,
                        maxLength: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>
            )}

            {/* Option Based: Multiple Choice / Checkbox / Dropdown */}
            {["multiple-choice", "checkbox", "dropdown"].includes(question.type) && (
              <div className="options-container">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <label className="admin-form-label mb-0" style={{ fontSize: "0.75rem" }}>
                    Options ({question.options?.length || 0})
                  </label>
                  <span className="text-secondary" style={{ fontSize: "0.72rem" }}>
                    {question.type === "checkbox" ? "Multi-select" : "Single-select"}
                  </span>
                </div>

                <div className="d-flex flex-column gap-2">
                  {(question.options || []).map((opt, optIdx) => (
                    <div key={opt.id} className="d-flex align-items-center gap-2">
                      <span
                        className="d-flex align-items-center justify-content-center text-secondary fw-semibold"
                        style={{ width: "24px", fontSize: "0.78rem" }}
                      >
                        {question.type === "multiple-choice" && <i className="bi bi-circle text-success opacity-75"></i>}
                        {question.type === "checkbox" && <i className="bi bi-square text-warning opacity-75"></i>}
                        {question.type === "dropdown" && <span>{optIdx + 1}.</span>}
                      </span>

                      <input
                        type="text"
                        className="form-control form-control-glass form-control-sm flex-grow-1"
                        value={opt.label}
                        onChange={(e) => handleOptionLabelChange(opt.id, e.target.value)}
                        placeholder={`Option ${optIdx + 1}`}
                        style={{ fontSize: "0.85rem" }}
                      />

                      {(question.options || []).length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-icon text-secondary p-1"
                          title="Remove option"
                          onClick={() => handleDeleteOption(opt.id)}
                          style={{ width: "28px", height: "28px" }}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Option Action Controls */}
                <div className="d-flex align-items-center gap-2 flex-wrap mt-2.5 pt-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary d-inline-flex align-items-center py-1 px-2.5 rounded-2"
                    style={{ fontSize: "0.78rem", gap: "6px" }}
                    onClick={handleAddOption}
                  >
                    <i className="bi bi-plus-circle me-1.5"></i> Add Option
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center py-1 px-2.5 rounded-2"
                    style={{ fontSize: "0.78rem", gap: "6px" }}
                    onClick={handleAddOtherOption}
                  >
                    <i className="bi bi-plus-square me-1.5"></i> Add &quot;Other&quot;
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-info d-inline-flex align-items-center py-1 px-2.5 rounded-2"
                    style={{ fontSize: "0.78rem", gap: "6px" }}
                    onClick={() => setShowBulkAdd(!showBulkAdd)}
                  >
                    <i className="bi bi-list-nested me-1.5"></i> {showBulkAdd ? "Close Bulk Add" : "Bulk Paste Options"}
                  </button>
                </div>

                {/* Bulk Add Drawer */}
                {showBulkAdd && (
                  <div
                    className="p-3 mt-2 rounded-3"
                    style={{
                      background: "rgba(15, 23, 42, 0.9)",
                      border: "1px dashed rgba(56, 189, 248, 0.35)",
                    }}
                  >
                    <label className="admin-form-label mb-1 text-info" style={{ fontSize: "0.78rem" }}>
                      Paste Multiple Options (one per line):
                    </label>
                    <textarea
                      className="form-control form-control-glass form-control-sm mb-2"
                      rows={3}
                      placeholder="Option A&#10;Option B&#10;Option C"
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      style={{ fontSize: "0.82rem" }}
                    />
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-0.5 px-2"
                        style={{ fontSize: "0.75rem" }}
                        onClick={() => {
                          setBulkText("");
                          setShowBulkAdd(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary py-0.5 px-3"
                        style={{ fontSize: "0.75rem" }}
                        onClick={handleBulkAddOptions}
                      >
                        Add Pasted Options
                      </button>
                    </div>
                  </div>
                )}

                {/* Checkbox-specific: Min / Max selection limits */}
                {question.type === "checkbox" && (
                  <div className="row g-2 mt-2 pt-2 border-top border-secondary border-opacity-15">
                    <div className="col-6 col-md-3">
                      <label className="admin-form-label mb-1" style={{ fontSize: "0.72rem" }}>
                        Min Selections
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={question.options?.length || 10}
                        className="form-control form-control-glass form-control-sm"
                        placeholder="0"
                        value={question.minSelections || ""}
                        onChange={(e) =>
                          onChange({
                            ...question,
                            minSelections: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                      />
                    </div>
                    <div className="col-6 col-md-3">
                      <label className="admin-form-label mb-1" style={{ fontSize: "0.72rem" }}>
                        Max Selections
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={question.options?.length || 10}
                        className="form-control form-control-glass form-control-sm"
                        placeholder={String(question.options?.length || "")}
                        value={question.maxSelections || ""}
                        onChange={(e) =>
                          onChange({
                            ...question,
                            maxSelections: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Yes / No */}
            {question.type === "yes-no" && (
              <div
                className="d-flex align-items-center gap-3 p-3 rounded-3"
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <span className="text-secondary small fw-medium">Participant Choice Options:</span>
                <span
                  className="badge px-3 py-1.5 rounded-pill"
                  style={{
                    background: "rgba(34, 197, 94, 0.15)",
                    color: "#4ade80",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    fontSize: "0.8rem",
                  }}
                >
                  <i className="bi bi-check-circle me-1"></i> Yes
                </span>
                <span
                  className="badge px-3 py-1.5 rounded-pill"
                  style={{
                    background: "rgba(239, 68, 68, 0.15)",
                    color: "#f87171",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    fontSize: "0.8rem",
                  }}
                >
                  <i className="bi bi-x-circle me-1"></i> No
                </span>
              </div>
            )}

            {/* File Upload */}
            {question.type === "file" && (
              <div
                className="p-3 rounded-3"
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px dashed rgba(56, 189, 248, 0.3)",
                }}
              >
                <div className="row g-3 align-items-center">
                  {/* Allowed Formats Chips */}
                  <div className="col-12 col-md-6">
                    <label className="admin-form-label mb-1.5 d-block" style={{ fontSize: "0.75rem" }}>
                      Allowed File Types
                    </label>
                    <div className="d-flex gap-1.5 flex-wrap">
                      {AVAILABLE_FILE_FORMATS.map((fmt) => {
                        const isSelected = (
                          question.allowedFormats || ["pdf", "jpg", "png", "docx"]
                        ).includes(fmt);
                        return (
                          <button
                            key={fmt}
                            type="button"
                            className="btn btn-sm py-0.5 px-2 rounded-2 text-uppercase fw-semibold"
                            style={{
                              fontSize: "0.72rem",
                              background: isSelected
                                ? "rgba(56, 189, 248, 0.2)"
                                : "rgba(255, 255, 255, 0.05)",
                              color: isSelected ? "#38bdf8" : "#94a3b8",
                              border: `1px solid ${isSelected ? "rgba(56, 189, 248, 0.45)" : "rgba(255, 255, 255, 0.1)"}`,
                              cursor: "pointer",
                            }}
                            onClick={() => handleToggleFormat(fmt)}
                          >
                            {isSelected && <i className="bi bi-check me-0.5"></i>}
                            {fmt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Max File Size */}
                  <div className="col-6 col-md-3">
                    <label className="admin-form-label mb-1" style={{ fontSize: "0.75rem" }}>
                      Max File Size
                    </label>
                    <select
                      className="form-select form-control-glass form-control-sm"
                      value={question.maxFileSize || 5}
                      onChange={(e) =>
                        onChange({ ...question, maxFileSize: Number(e.target.value) })
                      }
                      style={{ fontSize: "0.82rem" }}
                    >
                      <option value={2} style={{ background: "#0f172a" }}>2 MB</option>
                      <option value={5} style={{ background: "#0f172a" }}>5 MB</option>
                      <option value={10} style={{ background: "#0f172a" }}>10 MB</option>
                      <option value={25} style={{ background: "#0f172a" }}>25 MB</option>
                    </select>
                  </div>

                  {/* Max Files Count */}
                  <div className="col-6 col-md-3">
                    <label className="admin-form-label mb-1" style={{ fontSize: "0.75rem" }}>
                      Max Files
                    </label>
                    <select
                      className="form-select form-control-glass form-control-sm"
                      value={question.maxFiles || 1}
                      onChange={(e) =>
                        onChange({ ...question, maxFiles: Number(e.target.value) })
                      }
                      style={{ fontSize: "0.82rem" }}
                    >
                      <option value={1} style={{ background: "#0f172a" }}>1 File</option>
                      <option value={2} style={{ background: "#0f172a" }}>2 Files</option>
                      <option value={3} style={{ background: "#0f172a" }}>3 Files</option>
                      <option value={5} style={{ background: "#0f172a" }}>5 Files</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Date / Time */}
            {(question.type === "date" || question.type === "time") && (
              <div
                className="p-3 rounded-3 text-secondary small d-flex align-items-center gap-2"
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <i
                  className={`bi ${question.type === "date" ? "bi-calendar-event" : "bi-clock"} fs-5`}
                  style={{ color: question.type === "date" ? "#34d399" : "#fb923c" }}
                ></i>
                <div>
                  <div className="text-white fw-semibold">
                    {question.type === "date" ? "Date Picker Field" : "Time Picker Field"}
                  </div>
                  <div className="text-secondary" style={{ fontSize: "0.76rem" }}>
                    Participant will select a {question.type === "date" ? "valid calendar date" : "time value (HH:MM AM/PM)"}.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer of Card */}
          <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-15">
            <div className="text-secondary small d-none d-sm-block" style={{ fontSize: "0.75rem" }}>
              <span className="opacity-75">Configuring: </span>
              <span className="text-white fw-medium">{currentTypeInfo.label}</span>
            </div>

            {/* Required Switch */}
            <div className="form-check form-switch d-flex align-items-center gap-2 ms-auto">
              <input
                className="form-check-input"
                type="checkbox"
                id={`req_toggle_${question.id}`}
                checked={isCompulsory ? true : question.required}
                disabled={isCompulsory}
                onChange={handleRequiredToggle}
                style={{
                  cursor: isCompulsory ? "not-allowed" : "pointer",
                  width: "32px",
                  height: "18px",
                  opacity: isCompulsory ? 0.75 : 1,
                }}
              />
              <label
                className="form-check-label text-white small user-select-none fw-medium"
                htmlFor={`req_toggle_${question.id}`}
                style={{ cursor: isCompulsory ? "not-allowed" : "pointer", fontSize: "0.82rem" }}
              >
                {isCompulsory ? "Required (Compulsory)" : "Required Question"}
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
