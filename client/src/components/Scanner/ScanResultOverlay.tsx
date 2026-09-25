import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export type ScanStatusType = "success" | "already_checked_in" | "invalid";

export interface ScanResultData {
  status: ScanStatusType;
  message: string;
  name?: string;
  registerNo?: string;
  email?: string;
  phone?: string;
  dept?: string;
  year?: string;
  section?: string;
  checkedInAt?: string;
}

interface ScanResultOverlayProps {
  result: ScanResultData | null;
  onDismiss: () => void;
}

export const ScanResultOverlay: React.FC<ScanResultOverlayProps> = ({
  result,
  onDismiss,
}) => {
  if (!result) return null;

  const isSuccess = result.status === "success";
  const isAlready = result.status === "already_checked_in";

  const themeConfig = isSuccess
    ? {
        bg: "#052e16",
        border: "#22c55e",
        glow: "rgba(34, 197, 94, 0.4)",
        iconBg: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        textColor: "#4ade80",
        badgeBg: "rgba(34, 197, 94, 0.2)",
        badgeText: "#4ade80",
        badgeBorder: "rgba(34, 197, 94, 0.4)",
        icon: "bi-check-lg",
        title: "Attendance Verified",
        btnBg: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        btnText: "#022c22",
        btnShadow: "0 6px 20px rgba(34, 197, 94, 0.45)",
      }
    : isAlready
    ? {
        bg: "#2e1a05",
        border: "#f59e0b",
        glow: "rgba(245, 158, 11, 0.4)",
        iconBg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        textColor: "#fbbf24",
        badgeBg: "rgba(245, 158, 11, 0.2)",
        badgeText: "#fbbf24",
        badgeBorder: "rgba(245, 158, 11, 0.4)",
        icon: "bi-exclamation-lg",
        title: "Already Checked In",
        btnBg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        btnText: "#451a03",
        btnShadow: "0 6px 20px rgba(245, 158, 11, 0.4)",
      }
    : {
        bg: "#2e0808",
        border: "#ef4444",
        glow: "rgba(239, 68, 68, 0.4)",
        iconBg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        textColor: "#f87171",
        badgeBg: "rgba(239, 68, 68, 0.2)",
        badgeText: "#f87171",
        badgeBorder: "rgba(239, 68, 68, 0.4)",
        icon: "bi-x-lg",
        title: "Invalid Ticket",
        btnBg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        btnText: "#ffffff",
        btnShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
      };

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="position-fixed d-flex align-items-center justify-content-center p-3"
        style={{
          inset: 0,
          background: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          zIndex: 99999,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
      >
        <motion.div
          className="w-100 rounded-4 overflow-hidden position-relative"
          style={{
            maxWidth: "420px",
            background: "#0c1322",
            border: `2px solid ${themeConfig.border}`,
            boxShadow: `0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 40px ${themeConfig.glow}`,
            color: "#f8fafc",
            padding: "24px 20px 22px",
          }}
          initial={{ y: 40, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.92 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Status Icon */}
          <div className="text-center mb-3">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
              style={{
                width: "60px",
                height: "60px",
                background: themeConfig.iconBg,
                color: themeConfig.btnText,
                fontSize: "1.8rem",
                boxShadow: `0 0 24px ${themeConfig.border}`,
              }}
            >
              <i className={`bi ${themeConfig.icon} fw-bold`}></i>
            </div>

            <h4
              className="fw-bold mb-1 tracking-tight"
              style={{
                color: themeConfig.textColor,
                fontSize: "1.35rem",
              }}
            >
              {themeConfig.title}
            </h4>

            <p className="text-secondary small mb-0" style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
              {result.message}
            </p>
          </div>

          {/* Attendee Details Card */}
          {result.name ? (
            <div
              className="rounded-4 p-3 mb-3.5"
              style={{
                background: "linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Full Name */}
              <div className="mb-2.5">
                <span className="text-secondary small text-uppercase fw-bold tracking-wider d-block mb-1" style={{ fontSize: "0.7rem", color: "#64748b" }}>
                  Attendee Name
                </span>
                <h5 className="fw-bold text-white mb-0 text-truncate" style={{ fontSize: "1.2rem", letterSpacing: "-0.01em" }}>
                  {result.name}
                </h5>
              </div>

              {/* Register Number Chip */}
              {result.registerNo && (
                <div className="mb-2.5">
                  <span className="text-secondary small text-uppercase fw-bold tracking-wider d-block mb-1" style={{ fontSize: "0.7rem", color: "#64748b" }}>
                    Register Number
                  </span>
                  <div
                    className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-3 fw-bold font-monospace"
                    style={{
                      background: "rgba(56, 189, 248, 0.15)",
                      border: "1px solid rgba(56, 189, 248, 0.35)",
                      color: "#38bdf8",
                      fontSize: "1rem",
                      letterSpacing: "0.5px",
                    }}
                  >
                    <i className="bi bi-person-badge"></i>
                    <span>{result.registerNo}</span>
                  </div>
                </div>
              )}

              {/* Department & Year (if present) */}
              {(result.dept || result.year) && (
                <div className="pt-2 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between small text-secondary">
                  <span>Department</span>
                  <span className="text-light fw-medium">
                    {[result.dept, result.year, result.section].filter(Boolean).join(" • ")}
                  </span>
                </div>
              )}

              {/* Timestamp */}
              {result.checkedInAt && (
                <div className="pt-2 mt-2 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between small text-secondary">
                  <span>Checked in at</span>
                  <span className="text-white font-monospace fw-semibold">
                    {new Date(result.checkedInAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div
              className="rounded-4 p-3 mb-3.5 text-center"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
              }}
            >
              <p className="text-danger fw-semibold mb-0" style={{ fontSize: "0.92rem" }}>
                {result.message || "Invalid or unverified ticket QR code."}
              </p>
            </div>
          )}

          {/* Large Prominent Next Scan CTA Button */}
          <button
            type="button"
            className="w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 border-0 transition"
            style={{
              background: themeConfig.btnBg,
              color: themeConfig.btnText,
              boxShadow: themeConfig.btnShadow,
              fontSize: "1rem",
              letterSpacing: "0.2px",
              cursor: "pointer",
            }}
            onClick={onDismiss}
          >
            <i className="bi bi-qr-code-scan fs-5"></i>
            <span>Scan Next Ticket</span>
            <i className="bi bi-arrow-right fs-5 ms-1"></i>
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default ScanResultOverlay;