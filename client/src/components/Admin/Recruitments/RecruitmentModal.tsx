import React, { useState, useEffect, useMemo } from "react";
import FormBuilder from "../../FormBuilder/FormBuilder";
import type { IQuestion } from "../../../types/formBuilder";
import type { Recruitment, Question } from "./RecruitmentCard";

export interface ValidationErrors {
  title?: string;
  role?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  dateRange?: string;
}

interface RecruitmentModalProps {
  show: boolean;
  editingId: string | null;
  form: Omit<Recruitment, "_id" | "applicantsCount">;
  setForm: React.Dispatch<
    React.SetStateAction<Omit<Recruitment, "_id" | "applicantsCount">>
  >;
  isSubmitting: boolean;
  onSave: () => void;
  onClose: () => void;
}

export const RecruitmentModal: React.FC<RecruitmentModalProps> = ({
  show,
  editingId,
  form,
  setForm,
  isSubmitting,
  onSave,
  onClose,
}) => {
  const [recruitmentModalTab, setRecruitmentModalTab] = useState<
    "details" | "form"
  >("details");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Reset tab on open
  useEffect(() => {
    if (show) {
      setRecruitmentModalTab("details");
      setValidationErrors({});
    }
  }, [show]);

  // Validation utilities
  const validateTitle = (title: string): string => {
    if (!title.trim()) return "Title is required";
    if (title.length < 3) return "Title must be at least 3 characters";
    if (title.length > 100) return "Title must be less than 100 characters";
    return "";
  };

  const validateRole = (role: string): string => {
    if (!role.trim()) return "Role is required";
    if (role.length < 2) return "Role must be at least 2 characters";
    if (role.length > 50) return "Role must be less than 50 characters";
    return "";
  };

  const validateDescription = (description: string): string => {
    if (description.length > 500) {
      return "Description must be less than 500 characters";
    }
    return "";
  };

  const validateStartDate = (date: string): string => {
    if (!date) return "Start date is required";
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime())) {
      return "Invalid date format";
    }
    if (selectedDate < today) {
      return "Start date cannot be in the past";
    }
    return "";
  };

  const validateEndDate = (endDate: string, startDate: string): string => {
    if (!endDate) return "End date is required";
    const end = new Date(endDate);
    if (isNaN(end.getTime())) {
      return "Invalid date format";
    }
    if (startDate && end <= new Date(startDate)) {
      return "End date must be after start date";
    }
    return "";
  };

  const validateDateRange = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 2) {
      return "Recruitment must be at least 2 days long";
    }
    return "";
  };

  const validateAllFields = (): ValidationErrors => {
    const errors: ValidationErrors = {};
    errors.title = validateTitle(form.title);
    errors.role = validateRole(form.role);
    errors.description = validateDescription(form.description);
    errors.startDate = validateStartDate(form.startDate);
    errors.endDate = validateEndDate(form.endDate, form.startDate);
    errors.dateRange = validateDateRange(form.startDate, form.endDate);
    return errors;
  };

  const hasValidationErrors = useMemo(() => {
    const errors = validateAllFields();
    return Object.values(errors).some((error) => error !== "");
  }, [form]);

  const getTodayDate = (): string => {
    return new Date().toISOString().split("T")[0];
  };

  const getMinEndDate = (): string => {
    if (!form.startDate) return getTodayDate();
    const startDate = new Date(form.startDate);
    const minEndDate = new Date(startDate);
    minEndDate.setDate(minEndDate.getDate() + 2);
    return minEndDate.toISOString().split("T")[0];
  };

  const handleSaveClick = () => {
    const errors = validateAllFields();
    setValidationErrors(errors);
    if (!Object.values(errors).some((error) => error !== "")) {
      onSave();
    }
  };

  if (!show) return null;

  return (
    <div className="admin-modal-overlay">
      <div
        className="admin-modal-container p-4 m-2"
        style={{ maxWidth: "1050px", width: "100%" }}
      >
        {/* Modal Header */}
        <div
          className="d-flex justify-content-between align-items-center mb-3 pb-3"
          style={{ borderBottom: "1px solid #1e293b" }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: 38,
                height: 38,
                borderRadius: "6px",
                background: "#1e293b",
                border: "1px solid #334155",
              }}
            >
              <i
                className={`bi ${
                  editingId
                    ? "bi-briefcase text-primary"
                    : "bi-plus-circle text-primary"
                } fs-5`}
              ></i>
            </div>
            <div>
              <h5 className="m-0 fw-semibold text-white">
                {editingId ? "Edit Recruitment Drive" : "Create New Drive"}
              </h5>
              <p
                className="text-secondary small mb-0 mt-0"
                style={{ fontSize: "0.8125rem" }}
              >
                Configure recruitment timeline, position role, and application
                questions
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-link text-secondary text-decoration-none p-1"
            style={{ lineHeight: 1 }}
            onClick={onClose}
          >
            <i className="bi bi-x-lg fs-6"></i>
          </button>
        </div>

        {/* Modal Tabs with Sliding Active Segment */}
        <div
          className="position-relative d-flex mb-3 p-1 rounded-2 border overflow-hidden"
          style={{
            background: "#090d16",
            borderColor: "#1e293b",
            minHeight: "42px",
          }}
        >
          <div
            className="position-absolute rounded-2 shadow-sm"
            style={{
              top: "4px",
              bottom: "4px",
              left: "4px",
              width: "calc(50% - 4px)",
              background: "#2563eb",
              transform:
                recruitmentModalTab === "details"
                  ? "translateX(0%)"
                  : "translateX(100%)",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          <button
            type="button"
            className={`btn flex-fill py-1 rounded-2 fw-medium d-flex align-items-center justify-content-center gap-2 border-0 position-relative ${
              recruitmentModalTab === "details" ? "text-white" : "text-secondary"
            }`}
            style={{
              zIndex: 2,
              transition: "color 0.2s ease",
              background: "transparent",
              fontSize: "0.875rem",
            }}
            onClick={() => setRecruitmentModalTab("details")}
          >
            <i className="bi bi-briefcase"></i>
            <span>1. Drive Details</span>
          </button>

          <button
            type="button"
            className={`btn flex-fill py-1 rounded-2 fw-medium d-flex align-items-center justify-content-center gap-2 border-0 position-relative ${
              recruitmentModalTab === "form" ? "text-white" : "text-secondary"
            }`}
            style={{
              zIndex: 2,
              transition: "color 0.2s ease",
              background: "transparent",
              fontSize: "0.875rem",
            }}
            onClick={() => setRecruitmentModalTab("form")}
          >
            <i className="bi bi-ui-checks-grid"></i>
            <span>2. Application Form</span>
            <span
              className="badge rounded-1 px-2"
              style={{
                fontSize: "0.72rem",
                background:
                  recruitmentModalTab === "form"
                    ? "rgba(255,255,255,0.25)"
                    : "#1e293b",
                color:
                  recruitmentModalTab === "form" ? "#ffffff" : "#94a3b8",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {form.questions?.length || 0}
            </span>
          </button>
        </div>

        {/* Modal Body with Sliding Tabs */}
        <div className="tab-slider-wrapper">
          <div
            className="tab-slider-track"
            style={{
              transform:
                recruitmentModalTab === "details"
                  ? "translateX(0%)"
                  : "translateX(-50%)",
            }}
          >
            {/* Slide 1: Drive Details */}
            <div className="tab-slide px-1">
              <div className="row g-3">
                {/* Left Column */}
                <div className="col-lg-6 d-flex flex-column gap-3">
                  {/* Title */}
                  <div>
                    <label className="admin-form-label">
                      Drive Title <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="admin-input-group-text">
                        <i className="bi bi-card-heading"></i>
                      </span>
                      <input
                        className={`form-control form-control-glass ${
                          validationErrors.title ? "is-invalid" : ""
                        }`}
                        placeholder="e.g. Core Team Recruitment 2026"
                        value={form.title}
                        onChange={(e) => {
                          setForm({ ...form, title: e.target.value });
                          setValidationErrors({
                            ...validationErrors,
                            title: validateTitle(e.target.value),
                          });
                        }}
                        maxLength={100}
                      />
                    </div>
                    {validationErrors.title && (
                      <div className="invalid-feedback-custom">
                        {validationErrors.title}
                      </div>
                    )}
                    <div
                      className={`character-counter ${
                        form.title.length > 90 ? "warning" : ""
                      } ${form.title.length >= 100 ? "danger" : ""}`}
                    >
                      {form.title.length} / 100
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="admin-form-label">
                      Role / Position Title <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="admin-input-group-text">
                        <i className="bi bi-person-badge"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control form-control-glass ${
                          validationErrors.role ? "is-invalid" : ""
                        }`}
                        placeholder="e.g. Technical Lead / Creative Designer"
                        value={form.role}
                        onChange={(e) => {
                          setForm({ ...form, role: e.target.value });
                          setValidationErrors({
                            ...validationErrors,
                            role: validateRole(e.target.value),
                          });
                        }}
                        maxLength={50}
                      />
                    </div>
                    {validationErrors.role && (
                      <div className="invalid-feedback-custom">
                        {validationErrors.role}
                      </div>
                    )}
                    <div
                      className={`character-counter ${
                        form.role.length > 45 ? "warning" : ""
                      } ${form.role.length >= 50 ? "danger" : ""}`}
                    >
                      {form.role.length} / 50
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="admin-form-label">
                        Start Date <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="admin-input-group-text">
                          <i className="bi bi-calendar-check"></i>
                        </span>
                        <input
                          type="date"
                          className={`form-control form-control-glass ${
                            validationErrors.startDate ||
                            validationErrors.dateRange
                              ? "is-invalid"
                              : ""
                          }`}
                          value={form.startDate}
                          min={getTodayDate()}
                          onChange={(e) => {
                            const newStartDate = e.target.value;
                            setForm({ ...form, startDate: newStartDate });

                            if (
                              form.endDate &&
                              new Date(newStartDate) >= new Date(form.endDate)
                            ) {
                              setForm((prev) => ({ ...prev, endDate: "" }));
                            }

                            const errors = { ...validationErrors };
                            errors.startDate = validateStartDate(newStartDate);
                            errors.endDate = validateEndDate(
                              form.endDate,
                              newStartDate
                            );
                            errors.dateRange = validateDateRange(
                              newStartDate,
                              form.endDate
                            );
                            setValidationErrors(errors);
                          }}
                        />
                      </div>
                      {validationErrors.startDate && (
                        <div className="invalid-feedback-custom">
                          {validationErrors.startDate}
                        </div>
                      )}
                    </div>

                    <div className="col-6">
                      <label className="admin-form-label">
                        End Date <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="admin-input-group-text">
                          <i className="bi bi-calendar-x"></i>
                        </span>
                        <input
                          type="date"
                          className={`form-control form-control-glass ${
                            validationErrors.endDate ||
                            validationErrors.dateRange
                              ? "is-invalid"
                              : ""
                          }`}
                          value={form.endDate}
                          min={getMinEndDate()}
                          onChange={(e) => {
                            const newEndDate = e.target.value;
                            setForm({ ...form, endDate: newEndDate });

                            const errors = { ...validationErrors };
                            errors.endDate = validateEndDate(
                              newEndDate,
                              form.startDate
                            );
                            errors.dateRange = validateDateRange(
                              form.startDate,
                              newEndDate
                            );
                            setValidationErrors(errors);
                          }}
                        />
                      </div>
                      {validationErrors.endDate && (
                        <div className="invalid-feedback-custom">
                          {validationErrors.endDate}
                        </div>
                      )}
                    </div>

                    {validationErrors.dateRange && (
                      <div className="col-12">
                        <div className="invalid-feedback-custom">
                          {validationErrors.dateRange}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Open Applications Toggle */}
                  <div
                    className="p-3 rounded-2 d-flex align-items-center justify-content-between"
                    style={{ background: "#090d16", border: "1px solid #1e293b" }}
                  >
                    <div>
                      <div className="text-white fw-medium small mb-1">
                        Accepting Applications?
                      </div>
                      <span
                        className="badge rounded-1 px-2 py-1"
                        style={{
                          fontSize: "0.72rem",
                          background: form.isOpen
                            ? "rgba(16, 185, 129, 0.15)"
                            : "#1e293b",
                          color: form.isOpen ? "#6ee7b7" : "#94a3b8",
                          border: form.isOpen
                            ? "1px solid rgba(16, 185, 129, 0.25)"
                            : "1px solid #334155",
                        }}
                      >
                        <i
                          className={`bi ${
                            form.isOpen
                              ? "bi-check-circle-fill"
                              : "bi-dash-circle"
                          } me-1`}
                        ></i>
                        {form.isOpen ? "Open & Accepting" : "Closed / Draft"}
                      </span>
                    </div>
                    <input
                      className="form-check-input m-0 cursor-pointer"
                      type="checkbox"
                      style={{
                        width: "2.6em",
                        height: "1.3em",
                        cursor: "pointer",
                      }}
                      checked={form.isOpen}
                      onChange={(e) =>
                        setForm({ ...form, isOpen: e.target.checked })
                      }
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-lg-6 d-flex flex-column gap-3">
                  {/* Description */}
                  <div>
                    <label className="admin-form-label">Drive Description</label>
                    <textarea
                      className={`form-control form-control-glass ${
                        validationErrors.description ? "is-invalid" : ""
                      }`}
                      rows={4}
                      placeholder="Describe the recruitment drive, eligibility criteria, and expectations..."
                      value={form.description}
                      onChange={(e) => {
                        setForm({ ...form, description: e.target.value });
                        setValidationErrors({
                          ...validationErrors,
                          description: validateDescription(e.target.value),
                        });
                      }}
                      maxLength={500}
                      style={{ resize: "none" }}
                    />
                    {validationErrors.description && (
                      <div className="invalid-feedback-custom">
                        {validationErrors.description}
                      </div>
                    )}
                    <div
                      className={`character-counter ${
                        form.description.length > 450 ? "warning" : ""
                      } ${form.description.length >= 500 ? "danger" : ""}`}
                    >
                      {form.description.length} / 500
                    </div>
                  </div>

                  {/* Guidelines Card */}
                  <div
                    className="p-3 rounded-2 d-flex flex-column gap-2"
                    style={{
                      background: "#131b2e",
                      border: "1px solid #1e293b",
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 text-primary fw-medium small">
                      <i className="bi bi-ui-checks"></i>
                      <span>Application Form Builder</span>
                    </div>
                    <p
                      className="text-secondary small mb-0"
                      style={{ lineHeight: 1.5, fontSize: "0.8125rem" }}
                    >
                      Use the <strong>Application Form</strong> tab to configure
                      custom questions, portfolio uploads, and short answers.
                      Applicants will fill out your customized form directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2: Form Builder */}
            <div className="tab-slide px-1">
              <div
                style={{ maxHeight: "calc(75vh - 180px)", overflowY: "auto" }}
                className="pe-1"
              >
                <div
                  className="alert border-0 d-flex align-items-center gap-2 mb-3 py-2 px-3 rounded-2"
                  style={{ background: "#1e293b", border: "1px solid #334155" }}
                >
                  <i className="bi bi-info-circle text-primary fs-6"></i>
                  <span className="small text-light">
                    Build your application form with custom questions, input types,
                    and validations. Changes are saved with the recruitment drive.
                  </span>
                </div>
                <FormBuilder
                  questions={(form.questions as IQuestion[]) || []}
                  onChange={(questions) =>
                    setForm({
                      ...form,
                      questions: questions as unknown as Question[],
                    })
                  }
                  formTitle={form.title || "Recruitment Application"}
                  formDescription={
                    form.description ||
                    "Please fill in the details below to apply for this position."
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="d-flex justify-content-between align-items-center pt-3 mt-3"
          style={{ borderTop: "1px solid #1e293b" }}
        >
          <div>
            {recruitmentModalTab === "details" ? (
              <button
                type="button"
                className="btn-admin-outline"
                onClick={() => setRecruitmentModalTab("form")}
              >
                <span>
                  Next: Application Form ({form.questions?.length || 0})
                </span>
                <i className="bi bi-arrow-right"></i>
              </button>
            ) : (
              <button
                type="button"
                className="btn-admin-outline"
                onClick={() => setRecruitmentModalTab("details")}
              >
                <i className="bi bi-arrow-left"></i>
                <span>Back: Drive Details</span>
              </button>
            )}
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn-admin-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-admin-primary"
              onClick={handleSaveClick}
              disabled={hasValidationErrors || isSubmitting}
            >
              {isSubmitting ? (
                <span>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {editingId ? "Updating..." : "Creating..."}
                </span>
              ) : editingId ? (
                "Save Changes"
              ) : (
                "Create Drive"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentModal;
