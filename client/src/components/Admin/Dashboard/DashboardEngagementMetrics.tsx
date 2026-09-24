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
  return (
    <div className="glass-panel p-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold text-white m-0">
          <i className="bi bi-graph-up-arrow text-success me-2"></i>
          Engagement Metrics
        </h5>
      </div>

      <div className="row g-4">
        {/* Registration Progress */}
        <div className="col-12 col-md-4">
          <div className="border border-secondary border-opacity-25 rounded-3 p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="text-white m-0">Event Registrations Today</h6>
              <span
                className={`badge ${
                  stats.registrationRate > 0
                    ? "bg-success bg-opacity-25 text-success"
                    : stats.registrationRate < 0
                    ? "bg-danger bg-opacity-25 text-danger"
                    : "bg-secondary bg-opacity-25 text-secondary"
                }`}
              >
                {stats.registrationRate > 0 ? "+" : ""}
                {stats.registrationRate}%
              </span>
            </div>
            <div className="d-flex align-items-center gap-3">
              <h2 className="fw-bold text-white m-0">{stats.todayRegistrations}</h2>
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
                        (stats.todayRegistrations / Math.max(stats.totalMembers, 1)) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
                <small className="text-secondary">Today's registrations</small>
              </div>
            </div>
          </div>
        </div>

        {/* Most Popular Event */}
        <div className="col-12 col-md-4">
          <div className="border border-secondary border-opacity-25 rounded-3 p-3">
            <h6 className="text-white mb-2">Most Popular Event</h6>
            {topPerformers.topEvent ? (
              <>
                <h5 className="text-white fw-bold">{topPerformers.topEvent.name}</h5>
                <div className="d-flex align-items-center gap-3">
                  <span className="badge bg-primary">
                    {topPerformers.topEvent.registrations} registrations
                  </span>
                  <small className="text-secondary">All time best</small>
                </div>
              </>
            ) : (
              <p className="text-secondary m-0">No event data available</p>
            )}
          </div>
        </div>

        {/* Member Growth Rate */}
        <div className="col-12 col-md-4">
          <div className="border border-secondary border-opacity-25 rounded-3 p-3">
            <h6 className="text-white mb-2">Member Growth Rate</h6>
            <div className="d-flex align-items-center gap-3">
              <h2 className="fw-bold text-white m-0">
                {stats.memberGrowthRate > 0 ? "+" : ""}
                {stats.memberGrowthRate}%
              </h2>
              <div>
                <div
                  className="progress bg-dark"
                  style={{ height: "6px", width: "120px", borderRadius: "4px", overflow: "hidden" }}
                >
                  <div
                    className="progress-bar bg-primary"
                    style={{
                      width: `${Math.min(100, Math.abs(stats.memberGrowthRate))}%`,
                    }}
                  ></div>
                </div>
                <small className="text-secondary">vs yesterday</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEngagementMetrics;
