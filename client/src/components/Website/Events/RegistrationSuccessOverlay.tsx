import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion as m, AnimatePresence } from "framer-motion";
import { FaCheck, FaEnvelope } from "react-icons/fa";

interface RegistrationSuccessOverlayProps {
  show: boolean;
  eventName?: string;
  message?: string;
  onRefresh?: () => void;
}

export const RegistrationSuccessOverlay: React.FC<RegistrationSuccessOverlayProps> = ({
  show,
  eventName,
  message,
  onRefresh,
}) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      if (onRefresh) {
        onRefresh();
      } else {
        window.location.reload();
      }
    }, 3200);

    return () => clearTimeout(timer);
  }, [show, onRefresh]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {show && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(3, 7, 18, 0.94)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <m.div
            initial={{ scale: 0.88, opacity: 0, y: 25 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 25 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            style={{
              maxWidth: "520px",
              width: "100%",
              background: "linear-gradient(175deg, #0d1527 0%, #060a14 100%)",
              border: "1.5px solid rgba(56, 189, 248, 0.35)",
              borderRadius: "24px",
              padding: "40px 28px",
              textAlign: "center",
              boxShadow: "0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(34, 197, 94, 0.15)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Ambient Background Glow */}
            <div
              style={{
                position: "absolute",
                top: "-30%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "260px",
                height: "260px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(34, 197, 94, 0.22) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            {/* Glowing Success Icon */}
            <m.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.15 }}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "2rem",
                boxShadow: "0 0 35px rgba(16, 185, 129, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.4)",
                marginBottom: "24px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <FaCheck />
            </m.div>

            {/* Event Name Pill (if available) */}
            {eventName && (
              <m.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#38bdf8",
                  background: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  padding: "4px 14px",
                  borderRadius: "9999px",
                  marginBottom: "12px",
                  letterSpacing: "0.4px",
                  maxWidth: "90%",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {eventName}
              </m.span>
            )}

            {/* Title */}
            <m.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "#ffffff",
                marginBottom: "10px",
                letterSpacing: "-0.5px",
              }}
            >
              Registration Successful!
            </m.h2>

            {/* Message */}
            <m.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: "0.95rem",
                color: "#94a3b8",
                lineHeight: 1.5,
                margin: "0 0 20px 0",
                maxWidth: "420px",
              }}
            >
              {message || "Your spot has been reserved. A confirmation email with your event pass & entry QR code has been dispatched."}
            </m.p>

            {/* Email Dispatch Info Pill */}
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "14px",
                padding: "10px 16px",
                marginBottom: "28px",
                color: "#cbd5e1",
                fontSize: "0.85rem",
              }}
            >
              <FaEnvelope style={{ color: "#38bdf8", flexShrink: 0 }} />
              <span>Check your registered inbox for entry details</span>
            </m.div>

            {/* Auto Refresh Progress Bar & Button */}
            <div style={{ width: "100%", maxWidth: "340px" }}>
              <div
                style={{
                  width: "100%",
                  height: "4px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "9999px",
                  overflow: "hidden",
                  marginBottom: "16px",
                }}
              >
                <m.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3.2, ease: "linear" }}
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #38bdf8, #10b981)",
                    borderRadius: "9999px",
                  }}
                />
              </div>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default RegistrationSuccessOverlay;
