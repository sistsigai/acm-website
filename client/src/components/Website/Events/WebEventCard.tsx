import React from "react";
import { motion as m, type Variants } from "framer-motion";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";
import CountdownTimer from "./CountdownTimer";
import type { EventData } from "../../../services/website/webeventService";

export interface ExtendedEventData extends EventData {
  isClosed?: boolean | null;
}

export const parseEventDateTime = (dateStr: string, timeStr: string): Date | null => {
  try {
    const dateParts = dateStr.split("-").map(Number);
    if (dateParts.length !== 3) return null;
    const [year, month, day] = dateParts;
    if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 31) return null;

    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!timeMatch) return null;

    const [, hoursStr, minutesStr, meridiem] = timeMatch;
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (meridiem.toUpperCase() === "PM" && hours < 12) hours += 12;
    if (meridiem.toUpperCase() === "AM" && hours === 12) hours = 0;

    return new Date(year, month - 1, day, hours, minutes);
  } catch {
    return null;
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
};

interface WebEventCardProps {
  event: ExtendedEventData;
  onSelect: (event: ExtendedEventData) => void;
}

export const WebEventCard: React.FC<WebEventCardProps> = ({ event, onSelect }) => {
  const eventDateObj = parseEventDateTime(event.date, event.time);

  return (
    <m.div className="event-card" variants={cardVariants}>
      <div className="card-content-wrapper">
        <h2 className="card-title">{event.name}</h2>
        <div className="card-meta">
          <div className="meta-item">
            <FaCalendarAlt className="meta-icon" />
            {event.date}
          </div>
          <div className="meta-item">
            <FaClock className="meta-icon" />
            {event.time}
          </div>
          <div className="meta-item">
            <FaMapMarkerAlt className="meta-icon" />
            {event.venue}
          </div>
        </div>
        {eventDateObj && <CountdownTimer targetDate={eventDateObj} />}
        <button
          type="button"
          className="btn-view-details"
          onClick={() => onSelect(event)}
          aria-label={`View details for ${event.name}`}
        >
          <FaInfoCircle /> View Details
        </button>
      </div>
    </m.div>
  );
};

export default WebEventCard;
