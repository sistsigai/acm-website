import React, { useState, useEffect, useRef } from "react";

export interface CustomSelectOption {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  label?: string;
  icon?: string;
  hasError?: boolean;
  disabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  options,
  onChange,
  label = "Select",
  icon,
  hasError = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="position-relative w-100" ref={containerRef}>
      <button
        type="button"
        className={`custom-select-trigger w-100 d-flex align-items-center justify-content-between text-start ${
          hasError ? "is-invalid" : ""
        } ${isOpen ? "active" : ""}`}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
        }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span
          className="d-flex align-items-center text-truncate"
          style={{ gap: "10px" }}
        >
          {icon && (
            <i
              className={`bi ${icon} flex-shrink-0 ${
                selectedOption || isOpen ? "text-primary" : "text-secondary"
              }`}
              style={{ fontSize: "1rem", transition: "color 0.2s ease" }}
            ></i>
          )}
          <span
            className={`text-truncate ${
              selectedOption ? "text-white fw-medium" : "text-secondary"
            }`}
            style={{ fontSize: "0.875rem" }}
          >
            {selectedOption ? selectedOption.label : label}
          </span>
        </span>
        <i
          className="bi bi-chevron-down text-secondary"
          style={{
            fontSize: "0.8rem",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s ease",
            color: isOpen ? "#3b82f6" : undefined,
          }}
        ></i>
      </button>

      {isOpen && (
        <div
          className="custom-select-menu position-absolute start-0 end-0 overflow-hidden"
          style={{
            zIndex: 1080,
            top: "calc(100% + 6px)",
            overflowX: "hidden",
          }}
        >
          <div
            className="p-1.5 custom-scrollbar"
            style={{
              maxHeight: "230px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value}
                  className={`custom-select-item d-flex align-items-center justify-content-between gap-2 ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="text-truncate flex-grow-1">{option.label}</span>
                  {isSelected && (
                    <i
                      className="bi bi-check2-circle text-primary flex-shrink-0"
                      style={{ fontSize: "0.95rem" }}
                    ></i>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;