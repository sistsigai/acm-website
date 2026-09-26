import React, { useState, useEffect, useMemo } from "react";
import { motion as m, type Variants } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import type { EventData } from "../../../services/website/webEventService";

export interface ExtendedEventData extends EventData {
  isClosed?: boolean | null;
}

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

export const getRegistrationDeadlineDate = (
  regEndDate?: string,
  eventDate?: string,
  eventTime?: string
): Date | null => {
  if (regEndDate && regEndDate.trim()) {
    const parts = regEndDate.trim().split("-");
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        const [y, m, d] = parts.map(Number);
        return new Date(y, m - 1, d, 23, 59, 59);
      } else if (parts[2].length === 4) {
        // DD-MM-YYYY
        const [d, m, y] = parts.map(Number);
        return new Date(y, m - 1, d, 23, 59, 59);
      }
    }
    const d = new Date(`${regEndDate}T23:59:59`);
    if (!isNaN(d.getTime())) return d;
  }
  if (eventDate && eventTime) {
    return parseEventDateTime(eventDate, eventTime);
  }
  return null;
};

export const calculateDeadlineTimeLeft = (targetDate: Date): string | null => {
  const now = Date.now();
  const distance = targetDate.getTime() - now;
  if (distance <= 0) return null;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return `${days.toString().padStart(2, "0")}d ${hours.toString().padStart(2, "0")}h ${minutes
    .toString()
    .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
};

export const isRegistrationClosed = (regEndDate?: string): boolean => {
  if (!regEndDate) return false;
  const deadlineDate = getRegistrationDeadlineDate(regEndDate);
  return deadlineDate ? deadlineDate.getTime() < Date.now() : false;
};

export const DeadlineBigCountdownBadge: React.FC<{
  regEndDate?: string;
  eventDate?: string;
  eventTime?: string;
}> = ({ regEndDate, eventDate, eventTime }) => {
  const targetDate = useMemo(
    () => getRegistrationDeadlineDate(regEndDate, eventDate, eventTime),
    [regEndDate, eventDate, eventTime]
  );

  const [timeLeft, setTimeLeft] = useState<string | null>(() =>
    targetDate ? calculateDeadlineTimeLeft(targetDate) : null
  );

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      const remaining = calculateDeadlineTimeLeft(targetDate);
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!targetDate) return null;

  const isClosed = timeLeft === null;

  return (
    <div className={`web-card-countdown-box ${isClosed ? "is-closed" : ""}`}>
      {isClosed ? (
        <span className="web-countdown-closed">
          <FaHourglassHalf size={12} /> REGISTRATION CLOSED
        </span>
      ) : (
        <>
          <span className="web-countdown-label">
            <FaHourglassHalf size={10} style={{ color: "#38bdf8" }} />
            REGISTRATION CLOSES IN
          </span>
          <span className="web-countdown-timer">{timeLeft}</span>
        </>
      )}
    </div>
  );
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: 15,
    transition: { duration: 0.25 },
  },
};

interface WebEventCardProps {
  event: ExtendedEventData;
  onSelect: (event: ExtendedEventData) => void;
}

export const WebEventCard: React.FC<WebEventCardProps> = ({ event, onSelect }) => {
  const isClosed = isRegistrationClosed(event.registrationEndDate);
  const bannerImage = event.thumbnailUrl || event.posterUrl;
  const eventDateObj = parseEventDateTime(event.date, event.time);
  const isPast = eventDateObj && eventDateObj.getTime() < Date.now();

  return (
    <m.div
      className="event-card admin-event-card"
      variants={cardItemVariants}
      whileHover={{
        y: -6,
        boxShadow: "0 22px 45px -10px rgba(0, 0, 0, 0.9), 0 0 30px rgba(56, 189, 248, 0.25)",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Full Background Image Cover */}
      <div className="admin-card-bg-cover">
        {bannerImage ? (
          <img src={bannerImage} alt={event.name} loading="lazy" />
        ) : (
          <div className="admin-card-bg-placeholder">
            <span
              className="text-secondary opacity-25 fw-bold font-monospace"
              style={{ fontSize: "1.4rem", letterSpacing: "3px" }}
            >
              ACM SIGAI
            </span>
          </div>
        )}
      </div>

      {/* Ambient Dark Gradient Overlay */}
      <div className="admin-card-bg-overlay" />

      {/* Inner Content Layer */}
      <div className="admin-card-inner-content">
        {/* Top Controls / Badges */}
        <div className="admin-card-top-controls">
          <m.span
            className={`admin-card-badge ${
              !isPast ? "badge-visible" : "badge-hidden"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
                <span>Upcoming</span>
              </>
            ) : (
              <>
                <FaClock size={11} />
                <span>Past Event</span>
              </>
            )}
          </m.span>

          {isClosed ? (
            <span
              className="admin-card-badge badge-hidden"
              style={{
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
                background: "rgba(56, 189, 248, 0.15)",
                borderColor: "rgba(56, 189, 248, 0.3)",
                color: "#38bdf8",
              }}
            >
              Registration Open
            </span>
          )}
        </div>

        {/* Bottom Block: Info & Actions */}
        <div className="admin-card-bottom-info">
          {/* Title */}
          <h3 className="admin-card-title text-truncate" title={event.name}>
            {event.name}
          </h3>

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

          {/* Big Registration Countdown Badge */}
          {(event.registrationEndDate || (event.date && event.time)) && (
            <DeadlineBigCountdownBadge
              regEndDate={event.registrationEndDate}
              eventDate={event.date}
              eventTime={event.time}
            />
          )}

          {/* Actions Footer */}
          <div className="admin-card-actions">
            <m.button
              type="button"
              className="btn-view-details flex-grow-1"
              onClick={() => onSelect(event)}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              aria-label={`View details for ${event.name}`}
            >
              <FaInfoCircle size={18} />
              <span>View Details</span>
            </m.button>
          </div>
        </div>
      </div>
    </m.div>
  );
};

export default WebEventCard;
