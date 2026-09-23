import React from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaInfoCircle, FaPencilAlt, FaTrashAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import CountdownTimer from "../../Website/Events/CountdownTimer";
import { parseEventDateTime } from "../../Website/Events/WebEventCard";
import type { IQuestion } from "../../../types/formBuilder";

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
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  index,
  onToggleDisplay,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const eventDateObj = parseEventDateTime(event.date, event.time);

  return (
    <div
      className="col-12 col-md-6 col-xl-4"
      style={{ animation: `fadeInUp 0.4s ease-out forwards ${index * 0.06}s`, opacity: 0 }}
    >
      <div className="event-card admin-event-card h-100">
        <div className="card-content-wrapper">
          {/* Card Top: Status Badge & Toggle Switch */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span
              className={`badge rounded-pill px-2.5 py-1.5 fw-medium d-inline-flex align-items-center gap-1.5 ${
                event.display
                  ? "bg-success bg-opacity-20 text-success border border-success border-opacity-30"
                  : "bg-secondary bg-opacity-25 text-secondary border border-secondary border-opacity-30"
              }`}
              style={{ fontSize: "0.75rem" }}
            >
              {event.display ? <FaEye size={11} /> : <FaEyeSlash size={11} />}
              <span>{event.display ? "Visible" : "Hidden"}</span>
            </span>

            <label className="toggle-switch" title="Toggle Active Status">
              <input
                type="checkbox"
                checked={event.display !== false}
                onChange={() => onToggleDisplay(event._id, event.display !== false)}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Event Title */}
          <h2 className="card-title mb-3" title={event.name}>
            {event.name}
          </h2>

          {/* Metadata */}
          <div className="card-meta mb-3">
            <div className="meta-item">
              <FaCalendarAlt className="meta-icon" />
              <span>{event.date}</span>
            </div>
            <div className="meta-item">
              <FaClock className="meta-icon" />
              <span>{event.time}</span>
            </div>
            <div className="meta-item">
              <FaMapMarkerAlt className="meta-icon" />
              <span className="text-truncate">{event.venue}</span>
            </div>
          </div>

          {/* Countdown Timer */}
          {eventDateObj && <CountdownTimer targetDate={eventDateObj} />}

          {/* Actions */}
          <div className="d-flex align-items-center gap-2 mt-auto pt-3 border-top border-secondary border-opacity-20">
            <button
              type="button"
              className="btn-view-details flex-grow-1"
              onClick={() => onViewDetails(event)}
              aria-label={`View details for ${event.name}`}
            >
              <FaInfoCircle /> <span>View Details</span>
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-info rounded-3 d-flex align-items-center justify-content-center p-2"
              style={{ width: "38px", height: "38px" }}
              onClick={() => onEdit(event)}
              title="Edit Event"
            >
              <FaPencilAlt size={13} />
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-danger rounded-3 d-flex align-items-center justify-content-center p-2"
              style={{ width: "38px", height: "38px" }}
              onClick={() => onDelete(event)}
              title="Delete Event"
            >
              <FaTrashAlt size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
