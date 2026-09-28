import React, { useState, useRef, useEffect } from "react";
import { motion as m } from "framer-motion";
import { Link } from "react-router-dom";

const SCANNER_PIN = "2026";
const PIN_STORAGE_KEY = "scanner_pin_verified";

interface ScannerPinGateProps {
  onSuccess: () => void;
}

export const ScannerPinGate: React.FC<ScannerPinGateProps> = ({ onSuccess }) => {
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const verifyPin = (enteredPin: string) => {
    if (enteredPin === SCANNER_PIN) {
      setError(null);
      setIsSuccess(true);
      try {
        sessionStorage.setItem(PIN_STORAGE_KEY, "true");
      } catch {}
      setTimeout(() => {
        onSuccess();
      }, 400);
    } else {
      setError("Incorrect PIN. Please try again.");
      setShakeKey((prev) => prev + 1);
      setTimeout(() => {
        setDigits(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }, 350);
    }
  };

  const handleChange = (index: number, value: string) => {
    // Allow only numeric input
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal) {
      const newDigits = [...digits];
      newDigits[index] = "";
      setDigits(newDigits);
      return;
    }

    const digit = cleanVal.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError(null);

    // Auto-advance to next input
    if (index < 3 && digit) {
      inputRefs.current[index + 1]?.focus();
    }

    // If 4 digits are entered, auto-verify
    const fullPin = newDigits.join("");
    if (fullPin.length === 4) {
      verifyPin(fullPin);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Move back to previous box and clear it
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
      } else {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pastedData) return;

    const newDigits = ["", "", "", ""];
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setDigits(newDigits);

    if (pastedData.length === 4) {
      verifyPin(pastedData);
    } else {
      inputRefs.current[Math.min(pastedData.length, 3)]?.focus();
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center px-3"
      style={{
        minHeight: "100dvh",
        width: "100vw",
        background: "radial-gradient(circle at 50% 20%, #0f1c34 0%, #080d1a 100%)",
        color: "#f8fafc",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: isSuccess
            ? "radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, transparent 70%)"
            : error
            ? "radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          transition: "background 0.3s ease",
        }}
      />

      <m.div
        key={shakeKey}
        animate={
          error
            ? { x: [-10, 10, -8, 8, -4, 4, 0] }
            : { x: 0 }
        }
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="w-100 position-relative"
        style={{
          maxWidth: "420px",
          background: "rgba(15, 23, 42, 0.75)",
          border: error
            ? "1.5px solid rgba(239, 68, 68, 0.5)"
            : isSuccess
            ? "1.5px solid rgba(34, 197, 94, 0.5)"
            : "1.5px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "28px",
          padding: "38px 24px 32px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 40px rgba(0, 0, 0, 0.5)",
          textAlign: "center",
        }}
      >
        {/* Top Lock / Scanner Icon */}
        <div className="d-flex justify-content-center mb-3.5">
          <div
            className="d-flex align-items-center justify-content-center rounded-4"
            style={{
              width: "68px",
              height: "68px",
              background: isSuccess
                ? "linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(22, 163, 74, 0.35) 100%)"
                : "linear-gradient(135deg, rgba(56, 189, 248, 0.18) 0%, rgba(37, 99, 235, 0.25) 100%)",
              border: isSuccess
                ? "1.5px solid rgba(34, 197, 94, 0.5)"
                : "1.5px solid rgba(56, 189, 248, 0.4)",
              color: isSuccess ? "#4ade80" : "#38bdf8",
              boxShadow: isSuccess
                ? "0 0 24px rgba(34, 197, 94, 0.35)"
                : "0 0 24px rgba(56, 189, 248, 0.25)",
              fontSize: "1.75rem",
              transition: "all 0.3s ease",
            }}
          >
            <i className={`bi ${isSuccess ? "bi-shield-check" : "bi-shield-lock-fill"}`}></i>
          </div>
        </div>

        {/* Heading */}
        <h4 className="fw-bold text-white mb-1.5" style={{ fontSize: "1.35rem", letterSpacing: "-0.02em" }}>
          Ticket Scanner Access
        </h4>
        <p className="text-secondary small mb-4" style={{ fontSize: "0.86rem", color: "#94a3b8" }}>
          Enter the 4-digit PIN to access the event scanner
        </p>

        {/* 4 Digit Boxes (Matching screenshot style) */}
        <div className="d-flex justify-content-center align-items-center gap-2 gap-sm-3 mb-3">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              autoComplete="one-time-code"
              style={{
                width: "58px",
                height: "64px",
                textAlign: "center",
                fontSize: "1.65rem",
                fontWeight: 700,
                fontFamily: "monospace",
                color: "#ffffff",
                background: digit ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.05)",
                border: error
                  ? "2px solid #ef4444"
                  : isSuccess
                  ? "2px solid #22c55e"
                  : digit
                  ? "2px solid #38bdf8"
                  : "1.5px solid rgba(255, 255, 255, 0.16)",
                borderRadius: "14px",
                boxShadow: digit
                  ? "0 0 16px rgba(56, 189, 248, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1)"
                  : "none",
                outline: "none",
                transition: "all 0.18s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#38bdf8";
                e.target.style.boxShadow = "0 0 18px rgba(56, 189, 248, 0.4)";
                e.target.select();
              }}
              onBlur={(e) => {
                if (!digit) {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.16)";
                  e.target.style.boxShadow = "none";
                }
              }}
            />
          ))}
        </div>

        {/* Error / Success Status Feedback */}
        <div style={{ minHeight: "24px" }} className="mb-3">
          {error && (
            <m.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-danger fw-semibold d-inline-flex align-items-center gap-1.5"
              style={{ fontSize: "0.82rem" }}
            >
              <i className="bi bi-exclamation-circle-fill"></i>
              <span>{error}</span>
            </m.span>
          )}
          {isSuccess && (
            <m.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-success fw-bold d-inline-flex align-items-center gap-1.5"
              style={{ fontSize: "0.84rem" }}
            >
              <i className="bi bi-check-circle-fill"></i>
              <span>PIN Verified! Opening Scanner...</span>
            </m.span>
          )}
        </div>

        {/* Back Link */}
        <div className="pt-2 border-top border-secondary border-opacity-20">
          <Link
            to="/"
            className="text-secondary text-decoration-none small d-inline-flex align-items-center gap-1.5"
            style={{ fontSize: "0.82rem", color: "#64748b", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
          >
            <i className="bi bi-arrow-left"></i>
            <span>Return to Home</span>
          </Link>
        </div>
      </m.div>
    </div>
  );
};

export default ScannerPinGate;
