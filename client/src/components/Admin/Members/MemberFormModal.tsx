import React from "react";
import CustomSelect, { type CustomSelectOption } from "./CustomSelect";
import type { Member } from "./MemberCard";

export interface ValidationErrors {
  name?: string;
  designation?: string;
  batch?: string;
  profilePic?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
}

interface MemberFormModalProps {
  show: boolean;
  isEditMode: boolean;
  memberData: Member;
  validationErrors: ValidationErrors;
  imagePreview: string;
  isSubmitting: boolean;
  isUploadingImage?: boolean;
  uploadProgress?: number;
  hasValidationErrors: boolean;
  designationOptions: CustomSelectOption[];
  batchOptions: CustomSelectOption[];
  onClose: () => void;
  onSave: () => void;
  onNameChange: (val: string) => void;
  onDesignationChange: (val: string) => void;
  onBatchChange: (val: string) => void;
  onSocialChange: (platform: "linkedin" | "instagram" | "facebook", val: string) => void;
  onClearSocial: (platform: "linkedin" | "instagram" | "facebook") => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditCurrentImage: () => void;
  onRemoveImage: () => void;
}

export const MemberFormModal: React.FC<MemberFormModalProps> = ({
  show,
  isEditMode,
  memberData,
  validationErrors,
  imagePreview,
  isSubmitting,
  isUploadingImage = false,
  uploadProgress = 0,
  hasValidationErrors,
  designationOptions,
  batchOptions,
  onClose,
  onSave,
  onNameChange,
  onDesignationChange,
  onBatchChange,
  onSocialChange,
  onClearSocial,
  onImageUpload,
  onEditCurrentImage,
  onRemoveImage,
}) => {
  React.useEffect(() => {
    if (!show) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting && !isUploadingImage) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, isSubmitting, isUploadingImage, onClose]);

  if (!show) return null;

  return (
    <div
      className="admin-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting && !isUploadingImage) {
          onClose();
        }
      }}
    >
      <div className="admin-modal-container p-4 p-md-4 m-2" style={{ maxWidth: "860px", width: "100%" }}>
        {/* Modal Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-dark border-opacity-50">
          <div className="d-flex align-items-center gap-2">
            <i className={`bi ${isEditMode ? "bi-pencil-square text-primary" : "bi-person-plus text-primary"} fs-5`}></i>
            <h5 className="m-0 fw-bold text-white" style={{ fontSize: "1.15rem" }}>
              {isEditMode ? "Edit Member" : "Add Member"}
            </h5>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-link text-secondary p-1 rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={onClose}
            disabled={isSubmitting || isUploadingImage}
          >
            <i className="bi bi-x-lg" style={{ fontSize: "0.9rem" }}></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="row g-4">
          {/* Photo Upload Frame */}
          <div className="col-12 col-md-4 d-flex flex-column align-items-center">
            <div
              className="position-relative rounded-3 overflow-hidden mb-3 border border-secondary border-opacity-25 d-flex align-items-center justify-content-center"
              style={{
                width: 150,
                height: 200,
                background: "#090d16",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              }}
            >
              {imagePreview || memberData.profilePic || (memberData as any).imageUrl ? (
                <img
                  src={imagePreview || memberData.profilePic || (memberData as any).imageUrl}
                  alt="Portrait Preview"
                  className="w-100 h-100 object-fit-cover"
                />
              ) : (
                <div className="d-flex flex-column align-items-center text-secondary opacity-60">
                  <i className="bi bi-person-bounding-box fs-1 mb-1 text-primary"></i>
                  <span className="small">No Photo</span>
                </div>
              )}

              {/* Real-time Upload Progress Overlay */}
              {isUploadingImage && (
                <div className="admin-upload-progress-overlay">
                  <div className="progress-ring-container">
                    <svg width="64" height="64" viewBox="0 0 64 64" className="overflow-visible">
                      <circle
                        stroke="rgba(255, 255, 255, 0.12)"
                        strokeWidth="4.5"
                        fill="transparent"
                        r="26"
                        cx="32"
                        cy="32"
                      />
                      <circle
                        className="progress-ring-circle"
                        stroke="#3b82f6"
                        strokeWidth="4.5"
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={
                          2 * Math.PI * 26 - (Math.max(0, Math.min(100, uploadProgress)) / 100) * (2 * Math.PI * 26)
                        }
                        strokeLinecap="round"
                        fill="transparent"
                        r="26"
                        cx="32"
                        cy="32"
                        transform="rotate(-90 32 32)"
                        style={{ transition: "stroke-dashoffset 0.2s ease-out" }}
                      />
                      <text
                        x="32"
                        y="32"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#ffffff"
                        fontSize="13"
                        fontWeight="700"
                        fontFamily="inherit"
                        style={{ userSelect: "none" }}
                      >
                        {Math.round(uploadProgress)}%
                      </text>
                    </svg>
                  </div>
                  <div className="upload-progress-pill">
                    <i className="bi bi-cloud-arrow-up-fill"></i>
                    <span>Uploading...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Photo Actions */}
            <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap w-100 px-2">
              <label
                className={`btn btn-sm btn-primary mb-0 px-3 py-1.5 d-inline-flex align-items-center rounded-2 fw-medium ${
                  isUploadingImage || isSubmitting ? "disabled opacity-50" : ""
                }`}
                style={{ gap: "6px", fontSize: "0.825rem", cursor: isUploadingImage || isSubmitting ? "not-allowed" : "pointer" }}
              >
                <i className="bi bi-cloud-arrow-up-fill"></i>
                <span>{imagePreview || memberData.profilePic || (memberData as any).imageUrl ? "Change" : "Upload Photo"}</span>
                <input
                  type="file"
                  className="d-none"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={onImageUpload}
                  disabled={isUploadingImage || isSubmitting}
                />
              </label>

              {(imagePreview || memberData.profilePic || (memberData as any).imageUrl) && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-info px-2.5 py-1.5 d-inline-flex align-items-center rounded-2"
                  style={{ gap: "6px", fontSize: "0.825rem" }}
                  onClick={onEditCurrentImage}
                  disabled={isUploadingImage || isSubmitting}
                  title="Crop / Recenter photo"
                >
                  <i className="bi bi-crop"></i> <span>Crop</span>
                </button>
              )}

              {(imagePreview || memberData.profilePic || (memberData as any).imageUrl) && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger px-2.5 py-1.5 d-inline-flex align-items-center rounded-2"
                  style={{ fontSize: "0.825rem" }}
                  onClick={onRemoveImage}
                  disabled={isUploadingImage || isSubmitting}
                  title="Remove photo"
                >
                  <i className="bi bi-trash3"></i>
                </button>
              )}
            </div>

            {validationErrors.profilePic && (
              <div className="text-danger small text-center mt-2">
                {validationErrors.profilePic}
              </div>
            )}
          </div>

          {/* Details & Social */}
          <div className="col-12 col-md-8 d-flex flex-column gap-3">
            {/* Full Name */}
            <div>
              <label className="admin-form-label mb-1">
                Full Name <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="admin-input-group-text">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  placeholder="Enter member full name"
                  className={`form-control form-control-glass ${validationErrors.name ? "is-invalid" : ""}`}
                  value={memberData.name}
                  onChange={(e) => onNameChange(e.target.value)}
                  maxLength={50}
                />
              </div>
              {validationErrors.name && (
                <div className="text-danger small mt-1">{validationErrors.name}</div>
              )}
            </div>

            {/* Designation & Batch */}
            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label className="admin-form-label mb-1">
                  Designation <span className="text-danger">*</span>
                </label>
                <CustomSelect
                  value={memberData.designation}
                  options={designationOptions}
                  onChange={onDesignationChange}
                  label="Select Designation"
                  icon="bi-award"
                  hasError={Boolean(validationErrors.designation)}
                />
                {validationErrors.designation && (
                  <div className="text-danger small mt-1">{validationErrors.designation}</div>
                )}
              </div>

              <div className="col-12 col-sm-6">
                <label className="admin-form-label mb-1">
                  Batch Year <span className="text-danger">*</span>
                </label>
                <CustomSelect
                  value={memberData.batch}
                  options={batchOptions}
                  onChange={onBatchChange}
                  label="Select Batch"
                  icon="bi-mortarboard"
                  hasError={Boolean(validationErrors.batch)}
                />
                {validationErrors.batch && (
                  <div className="text-danger small mt-1">{validationErrors.batch}</div>
                )}
              </div>
            </div>

            {/* Social Profiles */}
            <div>
              <label className="admin-form-label mb-2 text-secondary">
                Social Profiles (Optional)
              </label>
              <div className="d-flex flex-column gap-2">
                {/* LinkedIn */}
                <div>
                  <div className="input-group">
                    <span className="admin-input-group-text" style={{ color: "#0a66c2" }}>
                      <i className="bi bi-linkedin"></i>
                    </span>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      className={`form-control form-control-glass ${validationErrors.linkedin ? "is-invalid" : ""}`}
                      value={memberData.social.linkedin || ""}
                      onChange={(e) => onSocialChange("linkedin", e.target.value)}
                    />
                    {memberData.social.linkedin && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => onClearSocial("linkedin")}
                        title="Clear LinkedIn"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    )}
                  </div>
                  {validationErrors.linkedin && (
                    <div className="text-danger small mt-1">{validationErrors.linkedin}</div>
                  )}
                </div>

                {/* Instagram */}
                <div>
                  <div className="input-group">
                    <span className="admin-input-group-text" style={{ color: "#e1306c" }}>
                      <i className="bi bi-instagram"></i>
                    </span>
                    <input
                      type="url"
                      placeholder="https://instagram.com/username"
                      className={`form-control form-control-glass ${validationErrors.instagram ? "is-invalid" : ""}`}
                      value={memberData.social.instagram || ""}
                      onChange={(e) => onSocialChange("instagram", e.target.value)}
                    />
                    {memberData.social.instagram && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => onClearSocial("instagram")}
                        title="Clear Instagram"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    )}
                  </div>
                  {validationErrors.instagram && (
                    <div className="text-danger small mt-1">{validationErrors.instagram}</div>
                  )}
                </div>

                {/* Facebook */}
                <div>
                  <div className="input-group">
                    <span className="admin-input-group-text" style={{ color: "#1877f2" }}>
                      <i className="bi bi-facebook"></i>
                    </span>
                    <input
                      type="url"
                      placeholder="https://facebook.com/username"
                      className={`form-control form-control-glass ${validationErrors.facebook ? "is-invalid" : ""}`}
                      value={memberData.social.facebook || ""}
                      onChange={(e) => onSocialChange("facebook", e.target.value)}
                    />
                    {memberData.social.facebook && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => onClearSocial("facebook")}
                        title="Clear Facebook"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    )}
                  </div>
                  {validationErrors.facebook && (
                    <div className="text-danger small mt-1">{validationErrors.facebook}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="d-flex justify-content-end align-items-center pt-3 mt-4 border-top border-dark border-opacity-50 gap-2">
          <button
            type="button"
            className="btn-admin-secondary px-4 py-2"
            onClick={onClose}
            disabled={isSubmitting || isUploadingImage}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-admin-primary px-4 py-2 d-inline-flex align-items-center gap-2"
            onClick={onSave}
            disabled={hasValidationErrors || isSubmitting || isUploadingImage}
          >
            {isUploadingImage ? (
              <>
                <span className="spinner-border spinner-border-sm"></span>
                <span>Uploading Image...</span>
              </>
            ) : isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm"></span>
                <span>Saving...</span>
              </>
            ) : (
              <span>{isEditMode ? "Save Changes" : "Create Member"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberFormModal;
