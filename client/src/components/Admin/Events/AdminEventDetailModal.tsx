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
} from "react-icons/fa";
import type { AdminEvent } from "./EventCard";

interface AdminEventDetailModalProps {
  selectedEvent: AdminEvent | null;
  onClose: () => void;
  onEdit: (event: AdminEvent) => void;
  onToggleDisplay: (id: string, currentDisplay: boolean) => void;
}

export const AdminEventDetailModal: React.FC<AdminEventDetailModalProps> = ({
  selectedEvent,
  onClose,
  onEdit,
  onToggleDisplay,
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
              <div className="d-flex align-items-center gap-2 mb-3">
                <span
                  className={`badge rounded-pill px-3 py-1.5 fw-medium d-inline-flex align-items-center gap-1.5 ${selectedEvent.display
                      ? "bg-success bg-opacity-20 text-success border border-success border-opacity-30"
                      : "bg-secondary bg-opacity-25 text-secondary border border-secondary border-opacity-30"
                    }`}
                  style={{ fontSize: "0.78rem" }}
                >
                  {selectedEvent.display ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
                  <span>{selectedEvent.display ? "Visible on Website" : "Hidden from Website"}</span>
                </span>
              </div>

              <h2 id="admin-event-modal-title" className="modal-title">
                {selectedEvent.name}
              </h2>

              <div className="modal-grid-vertical">
                <div className="modal-meta-item">
                  <span className="modal-meta-label">Date</span>
                  <span className="modal-meta-value">
                    <FaCalendarAlt color="#38bdf8" />
                    {selectedEvent.date}
                  </span>
                </div>
                <div className="modal-meta-item">
                  <span className="modal-meta-label">Time</span>
                  <span className="modal-meta-value">
                    <FaClock color="#38bdf8" />
                    {selectedEvent.time}
                  </span>
                </div>
                <div className="modal-meta-item">
                  <span className="modal-meta-label">Venue</span>
                  <span className="modal-meta-value">
                    <FaMapMarkerAlt color="#38bdf8" />
                    {selectedEvent.venue}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT PANE */}
            <div className="modal-right-pane">
              {/* About Section */}
              <div className="modal-section">
                <span className="modal-section-title">About Event</span>
                <p className="modal-desc">{selectedEvent.description}</p>
              </div>

              {/* Coordinators Section */}
              {selectedEvent.contactPersons && selectedEvent.contactPersons.length > 0 && (
                <div className="modal-section">
                  <span className="modal-section-title">Event Coordinators</span>
                  <div className="modal-info-box">
                    {selectedEvent.contactPersons.map((person, idx) => (
                      <div key={idx} className="contact-item">
                        <FaUser size={14} color="#38bdf8" />
                        <span>
                          {person.name} {person.phone ? `(${person.phone})` : ""}
                        </span>
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
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {(selectedEvent.customQuestions && selectedEvent.customQuestions.length > 0
                        ? selectedEvent.customQuestions.map((q) => q.question)
                        : selectedEvent.registrationQuestions || []
                      ).map((q, idx) => (
                        <span
                          key={idx}
                          className="badge bg-dark border border-secondary border-opacity-30 text-light fw-normal px-2.5 py-1.5 rounded-2 d-inline-flex align-items-center gap-1.5"
                          style={{ fontSize: "0.78rem" }}
                        >
                          <FaListUl size={10} color="#38bdf8" />
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
            {selectedEvent.whatsappGroupLink && (
              <a
                href={selectedEvent.whatsappGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-modal"
                aria-label="Open WhatsApp group"
              >
                <FaWhatsapp size={20} /> Group Link
              </a>
            )}

            <button
              type="button"
              className="btn btn-outline-light rounded-2 px-3 py-2 fw-medium d-inline-flex align-items-center gap-2"
              style={{ fontSize: "0.88rem" }}
              onClick={() => onToggleDisplay(selectedEvent._id, selectedEvent.display !== false)}
            >
              {selectedEvent.display ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              <span>{selectedEvent.display ? "Hide Event" : "Make Visible"}</span>
            </button>

            <button
              type="button"
              className="btn-register"
              onClick={() => {
                onClose();
                onEdit(selectedEvent);
              }}
            >
              <FaEdit size={18} /> Edit in Studio
            </button>
          </div>
        </m.div>
      </m.div>
    </AnimatePresence>
  );
};

export default AdminEventDetailModal;
