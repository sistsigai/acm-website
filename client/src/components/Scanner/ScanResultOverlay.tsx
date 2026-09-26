import React from "react";
import { createPortal } from "react-dom";

export type ScanStatusType = "success" | "already_checked_in" | "invalid" | "mismatch";

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
  answers?: Record<string, any>;
  ticketEventId?: string;
  ticketEventName?: string;
  currentEventName?: string;
}

interface ScanResultOverlayProps {
  result: ScanResultData | null;
  onDismiss: () => void;
  onSwitchEvent?: (targetEventId: string) => void;
}

export const ScanResultOverlay: React.FC<ScanResultOverlayProps> = ({
  result,
  onDismiss,
  onSwitchEvent,
}) => {
  if (!result) return null;

  const isSuccess = result.status === "success";
  const isAlready = result.status === "already_checked_in";
  const isMismatch = result.status === "mismatch" || Boolean(result.ticketEventName);

  // Extract attendee details with broad fallback compatibility
  const answersMap =
    result.answers instanceof Map
      ? Object.fromEntries(result.answers)
      : typeof result.answers === "object" && result.answers !== null
      ? result.answers
      : {};

  const attendeeName =
    result.name ||
    answersMap["Full Name"] ||
    answersMap["Name"] ||
    answersMap["fullname"] ||
    answersMap["name"] ||
    "";

  const attendeeRegNo =
    result.registerNo ||
    answersMap["Register Number"] ||
    answersMap["Register No"] ||
    answersMap["regno"] ||
    answersMap["regNumber"] ||
    "";


  const themeConfig = isSuccess
    ? {
        bg: "#052e16",
        border: "#22c55e",
        glow: "rgba(34, 197, 94, 0.45)",
        iconBg: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        textColor: "#4ade80",
        badgeBg: "rgba(34, 197, 94, 0.2)",
        badgeText: "#4ade80",
        badgeBorder: "rgba(34, 197, 94, 0.4)",
        icon: "bi-check-lg",
        title: "Attendance Verified",
        btnBg: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        btnText: "#022c22",
        btnShadow: "0 8px 24px rgba(34, 197, 94, 0.5)",
      }
    : isAlready
    ? {
        bg: "#2e1a05",
        border: "#f59e0b",
        glow: "rgba(245, 158, 11, 0.45)",
        iconBg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        textColor: "#fbbf24",
        badgeBg: "rgba(245, 158, 11, 0.2)",
        badgeText: "#fbbf24",
        badgeBorder: "rgba(245, 158, 11, 0.4)",
        icon: "bi-exclamation-lg",
        title: "Already Checked In",
        btnBg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        btnText: "#451a03",
        btnShadow: "0 8px 24px rgba(245, 158, 11, 0.45)",
      }
    : isMismatch
    ? {
        bg: "#2e1005",
        border: "#f97316",
        glow: "rgba(249, 115, 22, 0.45)",
        iconBg: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
        textColor: "#fb923c",
        badgeBg: "rgba(249, 115, 22, 0.2)",
        badgeText: "#fb923c",
        badgeBorder: "rgba(249, 115, 22, 0.4)",
        icon: "bi-arrow-left-right",
        title: "Event Mismatch",
        btnBg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        btnText: "#ffffff",
        btnShadow: "0 8px 24px rgba(59, 130, 246, 0.45)",
      }
    : {
        bg: "#2e0808",
        border: "#ef4444",
        glow: "rgba(239, 68, 68, 0.45)",
        iconBg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        textColor: "#f87171",
        badgeBg: "rgba(239, 68, 68, 0.2)",
        badgeText: "#f87171",
        badgeBorder: "rgba(239, 68, 68, 0.4)",
        icon: "bi-x-lg",
        title: "Invalid Ticket",
        btnBg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        btnText: "#ffffff",
        btnShadow: "0 8px 24px rgba(59, 130, 246, 0.45)",
      };

  const content = (
    <div
      className="position-fixed d-flex align-items-center justify-content-center p-3"
      style={{
        inset: 0,
        background: "rgba(0, 0, 0, 0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        zIndex: 999999,
        animation: "scannerModalFadeIn 0.2s ease-out forwards",
      }}
      onClick={onDismiss}
    >
      <div
        className="w-100 rounded-4 overflow-hidden position-relative text-center"
        style={{
          maxWidth: "400px",
          background: "#0c1322",
          border: `2px solid ${themeConfig.border}`,
          borderRadius: "24px",
          boxShadow: `0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 40px ${themeConfig.glow}`,
          color: "#f8fafc",
          padding: "30px 22px 24px",
          animation: "scannerModalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Status Icon */}
        <div className="text-center mb-3 pb-1">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{
              width: "66px",
              height: "66px",
              background: themeConfig.iconBg,
              color: themeConfig.btnText,
              fontSize: "2rem",
              boxShadow: `0 0 24px ${themeConfig.border}`,
            }}
          >
            <i className={`bi ${themeConfig.icon} fw-bold`}></i>
          </div>

          <h3
            className="fw-bold mb-1.5 tracking-tight text-white"
            style={{
              color: themeConfig.textColor,
              fontSize: "1.45rem",
              letterSpacing: "-0.02em",
            }}
          >
            {themeConfig.title}
          </h3>

          <p className="small mb-0" style={{ fontSize: "0.88rem", color: "#94a3b8" }}>
            {result.message}
          </p>
        </div>

        {/* Event Mismatch Comparison Card */}
        {isMismatch && result.ticketEventName && (
          <div
            className="rounded-4 p-3 mb-3 text-start"
            style={{
              background: "rgba(249, 115, 22, 0.08)",
              border: "1px solid rgba(249, 115, 22, 0.3)",
            }}
          >
            <div className="mb-2">
              <span className="text-uppercase fw-bold tracking-wider d-block mb-0.5" style={{ fontSize: "0.68rem", color: "#94a3b8" }}>
                Ticket belongs to
              </span>
              <div className="d-flex align-items-center gap-2 text-warning fw-semibold" style={{ fontSize: "0.95rem" }}>
                <i className="bi bi-calendar-event"></i>
                <span className="text-white">{result.ticketEventName}</span>
              </div>
            </div>

            {result.currentEventName && (
              <div className="pt-2 border-top border-secondary border-opacity-20">
                <span className="text-uppercase fw-bold tracking-wider d-block mb-0.5" style={{ fontSize: "0.68rem", color: "#94a3b8" }}>
                  Active scanner for
                </span>
                <div className="d-flex align-items-center gap-2 text-secondary" style={{ fontSize: "0.85rem" }}>
                  <i className="bi bi-qr-code-scan"></i>
                  <span>{result.currentEventName}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Attendee Details Card (Cleaned: Only Name & Register Number) */}
        {attendeeName ? (
          <div
            className="rounded-4 p-3.5 mb-4 text-start"
            style={{
              background: "linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "18px",
            }}
          >
            {/* Full Name */}
            <div className="mb-3">
              <span
                className="text-uppercase fw-bold d-block mb-1"
                style={{
                  fontSize: "0.68rem",
                  color: "#64748b",
                  letterSpacing: "0.8px",
                }}
              >
                ATTENDEE NAME
              </span>
              <h4
                className="fw-bold text-white mb-0 text-truncate"
                style={{ fontSize: "1.25rem", letterSpacing: "-0.01em" }}
              >
                {attendeeName}
              </h4>
            </div>

            {/* Register Number */}
            {attendeeRegNo && (
              <div>
                <span
                  className="text-uppercase fw-bold d-block mb-1.5"
                  style={{
                    fontSize: "0.68rem",
                    color: "#64748b",
                    letterSpacing: "0.8px",
                  }}
                >
                  REGISTER NUMBER
                </span>
                <div
                  className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-3 fw-bold font-monospace"
                  style={{
                    background: "rgba(56, 189, 248, 0.12)",
                    border: "1px solid rgba(56, 189, 248, 0.35)",
                    color: "#38bdf8",
                    fontSize: "0.95rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  <i className="bi bi-person-badge"></i>
                  <span>{attendeeRegNo}</span>
                </div>
              </div>
            )}

            {/* Timestamp */}
            {result.checkedInAt && (
              <div
                className="pt-2.5 mt-3 border-top d-flex align-items-center justify-content-between"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.08)",
                  fontSize: "0.82rem",
                  color: "#94a3b8",
                }}
              >
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
        ) : null}

        {/* Buttons */}
        <div className="d-flex flex-column gap-2.5">
          {isMismatch && result.ticketEventId && onSwitchEvent && (
            <button
              type="button"
              className="w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 border-0"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                color: "#ffffff",
                boxShadow: "0 8px 24px rgba(249, 115, 22, 0.4)",
                fontSize: "0.95rem",
                cursor: "pointer",
              }}
              onClick={() => onSwitchEvent(result.ticketEventId!)}
            >
              <i className="bi bi-arrow-repeat fs-5"></i>
              <span>Switch to {result.ticketEventName || "Event"}</span>
            </button>
          )}

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
            <i className="bi bi-qr-code-scan"></i>
            <span>Scan Next Ticket</span>
            <i className="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document !== "undefined" && document.body) {
    return createPortal(content, document.body);
  }

  return content;
};

export default ScanResultOverlay;