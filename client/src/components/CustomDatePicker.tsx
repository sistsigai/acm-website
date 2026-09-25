import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (dateStr: string) => void;
  minDate?: string; // YYYY-MM-DD
  maxDate?: string; // YYYY-MM-DD
  isInvalid?: boolean;
  placeholder?: string;
  disabled?: boolean;
  placement?: "auto" | "top" | "bottom";
  align?: "auto" | "left" | "right";
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
  maxDate,
  isInvalid,
  placeholder = "Select Date",
  disabled = false,
  placement = "auto",
  align = "auto",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState<{ top?: number; bottom?: number; left: number }>({ left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

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

  // Compute fixed position relative to viewport
  const updatePosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const popoverWidth = 280;
    const popoverHeight = 285; // Actual rendered height of date picker

    // Check vertical room
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const showAbove =
      placement === "top" ||
      (placement === "auto" && spaceBelow < popoverHeight + 8 && spaceAbove > spaceBelow);

    const newPos: { top?: number; bottom?: number; left: number } = { left: 0 };

    if (showAbove) {
      // Anchored directly 6px above trigger input
      newPos.bottom = Math.max(8, window.innerHeight - rect.top + 6);
    } else {
      // Anchored directly 6px below trigger input
      newPos.top = Math.max(8, rect.bottom + 6);
    }

    // Check horizontal room
    let left: number;
    if (align === "right") {
      left = rect.right - popoverWidth;
    } else if (align === "left") {
      left = rect.left;
    } else {
      if (rect.left + popoverWidth > window.innerWidth - 15) {
        left = rect.right - popoverWidth;
      } else {
        left = rect.left;
      }
    }

    // Keep left fully within visible screen
    newPos.left = Math.max(8, Math.min(window.innerWidth - popoverWidth - 8, left));

    setPopoverPos(newPos);
  };

  // Keep position synced with scrolls / window resizes
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleScrollOrResize = () => {
        updatePosition();
      };
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
      return () => {
        window.removeEventListener("scroll", handleScrollOrResize, true);
        window.removeEventListener("resize", handleScrollOrResize);
      };
    }
  }, [isOpen, placement, align]);

  // Click outside listener covering both trigger container and portal popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
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
  const maxDateTime = maxDate ? new Date(`${maxDate}T00:00:00`).getTime() : null;

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
        onClick={() => {
          if (!disabled) {
            if (!isOpen) updatePosition();
            setIsOpen(!isOpen);
          }
        }}
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

      {/* Simplified Dropdown Popover matching CustomTimePicker rendered in document.body */}
      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            className="p-3 rounded-3 shadow-lg"
            style={{
              position: "fixed",
              ...(popoverPos.bottom !== undefined
                ? { bottom: `${popoverPos.bottom}px` }
                : { top: `${popoverPos.top}px` }),
              left: `${popoverPos.left}px`,
              zIndex: 999999,
              width: "280px",
              background: "linear-gradient(165deg, #090d16 0%, #030712 100%)",
              border: "1px solid rgba(56, 189, 248, 0.25)",
              boxShadow:
                "0 20px 40px -10px rgba(0, 0, 0, 0.95), 0 0 25px rgba(56, 189, 248, 0.15)",
              backdropFilter: "blur(12px)",
              animation: "fadeInPicker 0.15s ease-out forwards",
            }}
          >
            {/* Digital Date Header */}
            <div
              className="d-flex align-items-center justify-content-between mb-2.5 py-1.5 px-3 rounded-2"
              style={{
                background: "rgba(15, 23, 42, 0.9)",
                border: "1px solid rgba(56, 189, 248, 0.25)",
              }}
            >
              <span className="fw-bold text-white small font-monospace" style={{ fontSize: "0.85rem" }}>
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>

              <div className="d-flex gap-1">
                <button
                  type="button"
                  className="btn btn-sm btn-icon text-secondary p-1 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 24, height: 24, color: "#94a3b8" }}
                  onClick={prevMonth}
                >
                  <i className="bi bi-chevron-left" style={{ fontSize: "0.75rem" }}></i>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-icon text-secondary p-1 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 24, height: 24, color: "#94a3b8" }}
                  onClick={nextMonth}
                >
                  <i className="bi bi-chevron-right" style={{ fontSize: "0.75rem" }}></i>
                </button>
              </div>
            </div>

            {/* Weekday Names */}
            <div className="d-grid mb-1" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
              {DAYS_SHORT.map((d, i) => (
                <div
                  key={d}
                  className="text-center fw-semibold"
                  style={{
                    fontSize: "0.7rem",
                    color: i === 0 || i === 6 ? "#f43f5e" : "#64748b",
                    padding: "2px 0",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="d-grid text-center" style={{ gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
              {/* Previous Month trailing days */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => {
                const dayNum = daysInPrevMonth - firstDayOfMonth + i + 1;
                return (
                  <div
                    key={`prev-${i}`}
                    className="text-center d-flex align-items-center justify-content-center opacity-25 text-secondary"
                    style={{ height: 28, fontSize: "0.75rem" }}
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

                const isPast = (minDateTime !== null && thisDate.getTime() < minDateTime) ||
                               (maxDateTime !== null && thisDate.getTime() > maxDateTime);
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
                      height: 28,
                      width: 28,
                      margin: "auto",
                      fontSize: "0.78rem",
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
                        ? "0 0 10px rgba(56, 189, 248, 0.5)"
                        : "none",
                      cursor: isPast ? "not-allowed" : "pointer",
                      opacity: isPast ? 0.35 : 1,
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

            {/* Footer Controls matching CustomTimePicker */}
            <div className="d-flex justify-content-between align-items-center mt-2.5 pt-2 border-top border-dark border-opacity-50">
              <div className="d-flex gap-2">
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
                  className="btn btn-sm btn-link text-info text-decoration-none p-0"
                  style={{ fontSize: "0.75rem" }}
                  onClick={handleSelectToday}
                >
                  Today
                </button>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-primary py-0.5 px-3 rounded-2 fw-semibold"
                style={{ fontSize: "0.75rem" }}
                onClick={() => setIsOpen(false)}
              >
                Done
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default CustomDatePicker;
