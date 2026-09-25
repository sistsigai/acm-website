import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getAllEvents,
  scanAttendanceQr,
  type EventItem,
  type AttendeeRecord,
} from "../../services/admin/eventService";
import CameraScanner from "../../components/Scanner/CameraScanner";
import ScanResultOverlay, { type ScanResultData } from "../../components/Scanner/ScanResultOverlay";
import { scannerFeedback } from "../../utils/scannerFeedback";

const MobileScanner: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialEventId = searchParams.get("eventId");

  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(initialEventId || null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Scanner State
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);

  // 1. Fetch Events
  const loadEvents = useCallback(async () => {
    try {
      setIsLoadingEvents(true);
      const res = await getAllEvents();
      if (res?.success && Array.isArray(res.events)) {
        setEvents(res.events);
      }
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Selected Event Object
  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return events.find((e) => e._id === selectedEventId) || null;
  }, [events, selectedEventId]);

  const [torchOn, setTorchOn] = useState(false);

  // Categorize events: Today vs Other
  const { todayEvents, otherEvents } = useMemo(() => {
    const today: EventItem[] = [];
    const other: EventItem[] = [];

    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const todayIso = `${y}-${m}-${d}`;
    const todayDmy = `${d}-${m}-${y}`;

    events.forEach((ev) => {
      const rawDate = (ev.date || "").trim();
      let matchesToday = false;

      if (rawDate === todayIso || rawDate === todayDmy) {
        matchesToday = true;
      } else if (rawDate) {
        try {
          const parsed = new Date(rawDate);
          if (
            !isNaN(parsed.getTime()) &&
            parsed.getFullYear() === now.getFullYear() &&
            parsed.getMonth() === now.getMonth() &&
            parsed.getDate() === now.getDate()
          ) {
            matchesToday = true;
          }
        } catch {}
      }

      if (matchesToday) {
        today.push(ev);
      } else {
        other.push(ev);
      }
    });

    return { todayEvents: today, otherEvents: other };
  }, [events]);

  // Handle Select Event
  const handleSelectEvent = (event: EventItem) => {
    setSelectedEventId(event._id);
    setTorchOn(false);
    setSearchParams({ eventId: event._id });
  };

  // Handle Back to Event List
  const handleBackToList = () => {
    setSelectedEventId(null);
    setScanResult(null);
    setIsProcessing(false);
    setTorchOn(false);
    setSearchParams({});
  };

  // Handle QR Scan
  const handleQrScan = async (qrData: string) => {
    if (!selectedEventId || isProcessing) return;

    try {
      setIsProcessing(true);
      const res = await scanAttendanceQr(selectedEventId, qrData);

      if (res?.success && res.registration) {
        const attendee: AttendeeRecord = res.registration;
        const isAlready = Boolean(res.alreadyCheckedIn);

        if (isAlready) {
          scannerFeedback.playWarning();
          setScanResult({
            status: "already_checked_in",
            message: res.message || "Attendee already checked in.",
            name: attendee?.name,
            registerNo: attendee?.registerNo,
            email: attendee?.email,
            phone: attendee?.phone,
            dept: attendee?.dept,
            year: attendee?.year,
            section: attendee?.section,
            answers: attendee?.answers,
            checkedInAt: res.checkedInAt || attendee?.checkedInAt || undefined,
          });
        } else {
          scannerFeedback.playSuccess();
          setScanResult({
            status: "success",
            message: "Attendance marked successfully!",
            name: attendee?.name,
            registerNo: attendee?.registerNo,
            email: attendee?.email,
            phone: attendee?.phone,
            dept: attendee?.dept,
            year: attendee?.year,
            section: attendee?.section,
            answers: attendee?.answers,
            checkedInAt: res.checkedInAt || new Date().toISOString(),
          });
        }
      } else {
        scannerFeedback.playError();
        setScanResult({
          status: res?.mismatch ? "mismatch" : "invalid",
          message: res?.message || "Invalid ticket QR code.",
          ticketEventId: res?.ticketEventId,
          ticketEventName: res?.ticketEventName,
          currentEventName: res?.currentEventName,
          name: res?.attendeeName,
        });
      }
    } catch (err: any) {
      console.error("Attendance QR scan error:", err);
      scannerFeedback.playError();
      const data = err?.data;
      setScanResult({
        status: data?.mismatch ? "mismatch" : "invalid",
        message: err?.message || "Failed to verify attendance ticket.",
        ticketEventId: data?.ticketEventId,
        ticketEventName: data?.ticketEventName,
        currentEventName: data?.currentEventName,
        name: data?.attendeeName,
      });
    }
  };

  const handleDismissResult = () => {
    setScanResult(null);
    setIsProcessing(false);
  };

  const handleSwitchEvent = (targetEventId: string) => {
    setSelectedEventId(targetEventId);
    setSearchParams({ eventId: targetEventId });
    setScanResult(null);
    setIsProcessing(false);
  };

  // -------------------------------------------------------------
  // VIEW 1: SIMPLE GOOGLE PAY STYLE CAMERA SCANNER
  // -------------------------------------------------------------
  if (selectedEvent) {
    return (
      <div
        className="position-relative w-100 d-flex flex-column"
        style={{
          height: "100dvh",
          width: "100vw",
          background: "#000000",
          overflow: "hidden",
        }}
      >
        {/* Minimal Google Pay Top Overlay Bar */}
        <div
          className="position-absolute d-flex align-items-center justify-content-between px-3 py-3 w-100"
          style={{
            top: 0,
            left: 0,
            right: 0,
            zIndex: 40,
            background: "linear-gradient(180deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)",
          }}
        >
          {/* Back Button */}
          <button
            type="button"
            className="btn rounded-circle d-flex align-items-center justify-content-center text-white"
            style={{
              width: "44px",
              height: "44px",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
            onClick={handleBackToList}
            aria-label="Back to event selection"
          >
            <i className="bi bi-arrow-left fs-5"></i>
          </button>

          {/* Minimal Event Title Chip */}
          <div
            className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill text-white fw-semibold"
            style={{
              maxWidth: "220px",
              fontSize: "0.88rem",
              background: "rgba(15, 23, 42, 0.8)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            <span
              className="d-inline-block rounded-circle bg-success flex-shrink-0"
              style={{ width: "8px", height: "8px", boxShadow: "0 0 6px #22c55e" }}
            />
            <span className="text-truncate">{selectedEvent.name}</span>
          </div>

          {/* Torch / Flash Toggle Button */}
          <button
            type="button"
            className="btn rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "44px",
              height: "44px",
              background: torchOn ? "#38bdf8" : "rgba(255, 255, 255, 0.15)",
              color: torchOn ? "#041527" : "#ffffff",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: torchOn ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.25)",
              boxShadow: torchOn ? "0 0 16px rgba(56, 189, 248, 0.5)" : "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
            onClick={() => setTorchOn((prev) => !prev)}
            aria-label="Toggle flashlight"
          >
            <i className={`bi ${torchOn ? "bi-flashlight-fill" : "bi-flashlight"} fs-5`}></i>
          </button>
        </div>

        {/* Fullscreen Camera View */}
        <div className="w-100 h-100 flex-grow-1 position-relative">
          <CameraScanner
            onScan={handleQrScan}
            isPaused={isProcessing || Boolean(scanResult)}
            torchOn={torchOn}
            facingMode="environment"
          />
        </div>

        {/* Scan Result Overlay Modal */}
        <ScanResultOverlay
          result={scanResult}
          onDismiss={handleDismissResult}
          onSwitchEvent={handleSwitchEvent}
        />
      </div>
    );
  }

  // Format date helper for human-readable badge
  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const trimmed = dateStr.trim();
      const parts = trimmed.split("-");
      if (parts.length === 3 && parts[0].length === 4) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
        }
      }
    } catch {}
    return dateStr;
  };

  // -------------------------------------------------------------
  // VIEW 2: SIMPLE EVENT SELECTION LIST
  // -------------------------------------------------------------
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-start"
      style={{
        minHeight: "100dvh",
        width: "100vw",
        background: "#080d1a",
        color: "#f8fafc",
        padding: "36px 16px 56px",
      }}
    >
      <div className="w-100" style={{ maxWidth: "450px" }}>
        {/* Simple Modern Header */}
        <div className="text-center mb-4 pb-2">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-4 mb-3"
            style={{
              width: "64px",
              height: "64px",
              background: "linear-gradient(135deg, rgba(56, 189, 248, 0.18) 0%, rgba(37, 99, 235, 0.2) 100%)",
              border: "1px solid rgba(56, 189, 248, 0.35)",
              color: "#38bdf8",
              boxShadow: "0 8px 24px -4px rgba(56, 189, 248, 0.25)",
            }}
          >
            <i className="bi bi-qr-code-scan fs-2"></i>
          </div>
          <h4 className="fw-bold text-white mb-1.5" style={{ fontSize: "1.4rem", letterSpacing: "-0.02em" }}>
            Attendance Scanner
          </h4>
          <p className="text-secondary small mb-0" style={{ fontSize: "0.88rem", color: "#94a3b8" }}>
            Select an event to start scanning tickets
          </p>
        </div>

        {isLoadingEvents ? (
          <div className="text-center py-5">
            <div className="spinner-border text-info mb-3" role="status" style={{ width: "2.4rem", height: "2.4rem" }}></div>
            <p className="text-secondary small">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div
            className="text-center py-5 px-4 rounded-4"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <i className="bi bi-calendar-x fs-1 opacity-40 text-secondary mb-3 d-block"></i>
            <h6 className="text-white fw-bold">No Events Found</h6>
            <p className="text-secondary small mb-0">There are currently no events registered in the system.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {/* Today's Events Section (If any) */}
            {todayEvents.length > 0 && (
              <div>
                <div className="d-flex align-items-center gap-2 mb-3 px-1">
                  <span
                    className="d-inline-flex align-items-center bg-success text-white fw-bold rounded-pill"
                    style={{
                      fontSize: "0.72rem",
                      padding: "4px 10px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    ● LIVE TODAY
                  </span>
                  <span className="text-secondary small fw-medium" style={{ color: "#94a3b8" }}>
                    Happening Today
                  </span>
                </div>

                <div className="d-flex flex-column gap-3">
                  {todayEvents.map((ev) => (
                    <div
                      key={ev._id}
                      onClick={() => handleSelectEvent(ev)}
                      role="button"
                      tabIndex={0}
                      className="w-100 rounded-4 text-start position-relative overflow-hidden"
                      style={{
                        background: "linear-gradient(145deg, rgba(34, 197, 94, 0.12) 0%, #0d1726 100%)",
                        border: "1px solid rgba(34, 197, 94, 0.4)",
                        padding: "20px 20px 18px",
                        boxShadow: "0 10px 28px -6px rgba(0, 0, 0, 0.55)",
                        cursor: "pointer",
                        transition: "transform 0.15s ease, border-color 0.15s ease",
                      }}
                    >
                      {/* Top Row: Event Name & Date Badge */}
                      <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                        <h5 className="fw-bold text-white mb-0 text-truncate" style={{ fontSize: "1.15rem", letterSpacing: "-0.01em" }}>
                          {ev.name}
                        </h5>
                        <span
                          className="d-inline-flex align-items-center justify-content-center fw-bold rounded-pill flex-shrink-0"
                          style={{
                            fontSize: "0.75rem",
                            padding: "4px 12px",
                            lineHeight: "1.2",
                            background: "rgba(34, 197, 94, 0.2)",
                            color: "#4ade80",
                            border: "1px solid rgba(34, 197, 94, 0.4)",
                          }}
                        >
                          Today
                        </span>
                      </div>

                      {/* Middle Info Rows */}
                      <div className="d-flex flex-column" style={{ gap: "10px", marginBottom: "18px" }}>
                        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                          <span
                            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                            style={{
                              width: "28px",
                              height: "28px",
                              background: "rgba(34, 197, 94, 0.2)",
                              color: "#4ade80",
                              fontSize: "0.85rem",
                            }}
                          >
                            <i className="bi bi-clock"></i>
                          </span>
                          <span className="fw-medium text-white" style={{ fontSize: "0.9rem" }}>
                            {ev.time || "Full Day Event"}
                          </span>
                        </div>

                        {ev.venue && (
                          <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                            <span
                              className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                              style={{
                                width: "28px",
                                height: "28px",
                                background: "rgba(148, 163, 184, 0.12)",
                                color: "#94a3b8",
                                fontSize: "0.85rem",
                              }}
                            >
                              <i className="bi bi-geo-alt"></i>
                            </span>
                            <span className="text-truncate" style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>
                              {ev.venue}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Bottom Action Row */}
                      <div
                        className="d-flex align-items-center justify-content-between pt-3 border-top"
                        style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
                      >
                        <span className="small fw-medium" style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                          Ready to scan
                        </span>
                        <div
                          className="d-inline-flex align-items-center justify-content-center fw-bold rounded-pill"
                          style={{
                            gap: "8px",
                            padding: "6px 14px",
                            fontSize: "0.82rem",
                            background: "#22c55e",
                            color: "#052e16",
                            boxShadow: "0 2px 10px rgba(34, 197, 94, 0.35)",
                          }}
                        >
                          <i className="bi bi-qr-code-scan"></i>
                          <span>Start Scanner</span>
                          <i className="bi bi-chevron-right" style={{ fontSize: "0.75rem" }}></i>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Events Section */}
            <div>
              {todayEvents.length > 0 && (
                <div className="d-flex align-items-center gap-2 mb-3 px-1">
                  <span
                    className="text-secondary small fw-bold text-uppercase tracking-wider"
                    style={{ fontSize: "0.72rem", letterSpacing: "0.5px", color: "#64748b" }}
                  >
                    Other Events
                  </span>
                </div>
              )}

              <div className="d-flex flex-column gap-3">
                {(todayEvents.length > 0 ? otherEvents : events).map((ev) => (
                  <div
                    key={ev._id}
                    onClick={() => handleSelectEvent(ev)}
                    role="button"
                    tabIndex={0}
                    className="w-100 rounded-4 text-start position-relative overflow-hidden"
                    style={{
                      background: "linear-gradient(145deg, #0e1526 0%, #090e1a 100%)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      padding: "20px 20px 18px",
                      boxShadow: "0 8px 22px -6px rgba(0, 0, 0, 0.45)",
                      cursor: "pointer",
                      transition: "transform 0.15s ease, border-color 0.15s ease",
                    }}
                  >
                    {/* Top Row: Event Name & Date Badge */}
                    <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                      <h5 className="fw-bold text-white mb-0 text-truncate" style={{ fontSize: "1.12rem", letterSpacing: "-0.01em" }}>
                        {ev.name}
                      </h5>
                      {ev.date && (
                        <span
                          className="d-inline-flex align-items-center justify-content-center fw-semibold rounded-pill flex-shrink-0"
                          style={{
                            fontSize: "0.75rem",
                            padding: "4px 12px",
                            lineHeight: "1.2",
                            background: "rgba(255, 255, 255, 0.08)",
                            color: "#cbd5e1",
                            border: "1px solid rgba(255, 255, 255, 0.14)",
                          }}
                        >
                          {formatDateDisplay(ev.date)}
                        </span>
                      )}
                    </div>

                    {/* Middle Info Rows */}
                    <div className="d-flex flex-column" style={{ gap: "10px", marginBottom: "18px" }}>
                      {ev.time && (
                        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                          <span
                            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                            style={{
                              width: "28px",
                              height: "28px",
                              background: "rgba(56, 189, 248, 0.15)",
                              color: "#38bdf8",
                              fontSize: "0.85rem",
                            }}
                          >
                            <i className="bi bi-clock"></i>
                          </span>
                          <span className="fw-medium text-white" style={{ fontSize: "0.9rem" }}>
                            {ev.time}
                          </span>
                        </div>
                      )}

                      {ev.venue && (
                        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                          <span
                            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                            style={{
                              width: "28px",
                              height: "28px",
                              background: "rgba(148, 163, 184, 0.12)",
                              color: "#94a3b8",
                              fontSize: "0.85rem",
                            }}
                          >
                            <i className="bi bi-geo-alt"></i>
                          </span>
                          <span className="text-truncate" style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>
                            {ev.venue}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Row */}
                    <div
                      className="d-flex align-items-center justify-content-between pt-3 border-top"
                      style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
                    >
                      <span className="small fw-medium" style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                        Tap to select
                      </span>
                      <div
                        className="d-inline-flex align-items-center justify-content-center fw-bold rounded-pill"
                        style={{
                          gap: "8px",
                          padding: "6px 14px",
                          fontSize: "0.82rem",
                          background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                          color: "#ffffff",
                          boxShadow: "0 2px 10px rgba(2, 132, 199, 0.35)",
                        }}
                      >
                        <i className="bi bi-qr-code-scan"></i>
                        <span>Scan</span>
                        <i className="bi bi-chevron-right" style={{ fontSize: "0.75rem" }}></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileScanner;
