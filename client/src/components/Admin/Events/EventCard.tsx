import React from "react";
import { motion as m, type Variants } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaPencilAlt,
  FaTrashAlt,
  FaEye,
  FaEyeSlash,
  FaHourglassHalf,
  FaQrcode,
} from "react-icons/fa";
import type { IQuestion } from "../../../types/formBuilder";

export const formatDateDDMMYYYY = (dateStr?: string): string => {
  if (!dateStr) return "";
  const parts = dateStr.trim().split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
  return dateStr;
};

export const isRegistrationClosed = (regEndDate?: string): boolean => {
  if (!regEndDate) return false;
  const d = new Date(`${regEndDate}T23:59:59`);
  return !isNaN(d.getTime()) && d.getTime() < Date.now();
};

export interface ContactPerson {
  name: string;
  phone: string;
  role?: string;
}

export interface AdminEvent {
  _id: string;
  name: string;
  date: string;
  time: string;
  registrationEndDate?: string;
  venue: string;
  description: string;
  thumbnailUrl?: string;
  thumbnailPublicId?: string;
  posterUrl?: string;
  posterPublicId?: string;
  contactPersons: ContactPerson[];
  registrationQuestions: string[];
  customQuestions?: IQuestion[];
  whatsappGroupLink?: string;
  display: boolean;
}

interface EventCardProps {
  event: AdminEvent;
  index: number;
  onToggleDisplay: (id: string, currentDisplay: boolean) => void;
  onEdit: (event: AdminEvent) => void;
  onDelete: (event: AdminEvent) => void;
  onViewDetails: (event: AdminEvent) => void;
  onOpenAttendees?: (event: AdminEvent) => void;
}

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 25, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 260,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 15,
    transition: { duration: 0.25 },
  },
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onToggleDisplay,
  onEdit,
  onDelete,
  onViewDetails,
  onOpenAttendees,
}) => {
  const isClosed = isRegistrationClosed(event.registrationEndDate);
  const bannerImage = event.thumbnailUrl || event.posterUrl;

  return (
    <m.div
      className="col-12 col-md-6 col-xl-4"
      layout
      variants={cardItemVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <m.div
        className="event-card admin-event-card"
        whileHover={{
          y: -6,
          boxShadow: "0 22px 45px -10px rgba(0, 0, 0, 0.9), 0 0 30px rgba(56, 189, 248, 0.25)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        {/* Full Background Image Cover */}
        <div className="admin-card-bg-cover">
          {bannerImage ? (
            <img src={bannerImage} alt={event.name} loading="lazy" />
          ) : (
            <div className="admin-card-bg-placeholder">
              <span className="text-secondary opacity-25 fw-bold font-monospace" style={{ fontSize: "1.4rem", letterSpacing: "3px" }}>
                ACM SIGAI
              </span>
            </div>
          )}
        </div>

        {/* Ambient Dark Gradient Overlay */}
        <div className="admin-card-bg-overlay" />

        {/* Inner Content Layer */}
        <div className="admin-card-inner-content">
          {/* Top Row: Status Badge & Toggle Switch */}
          <div className="admin-card-top-controls">
            <m.span
              className={`admin-card-badge ${
                event.display !== false ? "badge-visible" : "badge-hidden"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {event.display !== false ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
              <span>{event.display !== false ? "Visible" : "Hidden"}</span>
            </m.span>

            <label className="toggle-switch" title={event.display !== false ? "Hide from website" : "Show on website"}>
              <input
                type="checkbox"
                checked={event.display !== false}
                onChange={() => onToggleDisplay(event._id, event.display !== false)}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Bottom Block: Info & Actions */}
          <div className="admin-card-bottom-info">
            {/* Title */}
            <h3 className="admin-card-title text-truncate" title={event.name}>
              {event.name}
            </h3>

            {/* Registration Deadline Chip */}
            {event.registrationEndDate && (
              <div className="admin-card-deadline-wrapper">
                <m.div
                  className={`admin-card-deadline-chip ${isClosed ? "is-closed" : ""}`}
                  whileHover={{ scale: 1.02 }}
                >
                  <FaHourglassHalf size={11} />
                  <span>Deadline: {formatDateDDMMYYYY(event.registrationEndDate)}</span>
                  {isClosed && (
                    <span
                      className="badge bg-danger text-white ms-1 px-1.5 py-0.5"
                      style={{ fontSize: "0.65rem", borderRadius: "4px" }}
                    >
                      Closed
                    </span>
                  )}
                </m.div>
              </div>
            )}

            {/* Metadata Row */}
            <div className="admin-card-meta-row">
              <div className="admin-meta-item">
                <FaCalendarAlt className="admin-meta-icon" />
                <span>{formatDateDDMMYYYY(event.date)}</span>
              </div>
              <span className="admin-meta-separator">•</span>
              <div className="admin-meta-item">
                <FaClock className="admin-meta-icon" />
                <span>{event.time}</span>
              </div>
              <span className="admin-meta-separator">•</span>
              <div className="admin-meta-item admin-meta-venue" title={event.venue}>
                <FaMapMarkerAlt className="admin-meta-icon flex-shrink-0" />
                <span className="text-truncate">{event.venue}</span>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="admin-card-actions">
              <m.button
                type="button"
                className="btn-view-details flex-grow-1"
                onClick={() => onViewDetails(event)}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`View details for ${event.name}`}
              >
                <FaInfoCircle size={16} />
                <span>View Details</span>
              </m.button>

              {onOpenAttendees && (
                <m.button
                  type="button"
                  className="admin-card-btn-icon btn-attendees"
                  onClick={() => onOpenAttendees(event)}
                  whileHover={{ scale: 1.08, y: -1 }}
                  whileTap={{ scale: 0.92 }}
                  title="Attendees & QR Attendance Scanner"
                  aria-label="Attendees and QR Attendance Scanner"
                  style={{
                    background: "rgba(56, 189, 248, 0.15)",
                    borderColor: "rgba(56, 189, 248, 0.4)",
                    color: "#38bdf8",
                  }}
                >
                  <FaQrcode size={18} />
                </m.button>
              )}

              <m.button
                type="button"
                className="admin-card-btn-icon btn-edit"
                onClick={() => onEdit(event)}
                whileHover={{ scale: 1.08, y: -1 }}
                whileTap={{ scale: 0.92 }}
                title="Edit Event"
                aria-label="Edit Event"
              >
                <FaPencilAlt size={16} />
              </m.button>

              <m.button
                type="button"
                className="admin-card-btn-icon btn-delete"
                onClick={() => onDelete(event)}
                whileHover={{ scale: 1.08, y: -1 }}
                whileTap={{ scale: 0.92 }}
                title="Delete Event"
                aria-label="Delete Event"
              >
                <FaTrashAlt size={16} />
              </m.button>
            </div>
          </div>
        </div>
      </m.div>
    </m.div>
  );
};

export default EventCard;
