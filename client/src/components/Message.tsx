import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children }: { children: React.ReactNode }) => {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
};

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

interface MessageProps {
  variant?: "success" | "error" | "warning" | "info";
  show?: boolean;
  onClose?: () => void;
  duration?: number;
  dismissible?: boolean;
  children: React.ReactNode;
  className?: string;
  position?: ToastPosition;
  title?: string; // Optional title for better hierarchy
}

const Message: React.FC<MessageProps> = ({
  variant = "info",
  show = true,
  onClose,
  duration = 4500,
  dismissible = true,
  children,
  className = "",
  position = "top-right",
  title,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationDuration = 600;

  // --- Configuration ---
  // We use shadow colors instead of borders for the "Glow" effect
  const config = {
    success: { 
      color: "#10B981", 
      icon: "bi-check-circle-fill", 
      shadow: "0 10px 40px -10px rgba(16, 185, 129, 0.5)",
      gradient: "linear-gradient(90deg, #10B981, #34D399)"
    },
    error: { 
      color: "#EF4444", 
      icon: "bi-x-circle-fill", 
      shadow: "0 10px 40px -10px rgba(239, 68, 68, 0.5)",
      gradient: "linear-gradient(90deg, #EF4444, #F87171)"
    },
    warning: { 
      color: "#F59E0B", 
      icon: "bi-exclamation-triangle-fill", 
      shadow: "0 10px 40px -10px rgba(245, 158, 11, 0.5)",
      gradient: "linear-gradient(90deg, #F59E0B, #FBBF24)"
    },
    info: { 
      color: "#3B82F6", 
      icon: "bi-info-circle-fill", 
      shadow: "0 10px 40px -10px rgba(59, 130, 246, 0.5)",
      gradient: "linear-gradient(90deg, #3B82F6, #60A5FA)"
    },
  }[variant];

  // --- Lifecycle ---
  useEffect(() => {
    if (show) {
      requestAnimationFrame(() => setTimeout(() => setIsMounted(true), 10));
    } else {
      setIsMounted(false);
    }
  }, [show]);

  useEffect(() => {
    if (show && duration && !isHovered && isMounted) {
      closeTimerRef.current = setTimeout(() => handleTriggerClose(), duration);
    }
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [show, duration, isHovered, isMounted]);

  const handleTriggerClose = () => {
    setIsMounted(false);
    setTimeout(() => onClose?.(), animationDuration);
  };

  if (!show) return null;

  // --- Positioning ---
  const getPositionStyles = (): React.CSSProperties => {
    const margin = "20px";
    const base: React.CSSProperties = {
      position: "fixed",
      zIndex: 10000,
      margin: margin,
      transform: position.includes("top") ? "translateY(-40px) scale(0.95)" : "translateY(40px) scale(0.95)",
    };

    const activeTransform = position.includes("center") ? "translate(-50%, 0) scale(1)" : "translateY(0) scale(1)";
    
    if (isMounted) {
      if (position.includes("center")) {
        base.transform = activeTransform;
        base.left = "50%"; 
        base.margin = 0; 
        base.marginTop = margin; 
        base.marginBottom = margin;
      } else {
        base.transform = activeTransform;
      }
    } else if (position.includes("center")) {
        // Offscreen position for center
        base.left = "50%";
        base.margin = 0;
        base.transform = position.includes("top") ? "translate(-50%, -50px) scale(0.9)" : "translate(-50%, 50px) scale(0.9)";
    }

    switch (position) {
      case "top-right": return { ...base, top: 0, right: 0 };
      case "top-left": return { ...base, top: 0, left: 0 };
      case "bottom-right": return { ...base, bottom: 0, right: 0 };
      case "bottom-left": return { ...base, bottom: 0, left: 0 };
      case "top-center": return { ...base, top: 0 };
      case "bottom-center": return { ...base, bottom: 0 };
      default: return base;
    }
  };

  return (
    <Portal>
      <div
        className={`glass-toast-container d-flex flex-column overflow-hidden ${isMounted ? "enter" : ""} ${className}`}
        style={{
          ...getPositionStyles(),
          width: "380px",
          maxWidth: "90vw",
          // The "Glow" comes from the shadow, not a border
          boxShadow: isMounted ? `${config.shadow}, 0 8px 32px 0 rgba(31, 38, 135, 0.1)` : 'none'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="alert"
      >
        <div className="d-flex align-items-start p-4">
            {/* Glossy Icon */}
            <div 
                className="d-flex justify-content-center align-items-center flex-shrink-0 me-3 rounded-circle"
                style={{
                    width: "38px", 
                    height: "38px",
                    background: config.gradient,
                    boxShadow: `0 4px 10px rgba(0,0,0,0.15)`,
                    color: "white"
                }}
            >
                <i className={`bi ${config.icon} fs-5`}></i>
            </div>

            {/* Content Area */}
            <div className="flex-grow-1">
                {title && <div className="glass-text-title mb-1">{title}</div>}
                <div className="glass-text-body" style={{ fontSize: "0.925rem", lineHeight: "1.5" }}>
                    {children}
                </div>
            </div>

            {/* Close Button */}
            {dismissible && onClose && (
                <button
                    type="button"
                    className="btn-close ms-2"
                    aria-label="Close"
                    onClick={handleTriggerClose}
                    style={{ fontSize: "0.75rem", opacity: 0.6 }}
                ></button>
            )}
        </div>

        {/* Progress Bar */}
        {duration && (
            <div className="glass-progress-track">
                <div
                    style={{
                        height: "100%",
                        background: config.gradient,
                        animation: `toastProgress ${duration}ms linear forwards`,
                        animationPlayState: isHovered || !isMounted ? "paused" : "running",
                        borderRadius: "0 4px 4px 0",
                        position: "relative",
                        overflow: "hidden"
                    }}
                >
                    {/* Shimmer overlay */}
                    <div 
                        style={{
                            position: "absolute",
                            top: 0, left: 0, bottom: 0, width: "100%",
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                            animation: "shimmer 2s infinite"
                        }}
                    ></div>
                </div>
            </div>
        )}
      </div>
    </Portal>
  );
};

export default Message;