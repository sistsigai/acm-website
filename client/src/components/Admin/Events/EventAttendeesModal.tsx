import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaQrcode,
  FaUsers,
  FaCheckCircle,
  FaExclamationTriangle,
  FaDownload,
  FaSearch,
  FaCamera,
  FaStop,
  FaPlay,
  FaPhoneAlt,
  FaEnvelope,
  FaSync,
  FaInfoCircle,
  FaClock,
} from "react-icons/fa";
import { Html5Qrcode, type CameraDevice } from "html5-qrcode";
import type { AdminEvent } from "./EventCard";
import {
  getEventRegistrations,
  scanAttendanceQr,
  toggleRegistrationAttendance,
  exportEventRegistrationsCsv,
  type AttendeeRecord,
  type AttendanceMetrics,
} from "../../../services/admin/eventService";

interface EventAttendeesModalProps {
  event: AdminEvent | null;
  onClose: () => void;
  showToast?: (message: string, variant: "success" | "error" | "info" | "warning") => void;
}

export const EventAttendeesModal: React.FC<EventAttendeesModalProps> = ({
  event,
  onClose,
  showToast,
}) => {
  if (!event) return null;

  const [activeTab, setActiveTab] = useState<"scanner" | "roster">("scanner");
  const [registrations, setRegistrations] = useState<AttendeeRecord[]>([]);
  const [metrics, setMetrics] = useState<AttendanceMetrics>({
    totalRegistered: 0,
    totalPresent: 0,
    totalAbsent: 0,
    attendanceRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "present" | "absent">("all");
  const [selectedAttendeeAnswers, setSelectedAttendeeAnswers] = useState<AttendeeRecord | null>(null);

  // Scanner States
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [isProcessingScan, setIsProcessingScan] = useState(false);
  const [scanResult, setScanResult] = useState<{
    type: "success" | "warning" | "error";
    message: string;
    attendee?: AttendeeRecord;
    timestamp?: string;
  } | null>(null);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Audio Beep for Scan Confirmation
  const playAudioBeep = (type: "success" | "warning" | "error") => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "success") {
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitch A5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else if (type === "warning") {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // Lower pitch A4
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        osc.frequency.setValueAtTime(220, audioCtx.currentTime); // Low buzz
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      }
    } catch {
      // AudioContext not supported or permission denied
    }
  };

  // Fetch attendees list and statistics
  const fetchAttendees = async () => {
    try {
      setLoading(true);
      const res = await getEventRegistrations(event._id, {
        search: searchTerm,
        status: statusFilter,
      });
      if (res.success) {
        setRegistrations(res.registrations);
        setMetrics(res.metrics);
      }
    } catch (err: any) {
      showToast?.(err.message || "Failed to load attendees", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, [event._id, statusFilter]);

  // Handle Search Filtering
  const filteredRegistrations = useMemo(() => {
    if (!searchTerm.trim()) return registrations;
    const term = searchTerm.toLowerCase();
    return registrations.filter(
      (r) =>
        r.name?.toLowerCase().includes(term) ||
        r.email?.toLowerCase().includes(term) ||
        r.registerNo?.toLowerCase().includes(term) ||
        r.phone?.toLowerCase().includes(term) ||
        r.dept?.toLowerCase().includes(term)
    );
  }, [registrations, searchTerm]);

  // Handle Camera List Initialization
  useEffect(() => {
    let mounted = true;
    if (activeTab === "scanner") {
      Html5Qrcode.getCameras()
        .then((devices) => {
          if (mounted && devices && devices.length > 0) {
            setCameras(devices);
            // Default to back camera on mobile or first camera on desktop
            const backCam = devices.find(
              (d) => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("environment")
            );
            setSelectedCameraId(backCam ? backCam.id : devices[0].id);
          }
        })
        .catch((err) => {
          console.warn("Could not get cameras:", err);
        });
    }

    return () => {
      mounted = false;
      stopScanner();
    };
  }, [activeTab]);

  // Start Scanner
  const startScanner = async (cameraId: string) => {
    try {
      if (!cameraId) return;
      if (html5QrCodeRef.current && isScanning) {
        await stopScanner();
      }

      const qrScanner = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = qrScanner;

      await qrScanner.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleQrScan(decodedText);
        },
        () => {
          // Frame decode error (normal between frames)
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error("Camera start error:", err);
      showToast?.("Failed to start camera. Please check camera permissions.", "error");
      setIsScanning(false);
    }
  };

  // Stop Scanner
  const stopScanner = async () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    if (html5QrCodeRef.current) {
      try {
        if (isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn("Camera stop error:", err);
      }
      html5QrCodeRef.current = null;
      setIsScanning(false);
    }
  };

  // Handle QR Scan Result
  const handleQrScan = async (qrDataString: string) => {
    if (isProcessingScan) return;
    setIsProcessingScan(true);

    try {
      // Pause scanner while showing result
      if (html5QrCodeRef.current && isScanning) {
        html5QrCodeRef.current.pause();
      }

      const res = await scanAttendanceQr(event._id, qrDataString);

      if (res.alreadyCheckedIn) {
        playAudioBeep("warning");
        setScanResult({
          type: "warning",
          message: "Attendee is already checked in!",
          attendee: res.registration,
          timestamp: res.checkedInAt ? new Date(res.checkedInAt).toLocaleTimeString() : undefined,
        });
      } else {
        playAudioBeep("success");
        setScanResult({
          type: "success",
          message: "Attendance Marked Successfully!",
          attendee: res.registration,
          timestamp: res.checkedInAt ? new Date(res.checkedInAt).toLocaleTimeString() : undefined,
        });

        // Update local list & metrics
        setRegistrations((prev) =>
          prev.map((r) => (r._id === res.registration._id ? { ...r, entry: true, checkedInAt: res.registration.checkedInAt } : r))
        );
        setMetrics((prev) => ({
          ...prev,
          totalPresent: prev.totalPresent + 1,
          totalAbsent: Math.max(0, prev.totalAbsent - 1),
          attendanceRate: prev.totalRegistered > 0 ? Math.round(((prev.totalPresent + 1) / prev.totalRegistered) * 100) : 0,
        }));
      }

      // Automatically resume scanning after 3.5 seconds
      resumeTimerRef.current = setTimeout(() => {
        resumeScanning();
      }, 3500);
    } catch (err: any) {
      playAudioBeep("error");
      setScanResult({
        type: "error",
        message: err.message || "Invalid QR ticket or ticket does not belong to this event",
      });

      resumeTimerRef.current = setTimeout(() => {
        resumeScanning();
      }, 3500);
    } finally {
      setIsProcessingScan(false);
    }
  };

  // Resume camera scanning
  const resumeScanning = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    setScanResult(null);
    if (html5QrCodeRef.current) {
      try {
        html5QrCodeRef.current.resume();
      } catch (e) {
        console.warn("Resume failed:", e);
      }
    }
  };

  // Manual Check-in
  const handleManualCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    await handleQrScan(manualInput.trim());
    setManualInput("");
  };

  // Manual Attendance Toggle from Roster
  const handleToggleAttendance = async (attendee: AttendeeRecord) => {
    const newStatus = !attendee.entry;
    try {
      const res = await toggleRegistrationAttendance(attendee._id, newStatus);
      if (res.success) {
        showToast?.(`Marked ${attendee.name} as ${newStatus ? "Present" : "Absent"}`, "success");
        setRegistrations((prev) =>
          prev.map((r) =>
            r._id === attendee._id
              ? { ...r, entry: newStatus, checkedInAt: res.registration.checkedInAt }
              : r
          )
        );
        setMetrics((prev) => {
          const presentDelta = newStatus ? 1 : -1;
          const newPresent = Math.max(0, prev.totalPresent + presentDelta);
          const newAbsent = Math.max(0, prev.totalRegistered - newPresent);
          return {
            ...prev,
            totalPresent: newPresent,
            totalAbsent: newAbsent,
            attendanceRate: prev.totalRegistered > 0 ? Math.round((newPresent / prev.totalRegistered) * 100) : 0,
          };
        });
      }
    } catch (err: any) {
      showToast?.(err.message || "Failed to update attendance", "error");
    }
  };

  // CSV Export
  const handleExportCsv = async () => {
    try {
      await exportEventRegistrationsCsv(event._id, event.name);
      showToast?.("Attendance roster CSV downloaded successfully", "success");
    } catch (err: any) {
      showToast?.(err.message || "Failed to export CSV", "error");
    }
  };

  return (
    <AnimatePresence>
      <m.div
        className="events-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ zIndex: 1050 }}
      >
        <m.div
          className="modal-content"
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: "1050px",
            width: "95vw",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            background: "#080c16",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.95), 0 0 35px rgba(56, 189, 248, 0.15)",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            className="p-3.5 px-4 d-flex align-items-center justify-content-between border-bottom"
            style={{
              borderColor: "rgba(56, 189, 248, 0.15)",
              background: "linear-gradient(180deg, #0d1527 0%, #080c16 100%)",
            }}
          >
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-30 px-2 py-0.5" style={{ fontSize: "0.7rem" }}>
                  EVENT ATTENDANCE
                </span>
                <span className="text-secondary small font-monospace">
                  {event.date} • {event.time}
                </span>
              </div>
              <h4 className="fw-bold text-white m-0" style={{ fontSize: "1.25rem", letterSpacing: "-0.3px" }}>
                {event.name}
              </h4>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-icon text-secondary rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 34, height: 34, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              onClick={onClose}
            >
              <FaTimes />
            </button>
          </div>

          {/* Metrics Ribbon */}
          <div
            className="p-3 px-4 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-3"
            style={{
              borderColor: "rgba(255, 255, 255, 0.06)",
              background: "rgba(15, 23, 42, 0.5)",
            }}
          >
            <div className="d-flex align-items-center gap-3 flex-wrap">
              {/* Total Registered */}
              <div className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-3" style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.25)" }}>
                <FaUsers className="text-primary" />
                <span className="text-secondary small">Registered:</span>
                <span className="text-white fw-bold">{metrics.totalRegistered}</span>
              </div>

              {/* Present */}
              <div className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-3" style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.25)" }}>
                <FaCheckCircle className="text-success" />
                <span className="text-secondary small">Present:</span>
                <span className="text-success fw-bold">{metrics.totalPresent}</span>
              </div>

              {/* Absent */}
              <div className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-3" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)" }}>
                <FaClock className="text-danger" />
                <span className="text-secondary small">Pending / Absent:</span>
                <span className="text-danger fw-bold">{metrics.totalAbsent}</span>
              </div>

              {/* Rate */}
              <div className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-3" style={{ background: "rgba(168, 85, 247, 0.1)", border: "1px solid rgba(168, 85, 247, 0.25)" }}>
                <span className="text-secondary small">Turnout:</span>
                <span className="text-white fw-bold">{metrics.attendanceRate}%</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="d-flex p-1 rounded-3" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <button
                type="button"
                className={`btn btn-sm d-flex align-items-center gap-1.5 px-3 py-1 border-0 fw-semibold rounded-2 ${
                  activeTab === "scanner" ? "btn-primary shadow-sm" : "text-secondary"
                }`}
                style={{ fontSize: "0.82rem" }}
                onClick={() => setActiveTab("scanner")}
              >
                <FaQrcode />
                <span>QR Scanner</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm d-flex align-items-center gap-1.5 px-3 py-1 border-0 fw-semibold rounded-2 ${
                  activeTab === "roster" ? "btn-primary shadow-sm" : "text-secondary"
                }`}
                style={{ fontSize: "0.82rem" }}
                onClick={() => setActiveTab("roster")}
              >
                <FaUsers />
                <span>Attendees ({metrics.totalRegistered})</span>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-4 flex-grow-1 overflow-y-auto" style={{ minHeight: "420px" }}>
            {activeTab === "scanner" ? (
              /* TAB 1: LIVE QR SCANNER */
              <div className="row g-4 justify-content-center">
                <div className="col-12 col-md-7 col-lg-6">
                  <div
                    className="p-3 rounded-4 position-relative d-flex flex-column align-items-center"
                    style={{
                      background: "rgba(15, 23, 42, 0.8)",
                      border: "1px solid rgba(56, 189, 248, 0.25)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                    }}
                  >
                    {/* Camera Controls */}
                    <div className="w-100 d-flex align-items-center justify-content-between mb-3 gap-2">
                      <div className="d-flex align-items-center gap-2 flex-grow-1">
                        <FaCamera className="text-primary flex-shrink-0" />
                        <select
                          className="form-select form-select-sm bg-dark text-white border-secondary"
                          value={selectedCameraId}
                          onChange={(e) => {
                            setSelectedCameraId(e.target.value);
                            if (isScanning) startScanner(e.target.value);
                          }}
                          style={{ fontSize: "0.8rem", borderColor: "rgba(255,255,255,0.15)" }}
                          disabled={cameras.length === 0}
                        >
                          {cameras.length === 0 ? (
                            <option value="">No cameras found</option>
                          ) : (
                            cameras.map((c, i) => (
                              <option key={c.id} value={c.id}>
                                {c.label || `Camera ${i + 1}`}
                              </option>
                            ))
                          )}
                        </select>
                      </div>

                      <button
                        type="button"
                        className={`btn btn-sm d-flex align-items-center gap-1.5 px-3 rounded-2 fw-semibold ${
                          isScanning ? "btn-danger" : "btn-success"
                        }`}
                        style={{ fontSize: "0.8rem" }}
                        onClick={() => {
                          if (isScanning) {
                            stopScanner();
                          } else {
                            startScanner(selectedCameraId);
                          }
                        }}
                      >
                        {isScanning ? (
                          <>
                            <FaStop size={11} /> Stop
                          </>
                        ) : (
                          <>
                            <FaPlay size={11} /> Start Scan
                          </>
                        )}
                      </button>
                    </div>

                    {/* Camera Viewport Container */}
                    <div
                      id="qr-reader"
                      style={{
                        width: "100%",
                        minHeight: "280px",
                        borderRadius: "12px",
                        overflow: "hidden",
                        background: "#030712",
                        border: "2px dashed rgba(56, 189, 248, 0.3)",
                      }}
                    />

                    {!isScanning && (
                      <div className="position-absolute top-50 start-50 translate-middle text-center p-3 pointer-events-none">
                        <FaQrcode size={44} className="text-secondary opacity-30 mb-2" />
                        <p className="text-secondary small m-0">Click "Start Scan" to activate the camera</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Scan Results & Manual Entry Column */}
                <div className="col-12 col-md-5 col-lg-6 d-flex flex-column gap-3">
                  {/* Scan Result Feedback Banner */}
                  {scanResult && (
                    <m.div
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`p-3 rounded-3 border ${
                        scanResult.type === "success"
                          ? "bg-success bg-opacity-10 border-success text-success"
                          : scanResult.type === "warning"
                          ? "bg-warning bg-opacity-10 border-warning text-warning"
                          : "bg-danger bg-opacity-10 border-danger text-danger"
                      }`}
                    >
                      <div className="d-flex align-items-start gap-2.5 mb-2">
                        {scanResult.type === "success" ? (
                          <FaCheckCircle className="fs-5 flex-shrink-0 mt-0.5" />
                        ) : scanResult.type === "warning" ? (
                          <FaExclamationTriangle className="fs-5 flex-shrink-0 mt-0.5" />
                        ) : (
                          <FaTimes className="fs-5 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <h6 className="fw-bold mb-0">{scanResult.message}</h6>
                          {scanResult.timestamp && (
                            <small className="opacity-75 font-monospace">Checked in at {scanResult.timestamp}</small>
                          )}
                        </div>
                      </div>

                      {scanResult.attendee && (
                        <div className="p-2.5 rounded-2 mt-2 bg-dark bg-opacity-50 text-white font-monospace small">
                          <div className="fw-bold fs-6 text-info">{scanResult.attendee.name}</div>
                          <div>Reg No: {scanResult.attendee.registerNo}</div>
                          <div>Dept: {scanResult.attendee.dept} • Year: {scanResult.attendee.year}</div>
                          <div className="text-secondary">{scanResult.attendee.email}</div>
                        </div>
                      )}

                      <div className="d-flex justify-content-end mt-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light py-0 px-2 fw-semibold"
                          style={{ fontSize: "0.72rem" }}
                          onClick={resumeScanning}
                        >
                          Scan Next Immediately
                        </button>
                      </div>
                    </m.div>
                  )}

                  {/* Manual Input Fallback Card */}
                  <div
                    className="p-3.5 rounded-4"
                    style={{
                      background: "rgba(15, 23, 42, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <h6 className="fw-bold text-white mb-1.5 d-flex align-items-center gap-2">
                      <FaSearch className="text-primary small" />
                      <span>Manual Check-in</span>
                    </h6>
                    <p className="text-secondary small mb-3">
                      If camera is unavailable, paste the raw QR code text or registration ID to record attendance:
                    </p>

                    <form onSubmit={handleManualCheckIn} className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control form-control-sm bg-dark text-white border-secondary"
                        placeholder="Paste QR payload or Reg ID..."
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        style={{ fontSize: "0.82rem" }}
                      />
                      <button
                        type="submit"
                        disabled={!manualInput.trim() || isProcessingScan}
                        className="btn btn-sm btn-primary px-3 fw-semibold flex-shrink-0"
                      >
                        Check-in
                      </button>
                    </form>
                  </div>

                  {/* Instructions */}
                  <div
                    className="p-3 rounded-4"
                    style={{
                      background: "rgba(56, 189, 248, 0.04)",
                      border: "1px solid rgba(56, 189, 248, 0.15)",
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 text-primary fw-semibold mb-1 small">
                      <FaInfoCircle />
                      <span>Venue Entry Guide</span>
                    </div>
                    <ul className="text-secondary small m-0 ps-3" style={{ fontSize: "0.78rem", lineHeight: 1.6 }}>
                      <li>Attendees can present their ticket QR code on phone or printed pass.</li>
                      <li>Point camera at the QR code; attendance marks automatically within 1 second.</li>
                      <li>Duplicate scans trigger an instant warning to prevent re-entry fraud.</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              /* TAB 2: REGISTERED ATTENDEES ROSTER */
              <div className="d-flex flex-column gap-3">
                {/* Search & Actions Bar */}
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ maxWidth: "420px" }}>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-dark border-secondary text-secondary">
                        <FaSearch size={12} />
                      </span>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="Search by name, email, reg no, phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ fontSize: "0.82rem" }}
                      />
                    </div>
                  </div>

                  {/* Filter & Export Buttons */}
                  <div className="d-flex align-items-center gap-2">
                    <div className="btn-group btn-group-sm" role="group">
                      <button
                        type="button"
                        className={`btn ${statusFilter === "all" ? "btn-primary" : "btn-outline-secondary text-secondary"}`}
                        onClick={() => setStatusFilter("all")}
                      >
                        All ({metrics.totalRegistered})
                      </button>
                      <button
                        type="button"
                        className={`btn ${statusFilter === "present" ? "btn-success" : "btn-outline-secondary text-secondary"}`}
                        onClick={() => setStatusFilter("present")}
                      >
                        Present ({metrics.totalPresent})
                      </button>
                      <button
                        type="button"
                        className={`btn ${statusFilter === "absent" ? "btn-danger" : "btn-outline-secondary text-secondary"}`}
                        onClick={() => setStatusFilter("absent")}
                      >
                        Absent ({metrics.totalAbsent})
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-info d-flex align-items-center gap-1.5 px-3 fw-semibold"
                      onClick={handleExportCsv}
                      title="Export CSV"
                    >
                      <FaDownload size={11} />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Attendees Table */}
                <div
                  className="rounded-3 overflow-hidden border"
                  style={{ borderColor: "rgba(255, 255, 255, 0.08)", background: "rgba(11, 17, 32, 0.7)" }}
                >
                  <div className="table-responsive" style={{ maxHeight: "420px" }}>
                    <table className="table table-dark table-hover m-0 align-middle" style={{ fontSize: "0.84rem" }}>
                      <thead>
                        <tr style={{ background: "rgba(15, 23, 42, 0.9)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                          <th className="py-2.5 px-3 text-secondary text-uppercase fw-semibold" style={{ fontSize: "0.72rem" }}>
                            #
                          </th>
                          <th className="py-2.5 px-3 text-secondary text-uppercase fw-semibold" style={{ fontSize: "0.72rem" }}>
                            Attendee
                          </th>
                          <th className="py-2.5 px-3 text-secondary text-uppercase fw-semibold" style={{ fontSize: "0.72rem" }}>
                            Reg No & Dept
                          </th>
                          <th className="py-2.5 px-3 text-secondary text-uppercase fw-semibold" style={{ fontSize: "0.72rem" }}>
                            Contact
                          </th>
                          <th className="py-2.5 px-3 text-secondary text-uppercase fw-semibold" style={{ fontSize: "0.72rem" }}>
                            Custom Answers
                          </th>
                          <th className="py-2.5 px-3 text-secondary text-uppercase fw-semibold" style={{ fontSize: "0.72rem" }}>
                            Attendance
                          </th>
                          <th className="py-2.5 px-3 text-end text-secondary text-uppercase fw-semibold" style={{ fontSize: "0.72rem" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan={7} className="text-center py-4 text-secondary">
                              <FaSync className="spinner-border spinner-border-sm text-primary me-2" />
                              Loading registered attendees...
                            </td>
                          </tr>
                        ) : filteredRegistrations.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-4 text-secondary">
                              No attendees found matching current filter.
                            </td>
                          </tr>
                        ) : (
                          filteredRegistrations.map((attendee, index) => (
                            <tr key={attendee._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                              <td className="px-3 text-secondary font-monospace">{index + 1}</td>
                              <td className="px-3">
                                <div className="fw-semibold text-white">{attendee.name}</div>
                                <div className="text-secondary small font-monospace d-flex align-items-center gap-1">
                                  <FaEnvelope size={10} />
                                  <span>{attendee.email}</span>
                                </div>
                              </td>
                              <td className="px-3">
                                <div className="text-info fw-medium font-monospace">{attendee.registerNo}</div>
                                <div className="text-secondary small">
                                  {attendee.dept} {attendee.year && attendee.year !== "N/A" ? `• Yr ${attendee.year}` : ""} {attendee.section && attendee.section !== "N/A" ? `Sec ${attendee.section}` : ""}
                                </div>
                              </td>
                              <td className="px-3">
                                {attendee.phone && attendee.phone !== "N/A" ? (
                                  <a href={`tel:${attendee.phone}`} className="text-decoration-none text-light d-flex align-items-center gap-1">
                                    <FaPhoneAlt size={10} className="text-success" />
                                    <span>{attendee.phone}</span>
                                  </a>
                                ) : (
                                  <span className="text-secondary">N/A</span>
                                )}
                              </td>
                              <td className="px-3">
                                {attendee.answers && Object.keys(attendee.answers).length > 0 ? (
                                  <button
                                    type="button"
                                    className="btn btn-xs btn-outline-secondary py-0.5 px-2 rounded-pill"
                                    style={{ fontSize: "0.72rem" }}
                                    onClick={() => setSelectedAttendeeAnswers(attendee)}
                                  >
                                    View ({Object.keys(attendee.answers).length})
                                  </button>
                                ) : (
                                  <span className="text-secondary small">Standard</span>
                                )}
                              </td>
                              <td className="px-3">
                                {attendee.entry ? (
                                  <div>
                                    <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-30 px-2 py-1 d-inline-flex align-items-center gap-1">
                                      <FaCheckCircle size={10} /> Present
                                    </span>
                                    {attendee.checkedInAt && (
                                      <div className="text-secondary font-monospace mt-0.5" style={{ fontSize: "0.68rem" }}>
                                        {new Date(attendee.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="badge bg-secondary bg-opacity-20 text-secondary border border-secondary border-opacity-30 px-2 py-1 d-inline-flex align-items-center gap-1">
                                    <FaClock size={10} /> Absent
                                  </span>
                                )}
                              </td>
                              <td className="px-3 text-end">
                                <button
                                  type="button"
                                  className={`btn btn-sm py-0.5 px-2.5 rounded-2 fw-semibold ${
                                    attendee.entry ? "btn-outline-danger" : "btn-outline-success"
                                  }`}
                                  style={{ fontSize: "0.74rem" }}
                                  onClick={() => handleToggleAttendance(attendee)}
                                >
                                  {attendee.entry ? "Mark Absent" : "Mark Present"}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </m.div>

        {/* Custom Answers Popover / Sub-Modal */}
        {selectedAttendeeAnswers && (
          <m.div
            className="events-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAttendeeAnswers(null)}
            style={{ zIndex: 1100, background: "rgba(0,0,0,0.75)" }}
          >
            <m.div
              className="p-4 rounded-4 text-white"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "90%",
                maxWidth: "500px",
                background: "#0c1322",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.9)",
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <div>
                  <h6 className="fw-bold mb-0 text-white">{selectedAttendeeAnswers.name}</h6>
                  <small className="text-secondary font-monospace">{selectedAttendeeAnswers.email}</small>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-icon text-secondary"
                  onClick={() => setSelectedAttendeeAnswers(null)}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="d-flex flex-column gap-2.5 overflow-y-auto" style={{ maxHeight: "350px" }}>
                {selectedAttendeeAnswers.answers &&
                  Object.entries(selectedAttendeeAnswers.answers).map(([q, ans], i) => (
                    <div key={i} className="p-2.5 rounded-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="text-secondary small fw-semibold mb-1">{q}</div>
                      <div className="text-light small font-monospace">
                        {Array.isArray(ans) ? (
                          ans.map((item, idx) => (
                            <div key={idx}>
                              {typeof item === "string" && item.startsWith("http") ? (
                                <a href={item} target="_blank" rel="noreferrer" className="text-info text-decoration-none d-inline-flex align-items-center gap-1">
                                  <span>View Uploaded File {idx + 1}</span>
                                </a>
                              ) : (
                                String(item)
                              )}
                            </div>
                          ))
                        ) : typeof ans === "string" && ans.startsWith("http") ? (
                          <a href={ans} target="_blank" rel="noreferrer" className="text-info text-decoration-none d-inline-flex align-items-center gap-1">
                            <span>Open Attachment / File</span>
                          </a>
                        ) : (
                          String(ans || "No answer")
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </m.div>
          </m.div>
        )}
      </m.div>
    </AnimatePresence>
  );
};

export default EventAttendeesModal;
