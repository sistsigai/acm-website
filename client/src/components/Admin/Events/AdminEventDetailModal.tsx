import React from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaUser,
  FaTimes,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaListUl,
  FaQrcode,
} from "react-icons/fa";
import { formatDateDDMMYYYY, type AdminEvent } from "./EventCard";

interface AdminEventDetailModalProps {
  selectedEvent: AdminEvent | null;
  onClose: () => void;
  onEdit: (event: AdminEvent) => void;
  onToggleDisplay: (id: string, currentDisplay: boolean) => void;
  onOpenAttendees?: (event: AdminEvent) => void;
}

export const AdminEventDetailModal: React.FC<AdminEventDetailModalProps> = ({
  selectedEvent,
  onClose,
  onEdit,
  onToggleDisplay,
  onOpenAttendees,
}) => {
  if (!selectedEvent) return null;

  return (
    <AnimatePresence>
      <m.div
        className="events-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-event-modal-title"
      >
        <m.div
          className="modal-content"
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes size={15} />
          </button>

          <div className="modal-body">
            {/* LEFT PANE - Event Overview & Key Info */}
            <div className="modal-left-pane">
              {/* Status Badge */}
              <div className="d-flex align-items-center justify-content-start">
                <span
                  className={`admin-card-badge ${
                    selectedEvent.display !== false ? "badge-visible" : "badge-hidden"
                  }`}
                  style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                >
                  {selectedEvent.display !== false ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
                  <span>{selectedEvent.display !== false ? "Visible on Website" : "Hidden from Website"}</span>
                </span>
              </div>

              {/* Poster / Thumbnail Preview */}
              {(selectedEvent.thumbnailUrl || selectedEvent.posterUrl) && (
                <div
                  className="rounded-3 overflow-hidden position-relative shadow-sm"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "#090d16",
                    width: "100%",
                    aspectRatio: "16 / 9",
                  }}
                >
                  <img
                    src={selectedEvent.thumbnailUrl || selectedEvent.posterUrl}
                    alt={selectedEvent.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              )}

              {/* Event Title */}
              <h2
                id="admin-event-modal-title"
                className="fw-bold text-white text-start mb-0"
                style={{ fontSize: "1.35rem", letterSpacing: "-0.3px", lineHeight: "1.3" }}
              >
                {selectedEvent.name}
              </h2>

              {/* Metadata Cards */}
              <div className="modal-grid-vertical">
                <div className="modal-meta-item">
                  <span className="modal-meta-label">Date</span>
                  <span className="modal-meta-value">
                    <FaCalendarAlt color="#38bdf8" size={13} />
                    {formatDateDDMMYYYY(selectedEvent.date)}
                  </span>
                </div>
                <div className="modal-meta-item">
                  <span className="modal-meta-label">Time</span>
                  <span className="modal-meta-value">
                    <FaClock color="#38bdf8" size={13} />
                    {selectedEvent.time}
                  </span>
                </div>
                {selectedEvent.registrationEndDate && (
                  <div className="modal-meta-item" style={{ borderColor: "rgba(245, 158, 11, 0.25)" }}>
                    <span className="modal-meta-label" style={{ color: "#fbbf24" }}>Reg. Deadline</span>
                    <span className="modal-meta-value" style={{ color: "#fef08a" }}>
                      <FaCalendarAlt color="#fbbf24" size={13} />
                      {formatDateDDMMYYYY(selectedEvent.registrationEndDate)}
                    </span>
                  </div>
                )}
                <div className="modal-meta-item">
                  <span className="modal-meta-label">Venue</span>
                  <span className="modal-meta-value">
                    <FaMapMarkerAlt color="#38bdf8" size={13} />
                    {selectedEvent.venue}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT PANE - Content & Coordinators */}
            <div className="modal-right-pane">
              {/* About Section */}
              <div className="modal-section">
                <span className="modal-section-title">About Event</span>
                <p className="modal-desc">
                  {selectedEvent.description || "No description provided."}
                </p>
              </div>

              {/* Coordinators Section */}
              {selectedEvent.contactPersons && selectedEvent.contactPersons.length > 0 && (
                <div className="modal-section">
                  <span className="modal-section-title">Event Coordinators</span>
                  <div className="d-flex flex-column gap-2">
                    {selectedEvent.contactPersons.map((person, idx) => (
                      <div
                        key={idx}
                        className="d-flex align-items-center justify-content-between flex-wrap rounded-3"
                        style={{
                          background: "rgba(15, 23, 42, 0.75)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          padding: "10px 14px",
                          gap: "10px",
                        }}
                      >
                        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle"
                            style={{
                              width: 32,
                              height: 32,
                              background: "rgba(56, 189, 248, 0.12)",
                              color: "#38bdf8",
                              flexShrink: 0,
                            }}
                          >
                            <FaUser size={13} />
                          </div>
                          <div className="d-flex flex-column">
                            <span className="fw-semibold text-white small" style={{ fontSize: "0.88rem" }}>
                              {person.name}
                            </span>
                            {person.phone && (
                              <span className="text-secondary small" style={{ fontSize: "0.78rem" }}>
                                {person.phone}
                              </span>
                            )}
                          </div>
                        </div>
                        {person.role && (
                          <span
                            style={{
                              fontSize: "0.72rem",
                              padding: "3px 10px",
                              borderRadius: "12px",
                              background: person.role === "Faculty Coordinator" ? "rgba(168, 85, 247, 0.15)" : "rgba(56, 189, 248, 0.15)",
                              color: person.role === "Faculty Coordinator" ? "#c084fc" : "#38bdf8",
                              border: `1px solid ${person.role === "Faculty Coordinator" ? "rgba(168, 85, 247, 0.3)" : "rgba(56, 189, 248, 0.3)"}`,
                              fontWeight: 600,
                            }}
                          >
                            {person.role}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom / Registration Questions Section */}
              {((selectedEvent.customQuestions && selectedEvent.customQuestions.length > 0) ||
                (selectedEvent.registrationQuestions && selectedEvent.registrationQuestions.length > 0)) && (
                  <div className="modal-section">
                    <span className="modal-section-title">Registration Fields</span>
                    <div className="d-flex flex-wrap" style={{ gap: "8px" }}>
                      {(selectedEvent.customQuestions && selectedEvent.customQuestions.length > 0
                        ? selectedEvent.customQuestions.map((q) => q.question)
                        : selectedEvent.registrationQuestions || []
                      ).map((q, idx) => (
                        <span
                          key={idx}
                          className="badge text-light fw-normal rounded-2 d-inline-flex align-items-center shadow-sm"
                          style={{
                            fontSize: "0.8rem",
                            background: "rgba(15, 23, 42, 0.85)",
                            border: "1px solid rgba(56, 189, 248, 0.25)",
                            padding: "6px 12px",
                            gap: "8px",
                          }}
                        >
                          <FaListUl size={11} color="#38bdf8" style={{ flexShrink: 0 }} />
                          <span>{q}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* FIXED FOOTER */}
          <div className="modal-footer">
            <div>
              {selectedEvent.whatsappGroupLink && (
                <a
                  href={selectedEvent.whatsappGroupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp-modal"
                  aria-label="Open WhatsApp group"
                  style={{ padding: "8px 16px", fontSize: "0.85rem", gap: "8px" }}
                >
                  <FaWhatsapp size={16} /> WhatsApp Group
                </a>
              )}
            </div>

            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
              {onOpenAttendees && (
                <button
                  type="button"
                  className="btn btn-outline-info rounded-2 px-3 py-2 fw-medium d-inline-flex align-items-center"
                  style={{ fontSize: "0.85rem", gap: "8px", borderColor: "rgba(56, 189, 248, 0.4)", color: "#38bdf8" }}
                  onClick={() => {
                    onClose();
                    onOpenAttendees(selectedEvent);
                  }}
                >
                  <FaQrcode size={14} />
                  <span>Attendees & Scanner</span>
                </button>
              )}

              <button
                type="button"
                className="btn btn-outline-light rounded-2 px-3 py-2 fw-medium d-inline-flex align-items-center"
                style={{ fontSize: "0.85rem", borderColor: "rgba(255, 255, 255, 0.18)", gap: "8px" }}
                onClick={() => onToggleDisplay(selectedEvent._id, selectedEvent.display !== false)}
              >
                {selectedEvent.display !== false ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                <span>{selectedEvent.display !== false ? "Hide Event" : "Make Visible"}</span>
              </button>

              <button
                type="button"
                className="btn-register"
                style={{ padding: "9px 20px", fontSize: "0.88rem", gap: "8px" }}
                onClick={() => {
                  onClose();
                  onEdit(selectedEvent);
                }}
              >
                <FaEdit size={15} /> Edit in Studio
              </button>
            </div>
          </div>
        </m.div>
      </m.div>
    </AnimatePresence>
  );
};

export default AdminEventDetailModal;
