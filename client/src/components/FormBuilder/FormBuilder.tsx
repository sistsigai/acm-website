import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import type { IQuestion, QuestionType } from "../../types/formBuilder";
import { DEFAULT_INITIAL_EVENT_QUESTIONS, isCompulsoryQuestion } from "../../types/formBuilder";
import QuestionCard from "./QuestionCard";
import FormPreviewModal from "./FormPreviewModal";

interface FormBuilderProps {
  questions: IQuestion[];
  onChange: (questions: IQuestion[]) => void;
  formTitle?: string;
  formDescription?: string;
}

const QUESTION_TYPES_CONFIG: { type: QuestionType; label: string; icon: string; color: string }[] = [
  { type: "text", label: "Short Answer", icon: "bi-card-text", color: "#38bdf8" },
  { type: "textarea", label: "Paragraph", icon: "bi-text-paragraph", color: "#818cf8" },
  { type: "multiple-choice", label: "Multiple Choice", icon: "bi-ui-radios", color: "#4ade80" },
  { type: "checkbox", label: "Checkboxes", icon: "bi-ui-checks", color: "#fbbf24" },
  { type: "dropdown", label: "Dropdown", icon: "bi-caret-down-square", color: "#a78bfa" },
  { type: "yes-no", label: "Yes / No", icon: "bi-toggles", color: "#f472b6" },
  { type: "file", label: "File Upload", icon: "bi-file-earmark-arrow-up", color: "#38bdf8" },
  { type: "date", label: "Date", icon: "bi-calendar-event", color: "#34d399" },
  { type: "time", label: "Time", icon: "bi-clock", color: "#fb923c" },
];

