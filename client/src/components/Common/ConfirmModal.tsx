import React from "react";
import { createPortal } from "react-dom";

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

  const modalContent = (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem",
      }}
    >
      <div
        className="p-4"
        style={{
          maxWidth: "460px",
          width: "100%",
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)",
          color: "#f8fafc",
        }}
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
            className="btn btn-secondary px-3 py-2"
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              borderColor: "rgba(255, 255, 255, 0.12)",
              color: "#cbd5e1",
              borderRadius: "8px",
              fontSize: "0.88rem",
              fontWeight: 500,
            }}
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger px-3 py-2 text-white fw-semibold"
            style={{
              background: btnBg,
              borderColor: btnBg,
              borderRadius: "8px",
              fontSize: "0.88rem",
            }}
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

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
};

export default ConfirmModal;
