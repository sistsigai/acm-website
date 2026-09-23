import React from "react";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColor: string;
  bgGlow?: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant: "success" | "warning" | "info" | "primary";
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
    <div
      className="glass-panel p-4 h-100 d-flex flex-column justify-content-between"
      style={{
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
        <h3 className="fw-bold text-white mb-1">{value}</h3>
        <div className="d-flex align-items-center gap-2">
          {badge && (
            <span
              className={`badge bg-${badge.variant} bg-opacity-20 text-${badge.variant} px-2 py-1 rounded-2`}
              style={{ fontSize: "0.75rem" }}
            >
              {badge.text}
            </span>
          )}
          {subtitle && <span className="text-secondary small">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
};

export default DashboardStatCard;
