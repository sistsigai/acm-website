import React from "react";

interface DeleteSocialModalProps {
  show: boolean;
  platform: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const DeleteSocialModal: React.FC<DeleteSocialModalProps> = ({
  show,
  platform,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!show || !platform) return null;

  return (
    <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
      <div
        className="admin-modal-container p-4 text-center"
        style={{ maxWidth: "420px", background: "#0f172a" }}
      >
        <div
          className="d-inline-flex align-items-center justify-content-center p-3 mb-3 rounded-circle"
          style={{
            width: 56,
            height: 56,
            background: "rgba(239, 68, 68, 0.15)",
            color: "#ef4444",
          }}
        >
          <i className="bi bi-exclamation-triangle-fill fs-4"></i>
        </div>
        <h5 className="fw-bold text-white mb-2">Remove {platform} Link?</h5>
        <p className="text-secondary small mb-4">
          This will unlink the {platform} profile from this member.
        </p>
        <div className="d-flex justify-content-center gap-2">
          <button
            type="button"
            className="btn-admin-secondary px-3 py-2"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger px-4 py-2 rounded-2 fw-medium"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSocialModal;
