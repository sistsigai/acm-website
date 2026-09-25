import React from "react";
import type { DashboardResponse } from "../../../services/admin/dashboardService";

interface DashboardEngagementMetricsProps {
  stats: DashboardResponse["stats"];
  topPerformers: DashboardResponse["topPerformers"];
}

export const DashboardEngagementMetrics: React.FC<DashboardEngagementMetricsProps> = ({
  stats,
  topPerformers,
}) => {
  const regRate = stats.registrationRate ?? 0;
  const growthRate = stats.memberGrowthRate ?? 0;

  return (
    <div className="glass-panel rounded-4 p-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold text-white m-0">
          <i className="bi bi-graph-up-arrow text-primary me-2"></i>
          Engagement Metrics
        </h5>
      </div>

      <div className="row g-4">
        {/* Registration Progress */}
        <div className="col-12 col-md-4">
          <div className="border border-secondary border-opacity-25 rounded-3 p-3 h-100 d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="text-white m-0 small fw-medium">Event Registrations Today</h6>
              <span
                className={`admin-badge ${
                  regRate > 0
                    ? "admin-badge-success"
                    : regRate < 0
                    ? "admin-badge-danger"
                    : "admin-badge-secondary"
                }`}
              >
                {regRate > 0 ? "+" : ""}
                {regRate}%
              </span>
            </div>
            <div className="d-flex align-items-center gap-3 mt-2">
              <h2 className="fw-bold text-white m-0">{stats.todayRegistrations ?? 0}</h2>
              <div className="flex-grow-1">
                <div
                  className="progress bg-dark"
                  style={{ height: "6px", borderRadius: "4px", overflow: "hidden" }}
                >
                  <div
                    className="progress-bar bg-success"
                    style={{
                      width: `${Math.min(
                        100,
                        ((stats.todayRegistrations ?? 0) / Math.max(stats.totalMembers || 1, 1)) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
                <small className="text-secondary d-block mt-1">Today's registrations</small>
              </div>
            </div>
          </div>
        </div>

        {/* Most Popular Event */}
        <div className="col-12 col-md-4">
          <div className="border border-secondary border-opacity-25 rounded-3 p-3 h-100 d-flex flex-column justify-content-between">
            <h6 className="text-white mb-2 small fw-medium">Most Popular Event</h6>
            {topPerformers.topEvent ? (
              <>
                <h5 className="text-white fw-bold text-truncate mb-2">{topPerformers.topEvent.name}</h5>
                <div className="d-flex align-items-center gap-2">
                  <span className="admin-badge admin-badge-primary">
                    {topPerformers.topEvent.registrations} registrations
                  </span>
                  <small className="text-secondary">All time best</small>
                </div>
              </>
            ) : (
              <p className="text-secondary m-0 small">No event data available</p>
            )}
          </div>
        </div>

        {/* Member Growth Rate */}
        <div className="col-12 col-md-4">
          <div className="border border-secondary border-opacity-25 rounded-3 p-3 h-100 d-flex flex-column justify-content-between">
            <h6 className="text-white mb-2 small fw-medium">Member Growth Rate</h6>
            <div className="d-flex align-items-center gap-3 mt-2">
              <h2 className="fw-bold text-white m-0">
                {growthRate > 0 ? "+" : ""}
                {growthRate}%
              </h2>
              <div>
                <div
                  className="progress bg-dark"
                  style={{ height: "6px", width: "120px", borderRadius: "4px", overflow: "hidden" }}
                >
                  <div
                    className="progress-bar bg-primary"
                    style={{
                      width: `${Math.min(100, Math.abs(growthRate))}%`,
                    }}
                  ></div>
                </div>
                <small className="text-secondary d-block mt-1">vs yesterday</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEngagementMetrics;
