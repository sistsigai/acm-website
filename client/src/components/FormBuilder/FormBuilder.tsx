import React, { useState } from "react";
import { type IQuestion, type QuestionType, ACM_STANDARD_STUDENT_QUESTIONS } from "../../types/formBuilder";
import QuestionCard from "./QuestionCard";
import FormPreviewModal from "./FormPreviewModal";
import "./formBuilder.css";

interface FormBuilderProps {
  questions: IQuestion[];
  onChange: (questions: IQuestion[]) => void;
  formTitle?: string;
  formDescription?: string;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  questions,
  onChange,
  formTitle = "Event Registration Form",
  formDescription,
}) => {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    questions[0]?.id || null
  );
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  /* ---------------- QUESTION CRUD ---------------- */
  const handleAddQuestion = (type: QuestionType = "text") => {
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
    }

    const updated = [...questions, newQuestion];
    onChange(updated);
    setActiveQuestionId(newId);
  };

  const handleUpdateQuestion = (index: number, updatedQuestion: IQuestion) => {
    const updated = [...questions];
    updated[index] = updatedQuestion;
    onChange(updated);
  };

  const handleDuplicateQuestion = (index: number) => {
    const target = questions[index];
    const duplicated: IQuestion = {
      ...target,
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      question: target.question ? `${target.question} (Copy)` : "",
      options: target.options ? target.options.map(o => ({ ...o, id: `opt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` })) : undefined,
    };

    const updated = [...questions];
    updated.splice(index + 1, 0, duplicated);
    onChange(updated);
    setActiveQuestionId(duplicated.id);
  };

  const handleDeleteQuestion = (index: number) => {
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

  const handleImportPresets = () => {
    const existingIds = new Set(questions.map((q) => q.question.toLowerCase().trim()));
    const newPresets = ACM_STANDARD_STUDENT_QUESTIONS.filter(
      (preset) => !existingIds.has(preset.question.toLowerCase().trim())
    ).map((preset) => ({
      ...preset,
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    }));

    onChange([...questions, ...newPresets]);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to remove all questions?")) {
      onChange([]);
      setActiveQuestionId(null);
    }
  };

  return (
    <div className="form-builder-container">
      {/* Sticky Top Action Bar */}
      <div className="form-builder-toolbar">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-indigo-500 text-white px-3 py-2" style={{ background: "#6366f1" }}>
            <i className="bi bi-ui-checks-grid me-1"></i> {questions.length} Questions
          </span>
          <span className="text-secondary small d-none d-md-inline">
            Build custom Google Form-style questionnaire
          </span>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          {/* Preset Importer */}
          <button
            type="button"
            className="btn btn-sm btn-outline-info d-inline-flex align-items-center gap-1"
            onClick={handleImportPresets}
            title="Import Full Name, Reg No, Dept, Year, Section, Email, Phone"
          >
            <i className="bi bi-person-badge"></i> Import ACM Profile
          </button>

          {/* Add Question Button */}
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1 px-3"
              style={{ background: "#6366f1", borderColor: "#6366f1" }}
              onClick={() => handleAddQuestion("text")}
            >
              <i className="bi bi-plus-lg"></i> Add Question
            </button>
            <button
              type="button"
              className="btn btn-sm btn-primary dropdown-toggle dropdown-toggle-split"
              style={{ background: "#4f46e5", borderColor: "#4f46e5" }}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow">
              <li>
                <button
                  type="button"
                  className="dropdown-item d-flex align-items-center gap-2"
                  onClick={() => handleAddQuestion("text")}
                >
                  <i className="bi bi-card-text text-primary"></i> Short Answer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item d-flex align-items-center gap-2"
                  onClick={() => handleAddQuestion("textarea")}
                >
                  <i className="bi bi-text-paragraph text-info"></i> Paragraph
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item d-flex align-items-center gap-2"
                  onClick={() => handleAddQuestion("multiple-choice")}
                >
                  <i className="bi bi-ui-radios text-success"></i> Multiple Choice
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item d-flex align-items-center gap-2"
                  onClick={() => handleAddQuestion("checkbox")}
                >
                  <i className="bi bi-ui-checks text-warning"></i> Checkboxes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item d-flex align-items-center gap-2"
                  onClick={() => handleAddQuestion("dropdown")}
                >
                  <i className="bi bi-caret-down-square text-secondary"></i> Dropdown
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item d-flex align-items-center gap-2"
                  onClick={() => handleAddQuestion("yes-no")}
                >
                  <i className="bi bi-toggles text-danger"></i> Yes / No
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item d-flex align-items-center gap-2"
                  onClick={() => handleAddQuestion("file")}
                >
                  <i className="bi bi-file-earmark-arrow-up text-primary"></i> File Upload
                </button>
              </li>
            </ul>
          </div>

          {/* Live Preview Button */}
          <button
            type="button"
            className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1"
            onClick={() => setShowPreviewModal(true)}
          >
            <i className="bi bi-eye"></i> Preview
          </button>

          {/* Clear All */}
          {questions.length > 0 && (
            <button
              type="button"
              className="btn btn-sm btn-outline-danger d-inline-flex align-items-center"
              onClick={handleClearAll}
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
          className="text-center py-5 rounded-4"
          style={{
            background: "rgba(17, 24, 39, 0.5)",
            border: "2px dashed rgba(255, 255, 255, 0.15)",
          }}
        >
          <div className="display-4 text-secondary mb-3">
            <i className="bi bi-journal-plus text-indigo-400" style={{ color: "#818cf8" }}></i>
          </div>
          <h5 className="fw-bold text-white mb-2">No Questions Added Yet</h5>
          <p className="text-secondary mb-4 small max-w-md mx-auto">
            Click "+ Add Question" to start building your custom form or click "Import ACM Profile" to quickly populate standard student fields.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button
              type="button"
              className="btn btn-primary px-4 py-2"
              style={{ background: "#6366f1", borderColor: "#6366f1" }}
              onClick={() => handleAddQuestion("text")}
            >
              <i className="bi bi-plus-lg me-1"></i> Add First Question
            </button>
            <button
              type="button"
              className="btn btn-outline-info px-4 py-2"
              onClick={handleImportPresets}
            >
              <i className="bi bi-person-badge me-1"></i> Import Standard ACM Profile
            </button>
          </div>
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
    </div>
  );
};

export default FormBuilder;
