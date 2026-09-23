import React from "react";
import { useNavigate } from "react-router-dom";
import type { DashboardResponse } from "../../../services/admin/dashboardService";

interface DashboardOngoingRecruitmentsProps {
  ongoingRecruitments: DashboardResponse["ongoingRecruitments"];
}

export const DashboardOngoingRecruitments: React.FC<DashboardOngoingRecruitmentsProps> = ({
  ongoingRecruitments,
}) => {
  const navigate = useNavigate();

  return (
    <div className="glass-panel p-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold text-white m-0">
          <i className="bi bi-list-task text-primary me-2"></i>
          Ongoing Recruitments
        </h5>
        <button
          type="button"
          className="btn btn-sm btn-link text-decoration-none text-secondary"
          onClick={() => navigate("/admin/recruitments")}
        >
          Manage All <i className="bi bi-arrow-right ms-1"></i>
        </button>
      </div>

      <div className="row g-3">
        {ongoingRecruitments.length === 0 ? (
          <p className="text-secondary text-center py-4">No open recruitments</p>
        ) : (
          ongoingRecruitments.map((rec) => (
            <div key={rec._id} className="col-12 col-md-6 col-lg-4">
              <div className="border border-secondary border-opacity-25 rounded-3 p-3 h-100 d-flex flex-column">
                <h6 className="text-white mb-1">{rec.title}</h6>
                <span className="badge bg-primary text-white mb-2 align-self-start">
                  {rec.role}
                </span>

                <div className="mb-2">
                  <span className="badge bg-success">{rec.applicantCount} applicants</span>
                </div>

                <div className="text-secondary small mt-auto">
                  Opened on{" "}
                  {new Date(rec.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>

                {rec.deadline &&
                  new Date(rec.deadline).getTime() - Date.now() < 86400000 * 3 && (
                    <div className="mt-2">
                      <small className="text-warning">
                        <i className="bi bi-clock me-1"></i>
                        Deadline approaching
                      </small>
                    </div>
                  )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardOngoingRecruitments;
