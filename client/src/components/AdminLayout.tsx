import React, { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import Message from "./Message";
import { useAuth } from "../context/AuthContext";
import "../styles/admin-common.css";

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 2 * 60 * 1000;     // 2 minutes

interface AdminLayoutProps {
  active: string;
  loading?: boolean;
  toast?: {
    show: boolean;
    variant: "success" | "error" | "info" | "warning";
    message: string;
    title?: string;
  };
  onCloseToast?: () => void;
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  active,
  loading = false,
  toast,
  onCloseToast,
  children,
}) => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(WARNING_TIME);

  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleLogout = useCallback(async () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    await logout();
    navigate("/admin/login");
  }, [logout, navigate]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    setShowTimeoutWarning(false);
    setTimeLeft(WARNING_TIME);

    warningTimerRef.current = setTimeout(() => {
      setShowTimeoutWarning(true);
      let remaining = WARNING_TIME;
      setTimeLeft(remaining);

      countdownIntervalRef.current = setInterval(() => {
        remaining -= 1000;
        setTimeLeft(remaining);
        if (remaining <= 0) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        }
      }, 1000);
    }, SESSION_TIMEOUT - WARNING_TIME);

    inactivityTimerRef.current = setTimeout(() => {
      handleLogout();
    }, SESSION_TIMEOUT);
  }, [handleLogout]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    const handleActivity = () => {
      if (!showTimeoutWarning) {
        resetInactivityTimer();
      }
    };

    resetInactivityTimer();

    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isAuthenticated, showTimeoutWarning, resetInactivityTimer]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="d-flex vh-100"
      style={{
        background: "#111827",
        color: "#e5e7eb",
        overflow: "visible",
      }}
    >
      {/* Sidebar */}
      <Sidebar active={active} onLogout={handleLogout} />

      {/* Global Loader */}
      <Loader loading={loading} variant="orbit" fullscreen theme="dark" />

      {/* Message / Toast */}
      {toast && (
        <Message
          show={toast.show}
          variant={toast.variant}
          title={toast.title}
          onClose={onCloseToast}
        >
          {toast.message}
        </Message>
      )}

      {/* Session Inactivity Timeout Warning Modal */}
      {showTimeoutWarning && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 9999,
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-glass p-4 text-center">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "60px",
                  height: "60px",
                  background: "rgba(245, 158, 11, 0.15)",
                  color: "#f59e0b",
                  fontSize: "1.8rem",
                }}
              >
                ⚠️
              </div>
              <h4 className="fw-bold text-light mb-2">Session Expiring</h4>
              <p className="text-secondary mb-3">
                You have been inactive. For security, your session will expire in:
              </p>
              <div
                className="display-6 fw-bold mb-4 font-monospace"
                style={{ color: "#f59e0b" }}
              >
                {formatTime(timeLeft)}
              </div>
              <div className="d-flex gap-3 justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-light px-4 py-2"
                  onClick={handleLogout}
                >
                  Logout Now
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-4 py-2"
                  style={{ background: "#6366f1", borderColor: "#6366f1" }}
                  onClick={resetInactivityTimer}
                >
                  Stay Logged In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className="flex-grow-1 p-4 p-md-5 mobile-offset" style={{ overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
