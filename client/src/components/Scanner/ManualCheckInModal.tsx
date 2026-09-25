import React, { useState, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import type { AttendeeRecord } from "../../services/admin/eventService";

interface ManualCheckInModalProps {
  show: boolean;
  onClose: () => void;
  registrations: AttendeeRecord[];
  onToggleAttendance: (attendee: AttendeeRecord) => Promise<void>;
  eventName: string;
}

export const ManualCheckInModal: React.FC<ManualCheckInModalProps> = ({
  show,
  onClose,
  registrations,
  onToggleAttendance,
  eventName,
}) => {
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredList = useMemo(() => {
    if (!search.trim()) return registrations.slice(0, 30); // show top 30 by default
    const q = search.toLowerCase().trim();
    return registrations.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.registerNo?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.phone?.toLowerCase().includes(q)
    );
  }, [registrations, search]);

  const handleCheckIn = async (attendee: AttendeeRecord) => {
    try {
      setUpdatingId(attendee._id);
      await onToggleAttendance(attendee);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <m.div
        className="position-fixed d-flex align-items-end justify-content-center"
        style={{
          inset: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 9999,
          padding: "16px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <m.div
          className="w-100 p-3 p-md-4 rounded-4 overflow-hidden position-relative d-flex flex-column"
          style={{
            maxWidth: "600px",
            maxHeight: "85vh",
            background: "#0c1322",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)",
            color: "#f8fafc",
          }}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary border-opacity-25 flex-shrink-0">
            <div>
              <h5 className="fw-bold text-white mb-0" style={{ fontSize: "1.1rem" }}>
                Manual Attendee Search
              </h5>
              <small className="text-secondary">{eventName}</small>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-link text-secondary text-decoration-none p-1"
              onClick={onClose}
            >
              <i className="bi bi-x-lg fs-5"></i>
            </button>
          </div>

          {/* Search Box */}
          <div className="position-relative mb-3 flex-shrink-0">
            <i
              className="bi bi-search position-absolute text-secondary"
              style={{ top: "50%", left: "14px", transform: "translateY(-50%)", fontSize: "0.9rem" }}
            />
            <input
              type="text"
              className="form-control text-white ps-5 pe-5 py-2 rounded-3"
              style={{
                background: "#060911",
                border: "1px solid #1e293b",
                fontSize: "0.9rem",
              }}
              placeholder="Search by name, reg no, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            {search && (
              <button
                type="button"
                className="btn btn-sm btn-link text-secondary position-absolute end-0 top-50 translate-middle-y me-2 p-0 text-decoration-none"
                onClick={() => setSearch("")}
              >
                <i className="bi bi-x-circle-fill"></i>
              </button>
            )}
          </div>

          {/* Results List */}
          <div
            className="flex-grow-1 overflow-y-auto d-flex flex-column gap-2 pe-1"
            style={{ minHeight: "200px" }}
          >
            {filteredList.length === 0 ? (
              <div className="text-center py-5 text-secondary">
                <i className="bi bi-person-x fs-2 opacity-50 mb-2"></i>
                <p className="small mb-0">No matching attendee registrations found.</p>
              </div>
            ) : (
              filteredList.map((attendee) => {
                const isUpdating = updatingId === attendee._id;
                return (
                  <div
                    key={attendee._id}
                    className="p-3 rounded-3 d-flex align-items-center justify-content-between gap-2"
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <div className="text-truncate flex-grow-1">
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-semibold text-white text-truncate">{attendee.name}</span>
                        {attendee.entry ? (
                          <span
                            className="badge px-2 py-0.5"
                            style={{
                              background: "rgba(34, 197, 94, 0.15)",
                              color: "#4ade80",
                              fontSize: "0.68rem",
                            }}
                          >
                            Present
                          </span>
                        ) : (
                          <span
                            className="badge px-2 py-0.5"
                            style={{
                              background: "rgba(148, 163, 184, 0.15)",
                              color: "#94a3b8",
                              fontSize: "0.68rem",
                            }}
                          >
                            Absent
                          </span>
                        )}
                      </div>
                      <div className="text-info small font-monospace mt-0.5">
                        {attendee.registerNo || "N/A"}
                        {attendee.dept && ` • ${attendee.dept}`}
                      </div>
                      <div className="text-secondary small font-monospace text-truncate">
                        {attendee.email}
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`btn btn-sm px-3 py-1.5 rounded-2 fw-semibold flex-shrink-0 ${
                        attendee.entry
                          ? "btn-outline-danger"
                          : "btn-success"
                      }`}
                      style={{ fontSize: "0.78rem" }}
                      onClick={() => handleCheckIn(attendee)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : attendee.entry ? (
                        "Mark Absent"
                      ) : (
                        "Check In"
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </m.div>
      </m.div>
    </AnimatePresence>
  );
};

export default ManualCheckInModal;
