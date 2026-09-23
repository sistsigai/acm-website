import React from "react";
import type { Activity, DashboardResponse } from "../../../services/admin/dashboardService";

export const formatTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

interface DashboardRecentActivityProps {
  activities: Array<Activity & { icon: string; color: string }>;
  systemHealth: DashboardResponse["systemHealth"];
  loading: boolean;
  onSync: () => void;
}

export const DashboardRecentActivity: React.FC<DashboardRecentActivityProps> = ({
  activities,
  systemHealth,
  loading,
  onSync,
}) => {
  return (
    <div className="glass-panel p-4 h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold text-white m-0">
          <i className="bi bi-clock-history text-warning me-2"></i>
          Recent Activity
        </h5>
      </div>

      <ul className="list-unstyled m-0 d-flex flex-column gap-3 flex-grow-1">
        {activities
          .filter((a) => a.type !== "contact_message")
          .slice(0, 4)
          .map((a, i) => (
            <li key={i} className="p-2 rounded-3" style={{ background: "rgba(255, 255, 255, 0.02)" }}>
              <div className="d-flex align-items-start gap-2">
                <i className={`bi ${a.icon} ${a.color} mt-1`}></i>
                <div className="flex-grow-1">
                  <h6 className="text-white m-0">{a.title}</h6>
                  <span className="text-secondary small">{a.subtitle}</span>
                  <div className="text-secondary small">{formatTimeAgo(a.time)}</div>
                </div>
              </div>
            </li>
          ))}
      </ul>

      {/* System Health Panel */}
      <div className="mt-4 pt-3 border-top border-white border-opacity-10">
        <h6 className="text-white mb-3">
          <i className="bi bi-heart-pulse text-danger me-2"></i>
          System Health
        </h6>

        <div className="row g-2 mb-3">
          <div className="col-6">
            <small className="text-secondary d-block">API Status</small>
            <small className="text-success fw-bold">{systemHealth.apiStatus.toUpperCase()}</small>
          </div>
          <div className="col-6">
            <small className="text-secondary d-block">Database</small>
            <small className="text-success fw-bold">{systemHealth.dbStatus.toUpperCase()}</small>
          </div>
          <div className="col-6">
            <small className="text-secondary d-block">Last Sync</small>
            <small className="text-white d-block">
              {new Date(systemHealth.lastSync).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </div>
          <div className="col-6">
            <small className="text-secondary d-block">Uptime</small>
            <small className="text-white d-block">{systemHealth.uptime}</small>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-outline-light btn-sm w-100 rounded-pill"
          onClick={onSync}
          disabled={loading}
        >
          {loading ? (
            <>
              Syncing... <i className="bi bi-arrow-repeat ms-1"></i>
            </>
          ) : (
            <>
              Sync Now <i className="bi bi-arrow-repeat ms-1"></i>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DashboardRecentActivity;
