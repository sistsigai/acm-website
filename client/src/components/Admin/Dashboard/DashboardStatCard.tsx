import React from "react";
import { motion as m } from "framer-motion";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColor: string;
  bgGlow?: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant: "success" | "warning" | "info" | "primary" | "secondary" | "danger";
  };
  onClick?: () => void;
}

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  icon,
  iconColor,
  subtitle,
  badge,
  onClick,
}) => {
  return (
    <m.div
      className="glass-panel rounded-4 p-4 h-100 d-flex flex-column justify-content-between"
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      style={{
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <span className="text-secondary small text-uppercase fw-semibold tracking-wider">
          {title}
        </span>
        <div
          className="d-flex align-items-center justify-content-center rounded-3 p-2"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: iconColor,
            width: 42,
            height: 42,
          }}
        >
          <i className={`bi ${icon} fs-5`}></i>
        </div>
      </div>

      <div>
        <h3 className="fw-bold text-white mb-2">{value}</h3>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {badge && (
            <span className={`admin-badge admin-badge-${badge.variant || "primary"}`}>
              {badge.text}
            </span>
          )}
          {subtitle && <span className="text-secondary small">{subtitle}</span>}
        </div>
      </div>
    </m.div>
  );
};

export default DashboardStatCard;
