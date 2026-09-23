import React from "react";
import type { DashboardResponse } from "../../../services/admin/dashboardService";

interface DashboardUpcomingEventProps {
  latestEvent: DashboardResponse["latestEvent"];
}

export const DashboardUpcomingEvent: React.FC<DashboardUpcomingEventProps> = ({
  latestEvent,
}) => {
  if (!latestEvent) return null;

  return (
    <div className="glass-panel p-4 h-100 d-flex flex-column">
      <h5 className="fw-bold text-white mb-3">
        <i className="bi bi-calendar-event text-primary me-2"></i>
        Next Upcoming Event
      </h5>

      <div className="border border-secondary border-opacity-25 rounded-3 p-3 flex-grow-1">
        <div className="row">
          <div className="col-12">
            <h6 className="text-white mb-2 fs-5">{latestEvent.name}</h6>

            <div className="mb-3">
              <span className="badge bg-success">
                {latestEvent.totalRegistrations} Registered
              </span>
            </div>

            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-calendar3 text-primary"></i>
              <small className="text-secondary">{latestEvent.date}</small>
            </div>

            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-clock text-primary"></i>
              <small className="text-secondary">{latestEvent.time}</small>
            </div>

            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-geo-alt text-primary"></i>
              <small className="text-secondary">{latestEvent.venue}</small>
            </div>
          </div>

          {/* Contact Persons */}
          {latestEvent.contactPersons && latestEvent.contactPersons.length > 0 && (
            <div className="col-12 mt-3">
              <h6 className="text-white mb-2">
                <i className="bi bi-telephone-fill text-primary me-2"></i>
                Contact Persons
              </h6>

              <div className="d-flex flex-column gap-2">
                {latestEvent.contactPersons.map((cp, idx) => (
                  <div
                    key={idx}
                    className="d-flex justify-content-between align-items-center px-3 py-2 rounded-3"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <span className="text-white fw-semibold">{cp.name}</span>
                    <span className="text-primary small">{cp.phone}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardUpcomingEvent;
