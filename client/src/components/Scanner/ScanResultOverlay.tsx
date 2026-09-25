import React, { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";

export type ScanStatusType = "success" | "already_checked_in" | "invalid";

export interface ScanResultData {
  status: ScanStatusType;
  message: string;
  name?: string;
  registerNo?: string;
  email?: string;
  phone?: string;
  dept?: string;
  checkedInAt?: string;
}

interface ScanResultOverlayProps {
  result: ScanResultData | null;
  onDismiss: () => void;
  autoResumeSeconds?: number;
}

export const ScanResultOverlay: React.FC<ScanResultOverlayProps> = ({
  result,
  onDismiss,
  autoResumeSeconds = 3,
}) => {
  const [timeLeft, setTimeLeft] = useState(autoResumeSeconds);

  useEffect(() => {
    if (!result) return;
    setTimeLeft(autoResumeSeconds);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [result, autoResumeSeconds, onDismiss]);

  if (!result) return null;

  const isSuccess = result.status === "success";
  const isAlready = result.status === "already_checked_in";

  const themeConfig = isSuccess
    ? {
        bg: "#052e16",
        border: "#22c55e",
        textColor: "#4ade80",
        badgeBg: "rgba(34, 197, 94, 0.2)",
        badgeText: "#4ade80",
        badgeBorder: "rgba(34, 197, 94, 0.4)",
        icon: "bi-check-circle-fill",
        title: "Check-in Successful",
      }
    : isAlready
    ? {
        bg: "#2e1a05",
        border: "#f59e0b",
        textColor: "#fbbf24",
        badgeBg: "rgba(245, 158, 11, 0.2)",
        badgeText: "#fbbf24",
        badgeBorder: "rgba(245, 158, 11, 0.4)",
        icon: "bi-exclamation-triangle-fill",
        title: "Already Checked In",
      }
    : {
        bg: "#2e0808",
        border: "#ef4444",
        textColor: "#f87171",
        badgeBg: "rgba(239, 68, 68, 0.2)",
        badgeText: "#f87171",
        badgeBorder: "rgba(239, 68, 68, 0.4)",
        icon: "bi-x-circle-fill",
        title: "Invalid Ticket",
      };

  return (
    <AnimatePresence>
      <m.div
        className="position-fixed d-flex align-items-end justify-content-center"
        style={{
          inset: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 9999,
          padding: "16px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
      >
        <m.div
          className="w-100 p-4 rounded-4 overflow-hidden position-relative"
          style={{
            maxWidth: "500px",
            background: "#0c1322",
            border: `2px solid ${themeConfig.border}`,
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 30px ${themeConfig.border}33`,
            color: "#f8fafc",
          }}
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Progress Bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <m.div
              style={{
                height: "100%",
                background: themeConfig.textColor,
              }}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: autoResumeSeconds, ease: "linear" }}
            />
          </div>

          {/* Status Header Badge */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span
              className="badge px-3 py-2 d-inline-flex align-items-center gap-2 rounded-pill"
              style={{
                background: themeConfig.badgeBg,
                border: `1px solid ${themeConfig.badgeBorder}`,
                color: themeConfig.badgeText,
                fontSize: "0.82rem",
                fontWeight: 600,
              }}
            >
              <i className={`bi ${themeConfig.icon} fs-6`}></i>
              <span>{themeConfig.title}</span>
            </span>

            <button
              type="button"
              className="btn btn-sm btn-link text-secondary text-decoration-none p-1"
              onClick={onDismiss}
              aria-label="Close result"
            >
              <i className="bi bi-x-lg fs-5"></i>
            </button>
          </div>

          {/* Attendee Details Card */}
          {result.name ? (
            <div
              className="p-3 rounded-3 mb-3"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <h4 className="fw-bold text-white mb-1 tracking-tight" style={{ fontSize: "1.35rem" }}>
                {result.name}
              </h4>

              <div className="d-flex flex-wrap align-items-center gap-3 mt-2 text-secondary small font-monospace">
                {result.registerNo && (
                  <div className="text-info fw-bold d-flex align-items-center gap-1.5" style={{ fontSize: "0.95rem" }}>
                    <i className="bi bi-person-badge"></i>
                    <span>{result.registerNo}</span>
                  </div>
                )}
                {result.dept && (
                  <div className="text-light">
                    <span>{result.dept}</span>
                  </div>
                )}
              </div>

              {/* Email & Contact */}
              <div className="mt-3 pt-2 border-top border-secondary border-opacity-25 d-flex flex-column gap-1.5 small text-secondary">
                {result.email && (
                  <div className="d-flex align-items-center gap-2 text-truncate font-monospace">
                    <i className="bi bi-envelope text-white-50"></i>
                    <span className="text-truncate text-light">{result.email}</span>
                  </div>
                )}
                {result.phone && (
                  <div className="d-flex align-items-center gap-2 font-monospace">
                    <i className="bi bi-telephone-fill text-success"></i>
                    <span className="text-light">{result.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              className="p-3 rounded-3 mb-3 text-center"
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <p className="text-danger fw-semibold mb-0" style={{ fontSize: "0.92rem" }}>
                {result.message || "Invalid or unverified ticket QR code."}
              </p>
            </div>
          )}

          {/* Timestamp Notice */}
          {result.checkedInAt && (
            <div className="d-flex align-items-center justify-content-between text-secondary small mb-3 px-1">
              <span>Time of Check-in:</span>
              <span className="text-white font-monospace fw-semibold">
                {new Date(result.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            className="btn w-100 py-2.5 rounded-3 fw-semibold text-white d-flex align-items-center justify-content-center gap-2"
            style={{
              background: isSuccess
                ? "linear-gradient(135deg, #16a34a 0%, #059669 100%)"
                : "linear-gradient(135deg, #2563eb 0%, #0891b2 100%)",
              border: "none",
              fontSize: "0.92rem",
            }}
            onClick={onDismiss}
          >
            <i className="bi bi-qr-code-scan fs-6"></i>
            <span>Scan Next Ticket ({timeLeft}s)</span>
          </button>
        </m.div>
      </m.div>
    </AnimatePresence>
  );
};

export default ScanResultOverlay;