const FormBuilder: React.FC<FormBuilderProps> = ({
  questions,
  onChange,
  formTitle = "Event Registration Form",
  formDescription,
}) => {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    questions[0]?.id || null
  );
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const addMenuRef = useRef<HTMLDivElement>(null);

  // Click-outside listener for + Add Question dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setIsAddMenuOpen(false);
      }
    };
    if (isAddMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAddMenuOpen]);

  /* ---------------- COLLAPSE HANDLERS ---------------- */
  const toggleCollapse = (id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCollapseAll = () => {
    if (collapsedIds.size === questions.length) {
      setCollapsedIds(new Set()); // Expand all
    } else {
      setCollapsedIds(new Set(questions.map((q) => q.id))); // Collapse all
    }
  };

  /* ---------------- QUESTION CRUD ---------------- */
  const handleAddQuestion = (type: QuestionType = "text") => {
    setIsAddMenuOpen(false);
    const newId = `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newQuestion: IQuestion = {
      id: newId,
      type,
      question: "",
      required: false,
      placeholder: "",
    };

    if (["multiple-choice", "checkbox", "dropdown"].includes(type)) {
      newQuestion.options = [
        { id: `opt_${Date.now()}_1`, label: "Option 1" },
        { id: `opt_${Date.now()}_2`, label: "Option 2" },
      ];
    } else if (type === "yes-no") {
      newQuestion.options = [
        { id: "opt_yes", label: "Yes" },
        { id: "opt_no", label: "No" },
      ];
    } else if (type === "file") {
      newQuestion.allowedFormats = ["pdf", "jpg", "png", "docx"];
      newQuestion.maxFileSize = 5;
      newQuestion.maxFiles = 1;
    }

    const updated = [...questions, newQuestion];
    onChange(updated);
    setActiveQuestionId(newId);
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      next.delete(newId); // Keep new question expanded
      return next;
    });
  };

  const handleUpdateQuestion = (index: number, updatedQuestion: IQuestion) => {
    const updated = [...questions];
    if (isCompulsoryQuestion(updatedQuestion)) {
      updated[index] = { ...updatedQuestion, required: true, isCompulsory: true };
    } else {
      updated[index] = updatedQuestion;
    }
    onChange(updated);
  };

  const handleDuplicateQuestion = (index: number) => {
    const target = questions[index];
    const duplicated: IQuestion = {
      ...target,
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      question: target.question ? `${target.question} (Copy)` : "",
      isCompulsory: false, // Duplicated copies are not compulsory
      options: target.options
        ? target.options.map((o) => ({
            ...o,
            id: `opt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          }))
        : undefined,
    };

    const updated = [...questions];
    updated.splice(index + 1, 0, duplicated);
    onChange(updated);
    setActiveQuestionId(duplicated.id);
  };

  const handleDeleteQuestion = (index: number) => {
    const target = questions[index];
    if (target && isCompulsoryQuestion(target)) return;
    const updated = questions.filter((_, i) => i !== index);
    onChange(updated);
    if (activeQuestionId === questions[index]?.id) {
      setActiveQuestionId(updated[0]?.id || null);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...questions];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    onChange(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === questions.length - 1) return;
    const updated = [...questions];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    onChange(updated);
  };

  const handleConfirmClearAll = () => {
    onChange(DEFAULT_INITIAL_EVENT_QUESTIONS);
    setActiveQuestionId(DEFAULT_INITIAL_EVENT_QUESTIONS[0]?.id || null);
    setCollapsedIds(new Set());
    setShowClearConfirmModal(false);
  };

  const allCollapsed =
    questions.length > 0 && collapsedIds.size === questions.length;

  return (
    <div className="form-builder-container">
      {/* Sticky Floating Action Toolbar */}
      <div
        className="d-flex align-items-center justify-content-between p-2.5 mb-3 rounded-3 flex-wrap gap-2"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(8, 12, 22, 0.94)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(56, 189, 248, 0.25)",
          boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.8), 0 0 15px rgba(56, 189, 248, 0.1)",
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <span
            className="badge px-3 py-2 rounded-2 fw-semibold d-inline-flex align-items-center"
            style={{
              background: "rgba(56, 189, 248, 0.12)",
              color: "#38bdf8",
              border: "1px solid rgba(56, 189, 248, 0.28)",
              fontSize: "0.82rem",
              gap: "8px",
            }}
          >
            <i className="bi bi-ui-checks-grid me-2"></i>
            <span>
              {questions.length} Question{questions.length === 1 ? "" : "s"}
            </span>
          </span>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          {/* + Add Question Dropdown (Controlled via React State & Click-Outside) */}
          <div className="position-relative" ref={addMenuRef}>
            <button
              type="button"
              className="btn btn-sm btn-primary d-inline-flex align-items-center px-3 py-1.5 rounded-2 fw-semibold"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                border: "none",
                fontSize: "0.82rem",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                gap: "8px",
              }}
              onClick={() => setIsAddMenuOpen((prev) => !prev)}
            >
              <i className="bi bi-plus-lg me-1"></i>
              <span>Add Question</span>
              <i className={`bi ${isAddMenuOpen ? "bi-chevron-up" : "bi-chevron-down"} small opacity-75 ms-1`}></i>
            </button>

            {isAddMenuOpen && (
              <div
                className="dropdown-menu dropdown-menu-dark show shadow-lg border border-secondary border-opacity-25 py-2 position-absolute"
                style={{
                  top: "calc(100% + 6px)",
                  right: 0,
                  zIndex: 1200,
                  minWidth: "210px",
                  background: "#0f172a",
                  borderRadius: "10px",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.85), 0 0 20px rgba(56, 189, 248, 0.2)",
                }}
              >
                <div className="px-3 py-1 text-uppercase text-secondary fw-bold" style={{ fontSize: "0.68rem", letterSpacing: "0.5px" }}>
                  Select Field Type
                </div>
                {QUESTION_TYPES_CONFIG.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    className="dropdown-item d-flex align-items-center py-2 px-3 text-white"
                    onClick={() => handleAddQuestion(item.type)}
                    style={{ fontSize: "0.82rem", cursor: "pointer", gap: "10px" }}
                  >
                    <i className={`bi ${item.icon} me-2`} style={{ color: item.color, width: "18px" }}></i>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Collapse All Toggle */}
          {questions.length > 0 && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center py-1.5 px-2.5 rounded-2"
              style={{ fontSize: "0.82rem", gap: "6px" }}
              onClick={handleCollapseAll}
              title={allCollapsed ? "Expand all questions" : "Collapse all questions"}
            >
              <i className={`bi ${allCollapsed ? "bi-arrows-expand" : "bi-arrows-collapse"} me-1`}></i>
              <span className="d-none d-sm-inline">{allCollapsed ? "Expand All" : "Collapse All"}</span>
            </button>
          )}

          {/* Live Preview Button */}
          <button
            type="button"
            className="btn btn-sm btn-outline-light d-inline-flex align-items-center py-1.5 px-2.5 rounded-2"
            style={{ fontSize: "0.82rem", gap: "6px" }}
            onClick={() => setShowPreviewModal(true)}
          >
            <i className="bi bi-eye me-1"></i>
            <span className="d-none d-sm-inline">Preview</span>
          </button>

          {/* Clear All */}
          {questions.length > 0 && (
            <button
              type="button"
              className="btn btn-sm btn-outline-danger d-inline-flex align-items-center py-1.5 px-2.5 rounded-2"
              onClick={() => setShowClearConfirmModal(true)}
              title="Clear all questions"
            >
              <i className="bi bi-trash"></i>
            </button>
          )}
        </div>
      </div>

      {/* Questions Canvas */}
      {questions.length === 0 ? (
        <div
          className="text-center py-5 px-3 rounded-3 d-flex flex-column align-items-center justify-content-center"
          style={{
            background: "rgba(15, 23, 42, 0.45)",
            border: "2px dashed rgba(56, 189, 248, 0.25)",
            minHeight: "240px",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-center mb-3"
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "rgba(56, 189, 248, 0.1)",
              color: "#38bdf8",
              border: "1px solid rgba(56, 189, 248, 0.25)",
            }}
          >
            <i className="bi bi-ui-checks-grid fs-4"></i>
          </div>

          <h5 className="fw-bold text-white mb-1" style={{ fontSize: "1rem" }}>
            No Questions Added
          </h5>
          <p className="text-secondary mb-4 small" style={{ maxWidth: "440px", lineHeight: 1.5 }}>
            Click &quot;+ Add Question&quot; above to create registration questions for attendees.
          </p>

          <button
            type="button"
            className="btn btn-primary px-3 py-1.5 d-inline-flex align-items-center rounded-2"
            style={{ background: "#2563eb", borderColor: "#2563eb", fontSize: "0.85rem", gap: "8px" }}
            onClick={() => handleAddQuestion("text")}
          >
            <i className="bi bi-plus-lg me-1.5"></i> Add First Question
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
              totalQuestions={questions.length}
              isActive={activeQuestionId === q.id}
              isCollapsed={collapsedIds.has(q.id)}
              onToggleCollapse={() => toggleCollapse(q.id)}
              onSelect={() => setActiveQuestionId(q.id)}
              onChange={(updated) => handleUpdateQuestion(idx, updated)}
              onDuplicate={() => handleDuplicateQuestion(idx)}
              onDelete={() => handleDeleteQuestion(idx)}
              onMoveUp={() => handleMoveUp(idx)}
              onMoveDown={() => handleMoveDown(idx)}
            />
          ))}
        </div>
      )}

      {/* Live Form Preview Modal */}
      <FormPreviewModal
        title={formTitle}
        description={formDescription}
        questions={questions}
        show={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />

      {/* Root Portal Styled Glassmorphic Clear All Confirmation Modal */}
      {showClearConfirmModal &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(3, 7, 18, 0.85)",
              backdropFilter: "blur(12px)",
            }}
            onClick={() => setShowClearConfirmModal(false)}
          >
            <div
              className="text-center text-white"
              style={{
                maxWidth: "420px",
                width: "90%",
                background: "linear-gradient(165deg, #1e293b 0%, #0f172a 100%)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                boxShadow: "0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(239, 68, 68, 0.2)",
                borderRadius: "16px",
                padding: "28px 24px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: "56px",
                  height: "56px",
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "#ef4444",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                }}
              >
                <i className="bi bi-trash3-fill fs-3"></i>
              </div>
              <h5 className="fw-bold mb-2 text-white">Reset Questions?</h5>
              <p className="text-secondary mb-4 small" style={{ lineHeight: 1.5 }}>
                Are you sure you want to reset all custom questions? The 3 compulsory questions (<strong>Full Name</strong>, <strong>Register Number</strong>, and <strong>Email ID</strong>) will remain preserved as default.
              </p>

              <div className="d-flex gap-2 justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-2 px-3 py-1.5"
                  style={{ fontSize: "0.85rem" }}
                  onClick={() => setShowClearConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger rounded-2 px-3.5 py-1.5 fw-semibold d-inline-flex align-items-center"
                  style={{
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                    border: "none",
                    fontSize: "0.85rem",
                    gap: "8px",
                  }}
                  onClick={handleConfirmClearAll}
                >
                  <i className="bi bi-arrow-counterclockwise me-1.5"></i>
                  Reset to Default
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default FormBuilder;
