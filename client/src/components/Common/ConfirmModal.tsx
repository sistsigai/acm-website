import React from "react";

interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  itemName?: string;
  confirmText?: string;
  confirmVariant?: "danger" | "warning" | "primary";
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  title,
  message,
  itemName,
  confirmText = "Delete",
  confirmVariant = "danger",
  isProcessing = false,
  onConfirm,
  onCancel,
}) => {
  if (!show) return null;

  const btnBg =
    confirmVariant === "danger"
      ? "#ef4444"
      : confirmVariant === "warning"
      ? "#f59e0b"
      : "#3b82f6";

  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div
        className="admin-modal-container p-4"
        style={{ maxWidth: "460px", background: "#0f172a" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{
              width: "56px",
              height: "56px",
              background: confirmVariant === "danger" ? "rgba(239, 68, 68, 0.15)" : "rgba(59, 130, 246, 0.15)",
              color: confirmVariant === "danger" ? "#ef4444" : "#3b82f6",
              fontSize: "1.5rem",
            }}
          >
            <i className={confirmVariant === "danger" ? "bi bi-exclamation-triangle-fill" : "bi bi-info-circle-fill"}></i>
          </div>
          <h5 className="fw-bold text-white mb-2">{title}</h5>
          <p className="text-secondary small mb-0">
            {message}{" "}
            {itemName && <strong className="text-white">"{itemName}"</strong>}
          </p>
        </div>

        <div className="d-flex gap-2 justify-content-end">
          <button
            type="button"
            className="btn-admin-secondary"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-admin-primary"
            style={{ background: btnBg, borderColor: btnBg }}
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
