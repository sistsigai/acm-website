import React, { useState, useEffect, useRef } from "react";

interface CustomTimePickerProps {
  value: string; // "HH:MM AM/PM" format e.g. "09:30 AM"
  onChange: (timeStr: string) => void;
  isInvalid?: boolean;
  placeholder?: string;
  disabled?: boolean;
  placement?: "auto" | "top" | "bottom";
}

const HOURS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const MINUTES = ["00", "15", "30", "45"];

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  value,
  onChange,
  isInvalid,
  placeholder = "Select Time",
  disabled = false,
  placement = "auto",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine placement (top vs bottom)
  useEffect(() => {
    if (isOpen && containerRef.current) {
      if (placement === "top") {
        setDropUp(true);
      } else if (placement === "bottom") {
        setDropUp(false);
      } else {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setDropUp(spaceBelow < 290 && rect.top > 250);
      }
    }
  }, [isOpen, placement]);

  // Parse current value
  const parseTime = (val: string) => {
    const match = val.match(/^(0[1-9]|1[0-2]):([0-5][0-9])\s*(AM|PM)$/i);
    if (match) {
      return {
        hour: match[1].padStart(2, "0"),
        minute: match[2].padStart(2, "0"),
        meridian: match[3].toUpperCase(),
      };
    }
    return { hour: "09", minute: "00", meridian: "AM" };
  };

  const parsed = parseTime(value || "");
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);
  const [meridian, setMeridian] = useState(parsed.meridian);

  useEffect(() => {
    if (value) {
      const p = parseTime(value);
      setHour(p.hour);
      setMinute(p.minute);
      setMeridian(p.meridian);
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const emitTime = (h: string, m: string, mer: string) => {
    setHour(h);
    setMinute(m);
    setMeridian(mer);
    onChange(`${h}:${m} ${mer}`);
  };

  const handleHourClick = (h: string) => {
    emitTime(h, minute, meridian);
  };

  const handleMinuteClick = (m: string) => {
    emitTime(hour, m, meridian);
  };

  const handleMeridianClick = (mer: string) => {
    emitTime(hour, minute, mer);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  return (
    <div className="position-relative w-100" ref={containerRef}>
      {/* Trigger Field */}
      <div
        className={`input-group cursor-pointer ${disabled ? "opacity-50 pointer-events-none" : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
      >
        <span className="admin-input-group-text" style={{ cursor: "pointer" }}>
          <i className="bi bi-clock"></i>
        </span>
        <div
          className={`form-control form-control-glass d-flex align-items-center justify-content-between ${
            isInvalid ? "is-invalid" : ""
          } ${isOpen ? "border-primary shadow-sm" : ""}`}
          style={{
            cursor: "pointer",
            userSelect: "none",
            minHeight: "42px",
          }}
        >
          <span className={value ? "text-white fw-medium" : "text-secondary"}>
            {value || placeholder}
          </span>
          <i
            className={`bi bi-chevron-down small text-secondary transition-transform ${
              isOpen ? "rotate-180 text-primary" : ""
            }`}
            style={{
              transition: "transform 0.2s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          ></i>
        </div>
      </div>

      {/* Simplified Dropdown Popover */}
      {isOpen && (
        <div
          className="position-absolute p-3 rounded-3 shadow-lg"
          style={{
            [dropUp ? "bottom" : "top"]: dropUp ? "calc(100% + 6px)" : "calc(100% + 4px)",
            left: 0,
            zIndex: 2000,
            width: "280px",
            background: "linear-gradient(165deg, #090d16 0%, #030712 100%)",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            boxShadow:
              "0 20px 40px -10px rgba(0, 0, 0, 0.95), 0 0 25px rgba(56, 189, 248, 0.15)",
            backdropFilter: "blur(12px)",
            animation: "fadeInPicker 0.15s ease-out forwards",
          }}
        >
          {/* Digital Time Preview Header */}
          <div
            className="d-flex align-items-center justify-content-between mb-3 py-1.5 px-3 rounded-2"
            style={{
              background: "rgba(15, 23, 42, 0.9)",
              border: "1px solid rgba(56, 189, 248, 0.25)",
            }}
          >
            <div className="d-flex align-items-center font-monospace">
              <span className="fw-bold text-white fs-5">{hour}</span>
              <span className="text-primary fs-5 mx-1 fw-bold">:</span>
              <span className="fw-bold text-white fs-5">{minute}</span>
            </div>

            {/* AM / PM Pills */}
            <div
              className="d-flex p-0.5 rounded-2"
              style={{ background: "rgba(255, 255, 255, 0.06)" }}
            >
              {["AM", "PM"].map((mer) => {
                const isSelected = meridian === mer;
                return (
                  <button
                    key={mer}
                    type="button"
                    onClick={() => handleMeridianClick(mer)}
                    className="btn btn-sm py-0.5 px-2 border-0 fw-bold"
                    style={{
                      fontSize: "0.75rem",
                      borderRadius: "4px",
                      background: isSelected
                        ? "linear-gradient(135deg, #2563eb, #06b6d4)"
                        : "transparent",
                      color: isSelected ? "#ffffff" : "#94a3b8",
                      boxShadow: isSelected ? "0 0 8px rgba(56, 189, 248, 0.4)" : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {mer}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hour Selector (12 buttons in a clean 4x3 grid) */}
          <div className="mb-2.5">
            <div className="text-secondary fw-semibold mb-1" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
              SELECT HOUR
            </div>
            <div className="d-grid" style={{ gridTemplateColumns: "repeat(6, 1fr)", gap: "4px" }}>
              {HOURS.map((h) => {
                const isSelected = hour === h;
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleHourClick(h)}
                    className="btn btn-sm p-1 rounded-2 border-0 font-monospace fw-semibold"
                    style={{
                      fontSize: "0.78rem",
                      background: isSelected
                        ? "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)"
                        : "rgba(255, 255, 255, 0.05)",
                      color: isSelected ? "#ffffff" : "#cbd5e1",
                      boxShadow: isSelected ? "0 0 8px rgba(56, 189, 248, 0.4)" : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Minute Selector (00, 15, 30, 45 in a 4-column row) */}
          <div className="mb-3">
            <div className="text-secondary fw-semibold mb-1" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>
              SELECT MINUTE
            </div>
            <div className="d-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "4px" }}>
              {MINUTES.map((m) => {
                const isSelected = minute === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleMinuteClick(m)}
                    className="btn btn-sm p-1.5 rounded-2 border-0 font-monospace fw-semibold"
                    style={{
                      fontSize: "0.78rem",
                      background: isSelected
                        ? "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)"
                        : "rgba(255, 255, 255, 0.05)",
                      color: isSelected ? "#ffffff" : "#cbd5e1",
                      boxShadow: isSelected ? "0 0 8px rgba(56, 189, 248, 0.4)" : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    :{m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="d-flex justify-content-between align-items-center pt-2 border-top border-dark border-opacity-50">
            <button
              type="button"
              className="btn btn-sm btn-link text-secondary text-decoration-none p-0"
              style={{ fontSize: "0.75rem" }}
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              type="button"
              className="btn btn-sm btn-primary py-0.5 px-3 rounded-2 fw-semibold"
              style={{ fontSize: "0.75rem" }}
              onClick={() => {
                if (!value) {
                  emitTime(hour, minute, meridian);
                }
                setIsOpen(false);
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
