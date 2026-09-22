import React, { useState, useEffect, useRef } from "react";

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (dateStr: string) => void;
  minDate?: string; // YYYY-MM-DD
  isInvalid?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  minDate,
  isInvalid,
  placeholder = "Select Date",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial selected date or default to today
  const selectedDate = value ? new Date(`${value}T00:00:00`) : null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState<number>(
    selectedDate ? selectedDate.getFullYear() : today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState<number>(
    selectedDate ? selectedDate.getMonth() : today.getMonth()
  );

  // Sync view when value changes from outside
  useEffect(() => {
    if (value) {
      const d = new Date(`${value}T00:00:00`);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
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

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Generate days grid for viewMonth & viewYear
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const minDateTime = minDate ? new Date(`${minDate}T00:00:00`).getTime() : null;

  const handleSelectDay = (day: number) => {
    const monthStr = String(viewMonth + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const formatted = `${viewYear}-${monthStr}-${dayStr}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const handleSelectToday = () => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    const formatted = `${y}-${m}-${d}`;
    onChange(formatted);
    setViewYear(y);
    setViewMonth(today.getMonth());
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  // Format display text
  const formatDisplay = (val: string) => {
    if (!val) return "";
    const d = new Date(`${val}T00:00:00`);
    if (isNaN(d.getTime())) return val;
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
          <i className="bi bi-calendar3"></i>
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
            {value ? formatDisplay(value) : placeholder}
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

      {/* Glassmorphic Dropdown Popover */}
      {isOpen && (
        <div
          className="position-absolute mt-1 p-3 rounded-3 shadow-lg"
          style={{
            top: "100%",
            left: 0,
            zIndex: 1065,
            width: "300px",
            background: "linear-gradient(165deg, #090d16 0%, #030712 100%)",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            boxShadow:
              "0 20px 40px -10px rgba(0, 0, 0, 0.9), 0 0 25px rgba(56, 189, 248, 0.15)",
            backdropFilter: "blur(12px)",
            animation: "fadeInPicker 0.15s ease-out forwards",
          }}
        >
          {/* Header Month / Year Navigation */}
          <div className="d-flex justify-content-between align-items-center mb-2.5 pb-2 border-bottom border-dark border-opacity-50">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary p-1 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 28, height: 28, color: "#94a3b8" }}
              onClick={prevMonth}
            >
              <i className="bi bi-chevron-left" style={{ fontSize: "0.75rem" }}></i>
            </button>

            <span className="fw-bold text-white small" style={{ fontSize: "0.9rem" }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary p-1 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 28, height: 28, color: "#94a3b8" }}
              onClick={nextMonth}
            >
              <i className="bi bi-chevron-right" style={{ fontSize: "0.75rem" }}></i>
            </button>
          </div>

          {/* Weekday Names */}
          <div className="d-grid mb-1.5" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
            {DAYS_SHORT.map((d, i) => (
              <div
                key={d}
                className="text-center fw-semibold"
                style={{
                  fontSize: "0.72rem",
                  color: i === 0 || i === 6 ? "#f43f5e" : "#64748b",
                  padding: "4px 0",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="d-grid" style={{ gridTemplateColumns: "repeat(7, 1fr)", gap: "3px" }}>
            {/* Previous Month trailing days */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => {
              const dayNum = daysInPrevMonth - firstDayOfMonth + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="text-center d-flex align-items-center justify-content-center opacity-25 text-secondary"
                  style={{ height: 32, fontSize: "0.78rem" }}
                >
                  {dayNum}
                </div>
              );
            })}

            {/* Current Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const thisDate = new Date(viewYear, viewMonth, day);
              thisDate.setHours(0, 0, 0, 0);

              const isPast = minDateTime !== null && thisDate.getTime() < minDateTime;
              const isSelected =
                selectedDate &&
                selectedDate.getFullYear() === viewYear &&
                selectedDate.getMonth() === viewMonth &&
                selectedDate.getDate() === day;

              const isToday =
                today.getFullYear() === viewYear &&
                today.getMonth() === viewMonth &&
                today.getDate() === day;

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleSelectDay(day)}
                  className={`btn p-0 d-flex align-items-center justify-content-center rounded-circle border-0 position-relative transition-all`}
                  style={{
                    height: 32,
                    width: 32,
                    margin: "auto",
                    fontSize: "0.8rem",
                    fontWeight: isSelected ? 700 : 500,
                    background: isSelected
                      ? "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)"
                      : "transparent",
                    color: isSelected
                      ? "#ffffff"
                      : isPast
                      ? "#334155"
                      : "#e2e8f0",
                    border: isToday && !isSelected ? "1px solid #38bdf8" : "none",
                    boxShadow: isSelected
                      ? "0 0 12px rgba(56, 189, 248, 0.5)"
                      : "none",
                    cursor: isPast ? "not-allowed" : "pointer",
                    opacity: isPast ? 0.4 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && !isPast) {
                      e.currentTarget.style.background = "rgba(56, 189, 248, 0.15)";
                      e.currentTarget.style.color = "#38bdf8";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected && !isPast) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#e2e8f0";
                    }
                  }}
                >
                  {day}
                  {isToday && !isSelected && (
                    <span
                      className="position-absolute"
                      style={{
                        bottom: "2px",
                        width: "3px",
                        height: "3px",
                        borderRadius: "50%",
                        background: "#38bdf8",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Quick Selection */}
          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-dark border-opacity-50">
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
              className="btn btn-sm btn-outline-primary py-0.5 px-2 rounded-2"
              style={{ fontSize: "0.75rem" }}
              onClick={handleSelectToday}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
