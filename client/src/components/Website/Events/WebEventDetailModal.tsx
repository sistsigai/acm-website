import React from "react";
import { createPortal } from "react-dom";
import { motion as m, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaUser,
  FaTimes,
  FaClipboardCheck,
  FaPhoneAlt,
} from "react-icons/fa";
import {
  parseEventDateTime,
  formatDateDDMMYYYY,
  isRegistrationClosed,
  type ExtendedEventData,
} from "./WebEventCard";

interface WebEventDetailModalProps {
  selectedEvent: ExtendedEventData | null;
  onClose: () => void;
  onRegisterClick: () => void;
}

export const WebEventDetailModal: React.FC<WebEventDetailModalProps> = ({
  selectedEvent,
  onClose,
  onRegisterClick,
}) => {
  React.useEffect(() => {
    if (selectedEvent) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [selectedEvent]);

  const eventDate = selectedEvent ? parseEventDateTime(selectedEvent.date, selectedEvent.time) : null;
  const isPast = !!eventDate && new Date() > eventDate;
  const isClosed = selectedEvent
    ? (selectedEvent.isClosed ?? false) ||
      isPast ||
      isRegistrationClosed(selectedEvent.registrationEndDate)
    : false;
  const posterImage = selectedEvent ? selectedEvent.posterUrl || selectedEvent.thumbnailUrl : null;

  return createPortal(
    <AnimatePresence>
      {selectedEvent && (
        <m.div
          key="web-event-detail-modal"
          className="web-event-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="web-event-detail-title"
        >
          <m.div
            className="web-event-modal-content"
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="web-event-modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <FaTimes size={16} />
            </button>

          {/* LEFT SIDE: Full Poster Showcase */}
          <div className="web-event-modal-poster-col">
            <div className="web-event-modal-poster-wrapper">
              {posterImage ? (
                <img
                  src={posterImage}
                  alt={`${selectedEvent.name} Poster`}
                  loading="eager"
                />
              ) : (
                <div className="web-event-modal-poster-placeholder">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: 64,
                      height: 64,
                      background: "rgba(56, 189, 248, 0.12)",
                      border: "1px solid rgba(56, 189, 248, 0.3)",
                      color: "#38bdf8",
                    }}
                  >
                    <FaCalendarAlt size={28} />
                  </div>
                  <div>
                    <h4 className="text-white fw-bold mb-1" style={{ fontSize: "1.2rem" }}>
                      {selectedEvent.name}
                    </h4>
                    <span
                      className="text-secondary font-monospace"
                      style={{ fontSize: "0.82rem", letterSpacing: "2px" }}
                    >
                      ACM SIGAI EVENT
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: Full Event Details, Schedule, Coordinators & Register Button */}
          <div className="web-event-modal-details-col">
            <div className="web-event-modal-details-scroll">
              {/* Header & Badges */}
              <div className="web-modal-header">
              <div className="web-modal-badges-row">
                <span
                  className={`admin-card-badge ${!isPast ? "badge-visible" : "badge-hidden"}`}
                  style={{ fontSize: "0.75rem", padding: "4px 11px" }}
                >
                  {!isPast ? (
                    <>
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          backgroundColor: "#34d399",
                          display: "inline-block",
                          boxShadow: "0 0 8px #34d399",
                        }}
                      />
                      <span>Upcoming Event</span>
                    </>
                  ) : (
                    <>
                      <FaClock size={11} />
                      <span>Past Event</span>
                    </>
                  )}
                </span>

                {isClosed ? (
                  <span
                    className="admin-card-badge badge-hidden"
                    style={{
                      fontSize: "0.75rem",
                      padding: "4px 11px",
                      background: "rgba(244, 63, 94, 0.15)",
                      borderColor: "rgba(244, 63, 94, 0.3)",
                      color: "#f43f5e",
                    }}
                  >
                    Registration Closed
                  </span>
                ) : (
                  <span
                    className="admin-card-badge badge-visible"
                    style={{
                      fontSize: "0.75rem",
                      padding: "4px 11px",
                      background: "rgba(56, 189, 248, 0.15)",
                      borderColor: "rgba(56, 189, 248, 0.3)",
                      color: "#38bdf8",
                    }}
                  >
                    Registration Open
                  </span>
                )}
              </div>

              {/* Event Name */}
              <h2 id="web-event-detail-title" className="web-modal-event-title">
                {selectedEvent.name}
              </h2>
            </div>

            {/* Description */}
            <div className="web-detail-section">
              <span className="web-detail-section-title">ABOUT THE EVENT</span>
              <p className="web-detail-desc">
                {selectedEvent.description || "No description provided."}
              </p>
            </div>

            {/* Schedule & Venue Grid */}
            <div className="web-detail-section">
              <span className="web-detail-section-title">EVENT SCHEDULE & LOCATION</span>
              <div className="web-detail-info-grid">
                {/* Date */}
                <div className="web-info-card">
                  <div className="web-info-card-icon">
                    <FaCalendarAlt />
                  </div>
                  <div className="web-info-card-content">
                    <span className="web-info-card-label">Date</span>
                    <span className="web-info-card-value">
                      {formatDateDDMMYYYY(selectedEvent.date)}
                    </span>
                  </div>
                </div>

                {/* Time */}
                <div className="web-info-card">
                  <div className="web-info-card-icon">
                    <FaClock />
                  </div>
                  <div className="web-info-card-content">
                    <span className="web-info-card-label">Time</span>
                    <span className="web-info-card-value">
                      {selectedEvent.time}
                    </span>
                  </div>
                </div>

                {/* Venue */}
                <div className="web-info-card web-info-card-venue">
                  <div className="web-info-card-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="web-info-card-content">
                    <span className="web-info-card-label">Venue</span>
                    <span className="web-info-card-value" title={selectedEvent.venue}>
                      {selectedEvent.venue}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Persons / Coordinators */}
            {selectedEvent.contactPersons && selectedEvent.contactPersons.length > 0 && (
              <div className="web-detail-section">
                <span className="web-detail-section-title">EVENT COORDINATORS</span>
                <div className="web-coordinators-grid">
                  {selectedEvent.contactPersons.map((person, idx) => (
                    <div key={idx} className="web-coordinator-card">
                      <div className="web-coordinator-info">
                        <div className="web-coordinator-avatar">
                          <FaUser />
                        </div>
                        <div className="d-flex flex-column">
                          <span className="web-coordinator-name">{person.name}</span>
                          {person.phone && (
                            <a
                              href={`tel:${person.phone}`}
                              className="web-coordinator-phone d-flex align-items-center gap-1"
                              title="Call Coordinator"
                            >
                              <FaPhoneAlt size={10} style={{ color: "#38bdf8" }} />
                              <span>{person.phone}</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {person.role && (
                        <span
                          style={{
                            fontSize: "0.72rem",
                            padding: "3px 10px",
                            borderRadius: "12px",
                            background:
                              person.role === "Faculty Coordinator"
                                ? "rgba(168, 85, 247, 0.15)"
                                : "rgba(56, 189, 248, 0.15)",
                            color:
                              person.role === "Faculty Coordinator" ? "#c084fc" : "#38bdf8",
                            border: `1px solid ${
                              person.role === "Faculty Coordinator"
                                ? "rgba(168, 85, 247, 0.3)"
                                : "rgba(56, 189, 248, 0.3)"
                            }`,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
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
            </div>

            {/* Footer Action Area: WhatsApp Community & Register Button (Sticky) */}
            <div className="web-modal-footer-actions">
              {selectedEvent.whatsappGroupLink ? (
                <a
                  href={selectedEvent.whatsappGroupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp-action"
                  aria-label="Join Official WhatsApp Group"
                >
                  <FaWhatsapp size={18} />
                  <span>Join WhatsApp Group</span>
                </a>
              ) : (
                <div />
              )}

              <m.button
                type="button"
                className={`btn-web-register ${isClosed ? "disabled" : ""}`}
                onClick={isClosed ? undefined : onRegisterClick}
                disabled={isClosed}
                whileHover={!isClosed ? { scale: 1.03 } : {}}
                whileTap={!isClosed ? { scale: 0.97 } : {}}
                aria-label={isClosed ? "Registration closed" : "Register for this event"}
              >
                {isClosed ? <FaTimes size={16} /> : <FaClipboardCheck size={18} />}
                <span>{isClosed ? "Registration Closed" : "Register Now"}</span>
              </m.button>
            </div>
          </div>
        </m.div>
      </m.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default WebEventDetailModal;
