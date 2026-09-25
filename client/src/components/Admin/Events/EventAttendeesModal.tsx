import React, { useState, useEffect, useMemo } from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import type { AdminEvent } from "./EventCard";
import {
  getEventRegistrations,
  toggleRegistrationAttendance,
  deleteEventRegistration,
  exportEventRegistrationsCsv,
  type AttendeeRecord,
  type AttendanceMetrics,
} from "../../../services/admin/eventService";
import { ConfirmModal } from "../../Common/ConfirmModal";

interface EventAttendeesModalProps {
  event: AdminEvent | null;
  onClose: () => void;
  showToast?: (message: string, variant: "success" | "error" | "info" | "warning") => void;
}

export const EventAttendeesModal: React.FC<EventAttendeesModalProps> = ({
  event,
  onClose,
  showToast,
}) => {
  if (!event) return null;

  const [registrations, setRegistrations] = useState<AttendeeRecord[]>([]);
  const [metrics, setMetrics] = useState<AttendanceMetrics>({
    totalRegistered: 0,
    totalPresent: 0,
    totalAbsent: 0,
    attendanceRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "present" | "absent">("all");
  const [selectedAttendeeAnswers, setSelectedAttendeeAnswers] = useState<AttendeeRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AttendeeRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load Registrations
  const fetchAttendees = async () => {
    try {
      setLoading(true);
      const res = await getEventRegistrations(event._id);
      if (res?.success) {
        setRegistrations(res.registrations);
        setMetrics(res.metrics);
      }
    } catch (err: any) {
      console.error("Failed to load attendees:", err);
      showToast?.("Failed to fetch attendees list.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, [event._id]);

  // Filtered Roster
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((att) => {
      const matchSearch =
        !searchTerm.trim() ||
        att.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        att.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        att.registerNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (att.phone && att.phone.includes(searchTerm));

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "present" && att.entry) ||
        (statusFilter === "absent" && !att.entry);

      return matchSearch && matchStatus;
    });
  }, [registrations, searchTerm, statusFilter]);

  // Toggle Attendance
  const handleToggleAttendance = async (attendee: AttendeeRecord) => {
    try {
      const newStatus = !attendee.entry;
      const res = await toggleRegistrationAttendance(attendee._id, newStatus);
      if (res?.success) {
        setRegistrations((prev) =>
          prev.map((a) =>
            a._id === attendee._id
              ? { ...a, entry: newStatus, checkedInAt: newStatus ? new Date().toISOString() : undefined }
              : a
          )
        );
        setMetrics((prev) => {
          const newPresent = newStatus ? prev.totalPresent + 1 : Math.max(0, prev.totalPresent - 1);
          const newAbsent = prev.totalRegistered - newPresent;
          const newRate = prev.totalRegistered > 0 ? Math.round((newPresent / prev.totalRegistered) * 100) : 0;
          return {
            ...prev,
            totalPresent: newPresent,
            totalAbsent: newAbsent,
            attendanceRate: newRate,
          };
        });
        showToast?.(`Marked ${attendee.name} as ${newStatus ? "Present" : "Absent"}`, "success");
      }
    } catch (err: any) {
      showToast?.("Failed to update attendee status.", "error");
    }
  };

  // Delete Attendee Registration
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await deleteEventRegistration(deleteTarget._id);
      if (res?.success) {
        setRegistrations((prev) => prev.filter((r) => r._id !== deleteTarget._id));
        setMetrics((prev) => {
          const wasPresent = deleteTarget.entry;
          const newRegistered = Math.max(0, prev.totalRegistered - 1);
          const newPresent = wasPresent ? Math.max(0, prev.totalPresent - 1) : prev.totalPresent;
          const newAbsent = Math.max(0, newRegistered - newPresent);
          const newRate = newRegistered > 0 ? Math.round((newPresent / newRegistered) * 100) : 0;
          return {
            totalRegistered: newRegistered,
            totalPresent: newPresent,
            totalAbsent: newAbsent,
            attendanceRate: newRate,
          };
        });
        showToast?.("Attendee registration deleted successfully.", "success");
      }
    } catch (err: any) {
      console.error("Failed to delete attendee:", err);
      showToast?.(err.message || "Failed to delete attendee registration.", "error");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  // Export CSV
  const handleExportCsv = async () => {
    try {
      await exportEventRegistrationsCsv(event._id, event.name);
      showToast?.("Exported attendees roster successfully.", "success");
    } catch (err) {
      showToast?.("Failed to export attendees CSV.", "error");
    }
  };

  return (
    <AnimatePresence>
      <m.div
        className="admin-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <m.div
          className="admin-modal-container p-3 p-md-4"
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ type: "spring", stiffness: 320, damping: 25 }}
          style={{
            maxWidth: "1240px",
            width: "96%",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(165deg, #0f172a 0%, #090d16 100%)",
            borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-dark border-opacity-50 flex-shrink-0">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  background: "rgba(56, 189, 248, 0.15)",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  color: "#38bdf8",
                }}
              >
                <i className="bi bi-people-fill fs-5"></i>
              </div>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h5 className="m-0 fw-bold text-white tracking-tight" style={{ fontSize: "1.2rem" }}>
                    Event Attendance
                  </h5>
                  <span
                    className="badge rounded-pill px-2.5 py-1"
                    style={{
                      fontSize: "0.75rem",
                      background: "rgba(56, 189, 248, 0.15)",
                      border: "1px solid rgba(56, 189, 248, 0.4)",
                      color: "#38bdf8",
                      fontWeight: 600,
                      letterSpacing: "0.3px",
                    }}
                  >
                    {event.name}
                  </span>
                </div>
                <p className="text-secondary small mb-0 mt-0.5" style={{ fontSize: "0.8rem" }}>
                  {event.date} • {event.time} • Track and manage live event check-ins
                </p>
              </div>
            </div>
            <m.button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-link text-secondary text-decoration-none p-2 rounded-circle"
              style={{ lineHeight: 1 }}
              whileHover={{ scale: 1.15, rotate: 90, color: "#f87171" }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close dialog"
            >
              <i className="bi bi-x-lg fs-6"></i>
            </m.button>
          </div>

          {/* Metrics Ribbon */}
          <div
            className="d-flex align-items-center justify-content-between mb-3 p-2 rounded-3 flex-shrink-0 flex-wrap"
            style={{
              background: "#060911",
              border: "1px solid #1e293b",
              gap: "12px",
            }}
          >
            <div className="d-flex align-items-center flex-wrap flex-grow-1" style={{ gap: "12px" }}>
              {/* Total Registered */}
              <div
                className="flex-fill d-flex align-items-center justify-content-center px-3 py-2 rounded-2"
                style={{
                  background: "rgba(59, 130, 246, 0.12)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  color: "#60a5fa",
                  fontSize: "0.85rem",
                  gap: "8px",
                  minWidth: "150px",
                }}
              >
                <i className="bi bi-people-fill"></i>
                <span className="text-white-50">Registered:</span>
                <span className="text-white fw-bold">{metrics.totalRegistered}</span>
              </div>

              {/* Present */}
              <div
                className="flex-fill d-flex align-items-center justify-content-center px-3 py-2 rounded-2"
                style={{
                  background: "rgba(34, 197, 94, 0.12)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  color: "#4ade80",
                  fontSize: "0.85rem",
                  gap: "8px",
                  minWidth: "150px",
                }}
              >
                <i className="bi bi-check-circle-fill"></i>
                <span className="text-white-50">Present:</span>
                <span className="text-success fw-bold">{metrics.totalPresent}</span>
              </div>

              {/* Absent */}
              <div
                className="flex-fill d-flex align-items-center justify-content-center px-3 py-2 rounded-2"
                style={{
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#f87171",
                  fontSize: "0.85rem",
                  gap: "8px",
                  minWidth: "150px",
                }}
              >
                <i className="bi bi-clock-fill"></i>
                <span className="text-white-50">Pending / Absent:</span>
                <span className="text-danger fw-bold">{metrics.totalAbsent}</span>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center justify-content-center px-3 py-2 rounded-2 text-secondary"
              style={{ fontSize: "0.85rem", borderColor: "#1e293b", background: "rgba(255,255,255,0.03)", height: "38px" }}
              onClick={fetchAttendees}
              disabled={loading}
              title="Refresh Attendees"
            >
              <i className={`bi bi-arrow-repeat me-2 ${loading ? "spinner-border spinner-border-sm border-0" : ""}`}></i>
              <span>Refresh</span>
            </button>
          </div>

          {/* Search & Actions Bar */}
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2.5 flex-shrink-0">
            {/* Search Box */}
            <div className="d-flex align-items-center flex-grow-1" style={{ maxWidth: "380px" }}>
              <div className="admin-search-bar w-100" style={{ margin: 0, height: "38px" }}>
                <i className="bi bi-search search-icon"></i>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search by name, email, reg no, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ height: "38px", fontSize: "0.84rem" }}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setSearchTerm("")}
                    title="Clear search"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Filter & Export Buttons */}
            <div className="d-flex align-items-center gap-2">
              <div className="btn-group btn-group-sm" role="group" style={{ height: "38px" }}>
                <button
                  type="button"
                  className={`btn px-3 fw-semibold d-inline-flex align-items-center ${statusFilter === "all" ? "btn-primary" : "btn-outline-secondary text-secondary"}`}
                  style={{ borderColor: "#1e293b", fontSize: "0.82rem" }}
                  onClick={() => setStatusFilter("all")}
                >
                  All ({metrics.totalRegistered})
                </button>
                <button
                  type="button"
                  className={`btn px-3 fw-semibold d-inline-flex align-items-center ${statusFilter === "present" ? "btn-success" : "btn-outline-secondary text-secondary"}`}
                  style={{ borderColor: "#1e293b", fontSize: "0.82rem" }}
                  onClick={() => setStatusFilter("present")}
                >
                  Present ({metrics.totalPresent})
                </button>
                <button
                  type="button"
                  className={`btn px-3 fw-semibold d-inline-flex align-items-center ${statusFilter === "absent" ? "btn-danger" : "btn-outline-secondary text-secondary"}`}
                  style={{ borderColor: "#1e293b", fontSize: "0.82rem" }}
                  onClick={() => setStatusFilter("absent")}
                >
                  Absent ({metrics.totalAbsent})
                </button>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-info text-dark d-inline-flex align-items-center px-3 fw-semibold rounded-2"
                style={{ fontSize: "0.82rem", height: "38px" }}
                onClick={handleExportCsv}
                title="Export CSV"
              >
                <i className="bi bi-download me-2"></i>
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Attendees Table Container */}
          <div
            className="rounded-3 overflow-hidden flex-grow-1"
            style={{
              border: "1px solid #1e293b",
              background: "#060911",
              minHeight: "260px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="table-responsive flex-grow-1" style={{ maxHeight: "50vh", overflowY: "auto" }}>
              <table
                className="table table-hover m-0 align-middle"
                style={{
                  width: "100%",
                  tableLayout: "fixed",
                  fontSize: "0.84rem",
                  color: "#cbd5e1",
                  backgroundColor: "transparent",
                  borderColor: "rgba(255, 255, 255, 0.07)",
                  ["--bs-table-bg" as any]: "transparent",
                  ["--bs-table-hover-bg" as any]: "rgba(255, 255, 255, 0.03)",
                  ["--bs-table-color" as any]: "#cbd5e1",
                  ["--bs-table-border-color" as any]: "rgba(255, 255, 255, 0.07)",
                }}
              >
                <thead>
                  <tr style={{ background: "#0b1222", borderBottom: "1px solid #1e293b" }}>
                    <th className="py-2.5 px-2 text-center text-uppercase fw-semibold" style={{ fontSize: "0.72rem", width: "5%", whiteSpace: "nowrap", background: "#0b1222", color: "#94a3b8", borderColor: "#1e293b" }}>
                      #
                    </th>
                    <th className="py-2.5 px-3 text-start text-uppercase fw-semibold" style={{ fontSize: "0.72rem", width: "27%", whiteSpace: "nowrap", background: "#0b1222", color: "#94a3b8", borderColor: "#1e293b" }}>
                      Attendee
                    </th>
                    <th className="py-2.5 px-3 text-start text-uppercase fw-semibold" style={{ fontSize: "0.72rem", width: "18%", whiteSpace: "nowrap", background: "#0b1222", color: "#94a3b8", borderColor: "#1e293b" }}>
                      Reg No
                    </th>
                    <th className="py-2.5 px-3 text-start text-uppercase fw-semibold" style={{ fontSize: "0.72rem", width: "19%", whiteSpace: "nowrap", background: "#0b1222", color: "#94a3b8", borderColor: "#1e293b" }}>
                      Contact
                    </th>
                    <th className="py-2.5 px-2 text-center text-uppercase fw-semibold" style={{ fontSize: "0.72rem", width: "15%", whiteSpace: "nowrap", background: "#0b1222", color: "#94a3b8", borderColor: "#1e293b" }}>
                      Attendance
                    </th>
                    <th className="py-2.5 px-2 text-center text-uppercase fw-semibold" style={{ fontSize: "0.72rem", width: "16%", whiteSpace: "nowrap", background: "#0b1222", color: "#94a3b8", borderColor: "#1e293b" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody style={{ background: "transparent" }}>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-5 text-secondary" style={{ background: "transparent", borderColor: "transparent" }}>
                        <i className="bi bi-arrow-repeat spinner-border spinner-border-sm text-primary me-2"></i>
                        <span>Loading registered attendees...</span>
                      </td>
                    </tr>
                  ) : filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-5 text-secondary" style={{ background: "transparent", borderColor: "transparent" }}>
                        <div className="d-flex flex-column align-items-center justify-content-center py-4">
                          <i className="bi bi-people mb-2 opacity-40 fs-1" style={{ color: "#64748b" }}></i>
                          <span style={{ fontSize: "0.88rem", color: "#94a3b8" }}>No attendees found matching current filter.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((attendee, index) => (
                      <tr key={attendee._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "transparent" }}>
                        <td className="px-2 text-center text-secondary font-monospace" style={{ width: "5%" }}>{index + 1}</td>
                        <td className="px-3 text-start text-truncate" style={{ width: "27%", maxWidth: 0 }}>
                          <div className="fw-semibold text-white text-truncate" title={attendee.name}>{attendee.name}</div>
                          <div className="text-secondary small font-monospace d-flex align-items-center text-truncate mt-0.5" title={attendee.email}>
                            <i className="bi bi-envelope text-white-50 flex-shrink-0 me-2" style={{ fontSize: "0.8rem" }}></i>
                            <span className="text-truncate">{attendee.email}</span>
                          </div>
                        </td>
                        <td className="px-3 text-start text-truncate" style={{ width: "18%", maxWidth: 0 }}>
                          <div className="text-info fw-semibold font-monospace" style={{ fontSize: "0.85rem", letterSpacing: "0.5px" }}>
                            {attendee.registerNo || "N/A"}
                          </div>
                        </td>
                        <td className="px-3 text-start text-truncate" style={{ width: "19%", maxWidth: 0 }}>
                          {attendee.phone && attendee.phone !== "N/A" ? (
                            <a
                              href={`tel:${attendee.phone}`}
                              className="text-decoration-none text-light d-inline-flex align-items-center text-truncate"
                              style={{ fontSize: "0.85rem" }}
                            >
                              <i className="bi bi-telephone-fill text-success flex-shrink-0 me-2" style={{ fontSize: "0.8rem" }}></i>
                              <span className="text-truncate">{attendee.phone}</span>
                            </a>
                          ) : (
                            <span className="text-secondary" style={{ fontSize: "0.85rem" }}>N/A</span>
                          )}
                        </td>
                        <td className="px-2 text-center" style={{ width: "15%" }}>
                          {attendee.entry ? (
                            <div className="d-flex flex-column align-items-center justify-content-center">
                              <span
                                className="badge px-3 py-1.5 d-inline-flex align-items-center"
                                style={{
                                  background: "rgba(34, 197, 94, 0.15)",
                                  border: "1px solid rgba(34, 197, 94, 0.4)",
                                  color: "#4ade80",
                                  fontWeight: 600,
                                  fontSize: "0.75rem",
                                }}
                              >
                                <i className="bi bi-check-circle-fill me-2" style={{ fontSize: "0.8rem" }}></i>
                                <span>Present</span>
                              </span>
                              {attendee.checkedInAt && (
                                <div className="text-secondary font-monospace mt-1" style={{ fontSize: "0.68rem" }}>
                                  {new Date(attendee.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span
                              className="badge px-3 py-1.5 d-inline-flex align-items-center"
                              style={{
                                background: "rgba(148, 163, 184, 0.12)",
                                border: "1px solid rgba(148, 163, 184, 0.25)",
                                color: "#94a3b8",
                                fontWeight: 500,
                                fontSize: "0.75rem",
                              }}
                            >
                              <i className="bi bi-clock-fill me-2" style={{ fontSize: "0.8rem" }}></i>
                              <span>Absent</span>
                            </span>
                          )}
                        </td>
                        <td className="px-2 text-center" style={{ width: "16%" }}>
                          <div className="d-inline-flex align-items-center justify-content-center" style={{ gap: "12px" }}>
                            <button
                              type="button"
                              className={`btn btn-sm py-1.5 px-3 rounded-2 fw-semibold ${
                                attendee.entry ? "btn-outline-danger" : "btn-outline-success"
                              }`}
                              style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                              onClick={() => handleToggleAttendance(attendee)}
                            >
                              {attendee.entry ? "Mark Absent" : "Mark Present"}
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger p-1.5 rounded-2 d-inline-flex align-items-center justify-content-center"
                              style={{ width: "32px", height: "32px", borderColor: "rgba(239, 68, 68, 0.35)" }}
                              title="Delete Attendee"
                              onClick={() => setDeleteTarget(attendee)}
                            >
                              <i className="bi bi-trash3" style={{ fontSize: "0.85rem" }}></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-dark border-opacity-50 flex-shrink-0">
            <button
              type="button"
              className="btn btn-secondary px-4 py-2"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                borderColor: "rgba(255, 255, 255, 0.12)",
                color: "#cbd5e1",
                borderRadius: "8px",
                fontSize: "0.88rem",
                fontWeight: 500,
              }}
              onClick={onClose}
            >
              Close
            </button>
            <div className="text-secondary small">
              Showing <span className="text-white fw-semibold">{filteredRegistrations.length}</span> of <span className="text-white fw-semibold">{registrations.length}</span> registered
            </div>
          </div>
        </m.div>

        <ConfirmModal
          show={Boolean(deleteTarget)}
          title="Delete Attendee Registration"
          message={`Are you sure you want to delete the registration for ${deleteTarget?.name || "this attendee"} (${deleteTarget?.registerNo || ""})? This action cannot be undone.`}
          confirmText={isDeleting ? "Deleting..." : "Delete Registration"}
          confirmVariant="danger"
          isProcessing={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />

        {/* Custom Answers Popover / Sub-Modal */}
        {selectedAttendeeAnswers && (
          <m.div
            className="admin-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAttendeeAnswers(null)}
            style={{ zIndex: 1200 }}
          >
            <m.div
              className="p-4 rounded-4 text-white"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "90%",
                maxWidth: "500px",
                background: "#0c1322",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.9)",
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <div>
                  <h6 className="fw-bold mb-0 text-white">{selectedAttendeeAnswers.name}</h6>
                  <small className="text-secondary font-monospace">{selectedAttendeeAnswers.email}</small>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-icon text-secondary"
                  onClick={() => setSelectedAttendeeAnswers(null)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="d-flex flex-column gap-2.5 overflow-y-auto" style={{ maxHeight: "350px" }}>
                {selectedAttendeeAnswers.answers &&
                  Object.entries(selectedAttendeeAnswers.answers).map(([q, ans], i) => (
                    <div key={i} className="p-2.5 rounded-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="text-secondary small fw-semibold mb-1">{q}</div>
                      <div className="text-light small font-monospace">
                        {Array.isArray(ans) ? (
                          ans.map((item, idx) => (
                            <div key={idx}>
                              {typeof item === "string" && item.startsWith("http") ? (
                                <a href={item} target="_blank" rel="noreferrer" className="text-info text-decoration-none d-inline-flex align-items-center gap-1">
                                  <span>View Uploaded File {idx + 1}</span>
                                </a>
                              ) : (
                                String(item)
                              )}
                            </div>
                          ))
                        ) : typeof ans === "string" && ans.startsWith("http") ? (
                          <a href={ans} target="_blank" rel="noreferrer" className="text-info text-decoration-none d-inline-flex align-items-center gap-1">
                            <span>Open Attachment / File</span>
                          </a>
                        ) : (
                          String(ans || "No answer")
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </m.div>
          </m.div>
        )}
      </m.div>
    </AnimatePresence>
  );
};

export default EventAttendeesModal;
