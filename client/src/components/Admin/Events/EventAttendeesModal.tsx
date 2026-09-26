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
      const name = att.name || "";
      const email = att.email || "";
      const regNo = att.registerNo || "";
      const phone = att.phone || "";

      const matchSearch =
        !searchTerm.trim() ||
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (phone && phone.includes(searchTerm));

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
            maxWidth: "1060px",
            width: "100%",
            height: "86vh",
            minHeight: "580px",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(165deg, #0f172a 0%, #090d16 100%)",
            borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom flex-shrink-0" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "14px",
                  background: "rgba(56, 189, 248, 0.15)",
                  border: "1.5px solid rgba(56, 189, 248, 0.35)",
                  color: "#38bdf8",
                  boxShadow: "0 0 16px rgba(56, 189, 248, 0.25)",
                }}
              >
                <i className="bi bi-people-fill fs-5"></i>
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h5 className="m-0 fw-bold text-white tracking-tight" style={{ fontSize: "1.25rem" }}>
                    Event Attendance
                  </h5>
                  <span
                    className="badge rounded-pill px-3 py-1"
                    style={{
                      fontSize: "0.78rem",
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
                <p className="text-secondary small mb-0 mt-1" style={{ fontSize: "0.82rem" }}>
                  {event.date} • {event.time} • Track and manage live event check-ins
                </p>
              </div>
            </div>
            
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm d-inline-flex align-items-center justify-content-center px-3 py-1.5 rounded-3 text-secondary"
                style={{
                  fontSize: "0.82rem",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "#cbd5e1",
                  height: "38px",
                  minWidth: "100px",
                  fontWeight: 600,
                }}
                onClick={fetchAttendees}
                disabled={loading}
                title="Refresh Attendees"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" style={{ width: "13px", height: "13px" }}></span>
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-arrow-repeat me-2"></i>
                    <span>Refresh</span>
                  </>
                )}
              </button>

              <m.button
                type="button"
                onClick={onClose}
                className="btn btn-sm btn-link text-secondary text-decoration-none p-2 rounded-circle"
                style={{ lineHeight: 1 }}
                whileHover={{ scale: 1.15, rotate: 90, color: "#f87171" }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close dialog"
              >
                <i className="bi bi-x-lg fs-5"></i>
              </m.button>
            </div>
          </div>

          {/* Stats Cards Grid - 3 Equal Columns */}
          <div className="row g-3 mb-3 flex-shrink-0">
            {/* Total Registered Card */}
            <div className="col-12 col-md-4">
              <div className="glass-panel rounded-4 p-3 d-flex align-items-center justify-content-between h-100">
                <div>
                  <span className="text-secondary small text-uppercase fw-semibold tracking-wider" style={{ fontSize: "0.72rem" }}>
                    Total Registered
                  </span>
                  <h3 className="fw-bold text-white mb-0 mt-1" style={{ fontSize: "1.65rem", lineHeight: 1.2 }}>
                    {metrics.totalRegistered}
                  </h3>
                  <small className="text-secondary" style={{ fontSize: "0.74rem" }}>Total signups received</small>
                </div>
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 p-2 flex-shrink-0"
                  style={{
                    background: "rgba(56, 189, 248, 0.12)",
                    border: "1px solid rgba(56, 189, 248, 0.25)",
                    color: "#38bdf8",
                    width: 44,
                    height: 44,
                  }}
                >
                  <i className="bi bi-people-fill fs-5"></i>
                </div>
              </div>
            </div>

            {/* Present / Checked-In Card */}
            <div className="col-12 col-md-4">
              <div className="glass-panel rounded-4 p-3 d-flex align-items-center justify-content-between h-100">
                <div>
                  <span className="text-secondary small text-uppercase fw-semibold tracking-wider" style={{ fontSize: "0.72rem" }}>
                    Checked-In / Present
                  </span>
                  <h3 className="fw-bold text-success mb-0 mt-1" style={{ fontSize: "1.65rem", lineHeight: 1.2 }}>
                    {metrics.totalPresent}
                  </h3>
                  <small className="text-success" style={{ fontSize: "0.74rem", opacity: 0.9 }}>
                    {metrics.totalRegistered > 0 ? `${Math.round((metrics.totalPresent / metrics.totalRegistered) * 100)}% attendance rate` : "0% attendance"}
                  </small>
                </div>
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 p-2 flex-shrink-0"
                  style={{
                    background: "rgba(34, 197, 94, 0.12)",
                    border: "1px solid rgba(34, 197, 94, 0.25)",
                    color: "#4ade80",
                    width: 44,
                    height: 44,
                  }}
                >
                  <i className="bi bi-check-circle-fill fs-5"></i>
                </div>
              </div>
            </div>

            {/* Pending / Absent Card */}
            <div className="col-12 col-md-4">
              <div className="glass-panel rounded-4 p-3 d-flex align-items-center justify-content-between h-100">
                <div>
                  <span className="text-secondary small text-uppercase fw-semibold tracking-wider" style={{ fontSize: "0.72rem" }}>
                    Pending / Absent
                  </span>
                  <h3 className="fw-bold text-danger mb-0 mt-1" style={{ fontSize: "1.65rem", lineHeight: 1.2 }}>
                    {metrics.totalAbsent}
                  </h3>
                  <small className="text-danger" style={{ fontSize: "0.74rem", opacity: 0.9 }}>Awaiting entry scan</small>
                </div>
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 p-2 flex-shrink-0"
                  style={{
                    background: "rgba(244, 63, 94, 0.12)",
                    border: "1px solid rgba(244, 63, 94, 0.25)",
                    color: "#f87171",
                    width: 44,
                    height: 44,
                  }}
                >
                  <i className="bi bi-clock-history fs-5"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Actions Bar */}
          <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-3 mb-3 flex-shrink-0">
            {/* Search Box using unified admin-search-bar */}
            <div className="flex-grow-1" style={{ maxWidth: "420px" }}>
              <div className="admin-search-bar w-100">
                <i className="bi bi-search search-icon"></i>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search by name, email, reg no, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
            <div className="d-flex align-items-center gap-2.5 flex-wrap justify-content-md-end">
              {/* Status Filter Tabs */}
              <div
                className="d-inline-flex align-items-center p-1 rounded-3"
                style={{
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  gap: "4px",
                  height: "40px",
                }}
              >
                <button
                  type="button"
                  className="btn btn-sm px-3 fw-bold rounded-2 transition-all"
                  style={{
                    fontSize: "0.82rem",
                    border: "none",
                    background: statusFilter === "all" ? "linear-gradient(135deg, #0284c7, #2563eb)" : "transparent",
                    color: statusFilter === "all" ? "#ffffff" : "#94a3b8",
                    boxShadow: statusFilter === "all" ? "0 2px 10px rgba(56, 189, 248, 0.4)" : "none",
                  }}
                  onClick={() => setStatusFilter("all")}
                >
                  All ({metrics.totalRegistered})
                </button>
                <button
                  type="button"
                  className="btn btn-sm px-3 fw-bold rounded-2 transition-all"
                  style={{
                    fontSize: "0.82rem",
                    border: "none",
                    background: statusFilter === "present" ? "linear-gradient(135deg, #16a34a, #059669)" : "transparent",
                    color: statusFilter === "present" ? "#ffffff" : "#94a3b8",
                    boxShadow: statusFilter === "present" ? "0 2px 10px rgba(34, 197, 94, 0.4)" : "none",
                  }}
                  onClick={() => setStatusFilter("present")}
                >
                  Present ({metrics.totalPresent})
                </button>
                <button
                  type="button"
                  className="btn btn-sm px-3 fw-bold rounded-2 transition-all"
                  style={{
                    fontSize: "0.82rem",
                    border: "none",
                    background: statusFilter === "absent" ? "linear-gradient(135deg, #e11d48, #be123c)" : "transparent",
                    color: statusFilter === "absent" ? "#ffffff" : "#94a3b8",
                    boxShadow: statusFilter === "absent" ? "0 2px 10px rgba(225, 29, 72, 0.4)" : "none",
                  }}
                  onClick={() => setStatusFilter("absent")}
                >
                  Absent ({metrics.totalAbsent})
                </button>
              </div>

              {/* Export CSV Button */}
              <button
                type="button"
                className="btn btn-primary btn-sm d-inline-flex align-items-center px-3.5 fw-semibold rounded-3 shadow"
                style={{
                  height: "40px",
                  fontSize: "0.84rem",
                }}
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
            className="rounded-4 overflow-hidden flex-grow-1"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(11, 17, 32, 0.7)",
              minHeight: "260px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="table-responsive flex-grow-1" style={{ maxHeight: "48vh", overflowY: "auto" }}>
              <table
                className="table table-hover m-0 align-middle"
                style={{
                  width: "100%",
                  fontSize: "0.85rem",
                  color: "#cbd5e1",
                  backgroundColor: "transparent",
                  borderColor: "rgba(255, 255, 255, 0.07)",
                  ["--bs-table-bg" as any]: "transparent",
                  ["--bs-table-hover-bg" as any]: "rgba(56, 189, 248, 0.04)",
                  ["--bs-table-color" as any]: "#cbd5e1",
                  ["--bs-table-border-color" as any]: "rgba(255, 255, 255, 0.07)",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#0f172a",
                      borderBottom: "1.5px solid rgba(255, 255, 255, 0.1)",
                      position: "sticky",
                      top: 0,
                      zIndex: 5,
                    }}
                  >
                    <th className="py-3 px-3 text-center text-uppercase fw-bold" style={{ fontSize: "0.74rem", width: "50px", color: "#94a3b8", letterSpacing: "0.6px" }}>
                      #
                    </th>
                    <th className="py-3 px-3 text-start text-uppercase fw-bold" style={{ fontSize: "0.74rem", width: "26%", color: "#94a3b8", letterSpacing: "0.6px" }}>
                      Attendee
                    </th>
                    <th className="py-3 px-3 text-start text-uppercase fw-bold" style={{ fontSize: "0.74rem", width: "18%", color: "#94a3b8", letterSpacing: "0.6px" }}>
                      Reg No
                    </th>
                    <th className="py-3 px-3 text-start text-uppercase fw-bold" style={{ fontSize: "0.74rem", width: "26%", color: "#94a3b8", letterSpacing: "0.6px" }}>
                      Email
                    </th>
                    <th className="py-3 px-3 text-center text-uppercase fw-bold" style={{ fontSize: "0.74rem", width: "15%", color: "#94a3b8", letterSpacing: "0.6px" }}>
                      Attendance
                    </th>
                    <th className="py-3 px-3 text-center text-uppercase fw-bold" style={{ fontSize: "0.74rem", width: "15%", color: "#94a3b8", letterSpacing: "0.6px" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody style={{ background: "transparent" }}>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-5 text-secondary" style={{ background: "transparent", borderColor: "transparent" }}>
                        <div className="d-flex flex-column align-items-center justify-content-center py-5">
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                            style={{
                              width: 60,
                              height: 60,
                              background: "rgba(56, 189, 248, 0.08)",
                              border: "1px solid rgba(56, 189, 248, 0.2)",
                              color: "#38bdf8",
                            }}
                          >
                            <div className="spinner-border text-info" style={{ width: "2rem", height: "2rem" }} role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                          <span className="fw-semibold text-white mb-1" style={{ fontSize: "0.95rem" }}>Syncing Attendees...</span>
                          <small className="text-secondary">Fetching latest live event registrations and metrics.</small>
                        </div>
                      </td>
                    </tr>
                  ) : filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-5 text-secondary" style={{ background: "transparent", borderColor: "transparent" }}>
                        <div className="d-flex flex-column align-items-center justify-content-center py-5">
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                            style={{
                              width: 60,
                              height: 60,
                              background: "rgba(56, 189, 248, 0.08)",
                              border: "1px solid rgba(56, 189, 248, 0.2)",
                              color: "#38bdf8",
                            }}
                          >
                            <i className="bi bi-people fs-2"></i>
                          </div>
                          <span className="fw-semibold text-white mb-1" style={{ fontSize: "0.95rem" }}>No Attendees Found</span>
                          <small className="text-secondary">No registrations match the current filter or search criteria.</small>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((attendee, index) => (
                      <tr key={attendee._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "transparent" }}>
                        <td className="px-3 text-center text-secondary font-monospace" style={{ width: "50px" }}>{index + 1}</td>
                        <td className="px-3 text-start text-truncate" style={{ width: "26%", maxWidth: 0 }}>
                          <div className="fw-bold text-white text-truncate" title={attendee.name}>{attendee.name}</div>
                        </td>
                        <td className="px-3 text-start text-truncate" style={{ width: "18%", maxWidth: 0 }}>
                          <div className="text-info fw-bold font-monospace" style={{ fontSize: "0.88rem", letterSpacing: "0.5px" }}>
                            {attendee.registerNo || "N/A"}
                          </div>
                        </td>
                        <td className="px-3 text-start text-truncate" style={{ width: "26%", maxWidth: 0 }}>
                          <div className="text-secondary font-monospace d-flex align-items-center text-truncate" title={attendee.email}>
                            <i className="bi bi-envelope text-info flex-shrink-0 me-2" style={{ fontSize: "0.8rem" }}></i>
                            <span className="text-truncate">{attendee.email || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-3 text-center" style={{ width: "15%" }}>
                          {attendee.entry ? (
                            <div className="d-flex flex-column align-items-center justify-content-center">
                              <span
                                className="badge px-3 py-1.5 d-inline-flex align-items-center"
                                style={{
                                  background: "rgba(34, 197, 94, 0.15)",
                                  border: "1px solid rgba(34, 197, 94, 0.45)",
                                  color: "#4ade80",
                                  fontWeight: 700,
                                  fontSize: "0.76rem",
                                  boxShadow: "0 0 12px rgba(34, 197, 94, 0.2)",
                                  gap: "7px",
                                }}
                              >
                                <i className="bi bi-check-circle-fill" style={{ fontSize: "0.82rem" }}></i>
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
                                background: "rgba(244, 63, 94, 0.12)",
                                border: "1px solid rgba(244, 63, 94, 0.35)",
                                color: "#f87171",
                                fontWeight: 600,
                                fontSize: "0.76rem",
                                gap: "7px",
                              }}
                            >
                              <i className="bi bi-clock-fill" style={{ fontSize: "0.82rem" }}></i>
                              <span>Absent</span>
                            </span>
                          )}
                        </td>
                        <td className="px-3 text-center" style={{ width: "15%" }}>
                          <div className="d-inline-flex align-items-center justify-content-center" style={{ gap: "8px" }}>
                            <button
                              type="button"
                              className={`btn btn-sm py-1 px-2.5 rounded-3 fw-semibold ${
                                attendee.entry ? "btn-outline-danger" : "btn-outline-success"
                              }`}
                              style={{ fontSize: "0.76rem", whiteSpace: "nowrap" }}
                              onClick={() => handleToggleAttendance(attendee)}
                            >
                              {attendee.entry ? "Mark Absent" : "Mark Present"}
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger p-1 rounded-3 d-inline-flex align-items-center justify-content-center"
                              style={{ width: "30px", height: "30px", borderColor: "rgba(239, 68, 68, 0.4)" }}
                              title="Delete Attendee"
                              onClick={() => setDeleteTarget(attendee)}
                            >
                              <i className="bi bi-trash3" style={{ fontSize: "0.82rem" }}></i>
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
          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top flex-shrink-0" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
            <div className="text-secondary small">
              Showing <span className="text-white fw-bold">{filteredRegistrations.length}</span> of <span className="text-white fw-bold">{registrations.length}</span> registered
            </div>
            <button
              type="button"
              className="btn btn-secondary px-4 py-2 rounded-3 fw-semibold"
              style={{
                fontSize: "0.88rem",
              }}
              onClick={onClose}
            >
              Close
            </button>
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
      </m.div>
    </AnimatePresence>
  );
};

export default EventAttendeesModal;
