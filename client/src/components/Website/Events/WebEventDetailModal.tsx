import React from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaUser,
  FaTimes,
  FaClipboardCheck,
} from "react-icons/fa";
import { parseEventDateTime, type ExtendedEventData } from "./WebEventCard";

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
  if (!selectedEvent) return null;

  const eventDate = parseEventDateTime(selectedEvent.date, selectedEvent.time);
  const isClosed =
    (selectedEvent.isClosed ?? false) || (!!eventDate && new Date() > eventDate);

  return (
    <AnimatePresence>
      <m.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <m.div
          className="modal-content"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>

          <div className="modal-body">
            {/* LEFT PANE */}
            <div className="modal-left-pane">
              <h2 id="modal-title" className="modal-title">
                {selectedEvent.name}
              </h2>
              <div className="modal-grid-vertical">
                <div className="modal-meta-item">
                  <span className="modal-meta-label">Date</span>
                  <span className="modal-meta-value">
                    <FaCalendarAlt color="#3b82f6" />
                    {selectedEvent.date}
                  </span>
                </div>
                <div className="modal-meta-item">
                  <span className="modal-meta-label">Time</span>
                  <span className="modal-meta-value">
                    <FaClock color="#3b82f6" />
                    {selectedEvent.time}
                  </span>
                </div>
                <div className="modal-meta-item">
                  <span className="modal-meta-label">Venue</span>
                  <span className="modal-meta-value">
                    <FaMapMarkerAlt color="#3b82f6" />
                    {selectedEvent.venue}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT PANE */}
            <div className="modal-right-pane">
              <div className="modal-section">
                <span className="modal-section-title">About Event</span>
                <p className="modal-desc">{selectedEvent.description}</p>
              </div>

              {selectedEvent.contactPersons && selectedEvent.contactPersons.length > 0 && (
                <div className="modal-section">
                  <span className="modal-section-title">Coordinators</span>
                  <div className="modal-info-box">
                    {selectedEvent.contactPersons.map((person, idx) => (
                      <div key={idx} className="contact-item d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <FaUser size={14} color="#3b82f6" />
                          <span>
                            {person.name} {person.phone ? `(${person.phone})` : ""}
                          </span>
                        </div>
                        {person.role && (
                          <span
                            style={{
                              fontSize: "0.72rem",
                              padding: "2px 8px",
                              borderRadius: "10px",
                              background: person.role === "Faculty Coordinator" ? "rgba(168, 85, 247, 0.15)" : "rgba(59, 130, 246, 0.15)",
                              color: person.role === "Faculty Coordinator" ? "#c084fc" : "#60a5fa",
                              border: `1px solid ${person.role === "Faculty Coordinator" ? "rgba(168, 85, 247, 0.3)" : "rgba(59, 130, 246, 0.3)"}`,
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
            </div>
          </div>

          {/* FIXED FOOTER */}
          <div className="modal-footer">
            {selectedEvent.whatsappGroupLink && (
              <a
                href={selectedEvent.whatsappGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-modal"
                aria-label="Join WhatsApp group"
              >
                <FaWhatsapp size={22} /> Join Group
              </a>
            )}
            <button
              className={`btn-register ${isClosed ? "disabled" : ""}`}
              onClick={isClosed ? undefined : onRegisterClick}
              disabled={isClosed}
              aria-label={isClosed ? "Registration closed" : "Register for event"}
            >
              {isClosed ? <FaTimes size={18} /> : <FaClipboardCheck size={20} />}
              {isClosed ? "Registration Closed" : "Register Now"}
            </button>
          </div>
        </m.div>
      </m.div>
    </AnimatePresence>
  );
};

export default WebEventDetailModal;
