import React from "react";
import { useNavigate } from "react-router-dom";

export interface QuestionOption {
  id: string;
  label: string;
}

export interface QuestionBase {
  id: string;
  type:
    | "text"
    | "textarea"
    | "multiple-choice"
    | "checkbox"
    | "dropdown"
    | "yes-no"
    | "file";
  question: string;
  required: boolean;
  description?: string;
}

export interface TextQuestion extends QuestionBase {
  type: "text" | "textarea";
  placeholder?: string;
  maxLength?: number;
  options?: never;
  allowedFormats?: never;
  maxFileSize?: never;
  maxFiles?: never;
}

export interface OptionBasedQuestion extends QuestionBase {
  type: "multiple-choice" | "checkbox" | "dropdown" | "yes-no";
  options: QuestionOption[];
  placeholder?: never;
  maxLength?: never;
  allowedFormats?: never;
  maxFileSize?: never;
  maxFiles?: never;
}

export interface CheckboxQuestion extends OptionBasedQuestion {
  type: "checkbox";
  minSelections?: number;
  maxSelections?: number;
}

export interface MultipleChoiceQuestion extends OptionBasedQuestion {
  type: "multiple-choice";
  minSelections?: never;
  maxSelections?: never;
}

export interface DropdownQuestion extends OptionBasedQuestion {
  type: "dropdown";
  minSelections?: never;
  maxSelections?: never;
}

export interface YesNoQuestion extends OptionBasedQuestion {
  type: "yes-no";
  minSelections?: never;
  maxSelections?: never;
}

export interface FileQuestion extends QuestionBase {
  type: "file";
  placeholder?: never;
  maxLength?: never;
  options?: never;
  allowedFormats?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  minSelections?: never;
  maxSelections?: never;
}

export type Question =
  | TextQuestion
  | CheckboxQuestion
  | MultipleChoiceQuestion
  | DropdownQuestion
  | YesNoQuestion
  | FileQuestion;

export interface Recruitment {
  _id: string;
  title: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  isOpen: boolean;
  applicantsCount: number;
  questions?: Question[];
}

interface RecruitmentCardProps {
  recruitment: Recruitment;
  index: number;
  onToggleStatus: (id: string, current: boolean) => void;
  onEdit: (recruitment: Recruitment) => void;
  onDelete: (recruitment: Recruitment) => void;
}

export const RecruitmentCard: React.FC<RecruitmentCardProps> = ({
  recruitment: r,
  index,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const formatDisplayDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className="col-12 col-md-6 col-xl-4 animate-card"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="recruitment-card p-4">
        {/* Top Row */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <span
            className={`badge rounded-pill px-3 py-2 d-flex align-items-center gap-2 ${
              r.isOpen
                ? "bg-success bg-opacity-25 border border-success border-opacity-50"
                : "bg-secondary bg-opacity-25 border border-secondary border-opacity-50"
            }`}
            style={{ color: r.isOpen ? "#86efac" : "#d1d5db" }}
          >
            <i
              className={`bi ${
                r.isOpen ? "bi-check-circle-fill" : "bi-lock-fill"
              }`}
            ></i>
            {r.isOpen ? "Open" : "Closed"}
          </span>

          <button
            type="button"
            className="btn btn-sm btn-outline-light rounded-pill px-3 py-1"
            onClick={() => onToggleStatus(r._id, r.isOpen)}
            style={{ fontSize: "0.8rem" }}
          >
            {r.isOpen ? "Close Drive" : "Re-open"}
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow-1">
          <h4
            className="fw-bold text-white mb-2 text-truncate"
            title={r.title}
          >
            {r.title}
          </h4>

          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="badge bg-primary bg-opacity-20 text-primary-subtle border border-primary border-opacity-20">
              <i className="bi bi-briefcase me-1"></i> {r.role}
            </span>
            {r.questions && r.questions.length > 0 && (
              <span className="badge bg-info bg-opacity-20 text-info-subtle border border-info border-opacity-20">
                <i className="bi bi-question-circle me-1"></i>{" "}
                {r.questions.length} Questions
              </span>
            )}
          </div>

          <p
            className="text-secondary small mb-4 line-clamp-3"
            style={{ minHeight: "3em" }}
          >
            {r.description}
          </p>

          <div className="d-flex align-items-center gap-2 text-secondary small bg-dark bg-opacity-50 p-2 rounded-3 border border-secondary border-opacity-20 mb-4">
            <i className="bi bi-calendar-event text-info ms-1"></i>
            <span>{formatDisplayDate(r.startDate)}</span>
            <i
              className="bi bi-arrow-right text-secondary mx-1"
              style={{ fontSize: "0.7rem" }}
            ></i>
            <span>{formatDisplayDate(r.endDate)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-25 mt-auto flex-wrap gap-2">
          {/* Left Side: Applicant Info */}
          <div className="d-flex align-items-center gap-2 text-light">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 32,
                height: 32,
                background: "rgba(59, 130, 246, 0.35)",
                border: "1px solid rgba(59, 130, 246, 0.6)",
              }}
            >
              <i className="bi bi-people-fill text-white small"></i>
            </div>
            <span className="fw-semibold">{r.applicantsCount}</span>
            <span className="text-secondary small">Applicants</span>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-success rounded-pill px-3"
              onClick={() =>
                navigate(`/admin/recruitments/${r._id}/applications`)
              }
            >
              <i className="bi bi-people me-1"></i>
              View Apps
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-info rounded-pill px-3"
              onClick={() => onEdit(r)}
            >
              <i className="bi bi-pencil-square me-1"></i>
              Edit
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-danger rounded-pill px-3"
              onClick={() => onDelete(r)}
            >
              <i className="bi bi-trash me-1"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentCard;
