import Event from "../models/Event";

/**
 * Parses the event date and time to determine the exact end Date object.
 * If a time range (e.g., "02:30 PM - 04:30 PM" or "10:00 AM to 01:00 PM") is specified,
 * the end time of the range is used.
 * If only a start time or no end time is specified, the end of the event day (23:59:59.999) is used.
 */
export const getEventEndDateTime = (dateStr?: string, timeStr?: string): Date | null => {
  if (!dateStr || !dateStr.trim()) return null;

  let year: number;
  let month: number;
  let day: number;

  const trimmedDate = dateStr.trim();
  const dateParts = trimmedDate.split("-");

  if (dateParts.length === 3 && dateParts[0].length === 4) {
    // YYYY-MM-DD
    year = parseInt(dateParts[0], 10);
    month = parseInt(dateParts[1], 10) - 1;
    day = parseInt(dateParts[2], 10);
  } else {
    const parsed = new Date(trimmedDate);
    if (isNaN(parsed.getTime())) return null;
    year = parsed.getFullYear();
    month = parsed.getMonth();
    day = parsed.getDate();
  }

  // Check if a time range exists (e.g. "02:30 PM - 04:30 PM" or "10:00 AM to 01:00 PM")
  if (timeStr && timeStr.trim()) {
    const rangeParts = timeStr.split(/[-–—]|to/i);
    if (rangeParts.length >= 2) {
      const endTimeRaw = rangeParts[rangeParts.length - 1].trim();
      const match12 = endTimeRaw.match(/^(0?[1-9]|1[0-2]):([0-5][0-9])\s*(AM|PM)$/i);

      if (match12) {
        let hours = parseInt(match12[1], 10);
        const minutes = parseInt(match12[2], 10);
        const meridiem = match12[3].toUpperCase();

        if (meridiem === "PM" && hours < 12) {
          hours += 12;
        } else if (meridiem === "AM" && hours === 12) {
          hours = 0;
        }

        return new Date(year, month, day, hours, minutes, 0, 0);
      }

      // Check 24-hour format (e.g. "17:30")
      const match24 = endTimeRaw.match(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/);
      if (match24) {
        const hours = parseInt(match24[1], 10);
        const minutes = parseInt(match24[2], 10);
        return new Date(year, month, day, hours, minutes, 0, 0);
      }
    }
  }

  // Fallback: End of the day (23:59:59.999)
  return new Date(year, month, day, 23, 59, 59, 999);
};

/**
 * Checks whether an event has passed its end datetime.
 */
export const isEventFinished = (
  dateStr?: string,
  timeStr?: string,
  now: Date = new Date()
): boolean => {
  const endDateTime = getEventEndDateTime(dateStr, timeStr);
  if (!endDateTime) return false;
  return now.getTime() > endDateTime.getTime();
};

/**
 * Scans uncompleted/visible events in MongoDB and automatically marks finished events:
 * - isCompleted: true
 * - isClosed: true
 * - display: false
 */
export const autoExpireFinishedEvents = async (): Promise<number> => {
  try {
    // Query events that are not marked as completed OR still marked as display: true
    const candidateEvents = await Event.find({
      $or: [
        { isCompleted: { $ne: true } },
        { display: true },
        { isClosed: false }
      ]
    }).select("_id date time isCompleted isClosed display").lean();

    if (!candidateEvents || candidateEvents.length === 0) return 0;

    const now = new Date();
    const expiredIds: any[] = [];

    for (const ev of candidateEvents) {
      if (isEventFinished(ev.date, ev.time, now)) {
        expiredIds.push(ev._id);
      }
    }

    if (expiredIds.length > 0) {
      await Event.updateMany(
        { _id: { $in: expiredIds } },
        {
          $set: {
            isCompleted: true,
            isClosed: true,
            display: false
          }
        }
      );
    }

    return expiredIds.length;
  } catch (error) {
    console.error("Auto expire finished events error:", error);
    return 0;
  }
};
