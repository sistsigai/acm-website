import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface CameraScannerProps {
  onScan: (qrData: string) => void;
  isPaused: boolean;
  torchOn: boolean;
  facingMode: "environment" | "user";
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onScan,
  isPaused,
  torchOn,
  facingMode,
}) => {
  const containerId = "html5-qr-reader-viewport";
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasTorch, setHasTorch] = useState(false);
  const lastScanTime = useRef<number>(0);

  const isPausedRef = useRef(isPaused);
  const onScanRef = useRef(onScan);

  useEffect(() => {
    isPausedRef.current = isPaused;
    if (scannerRef.current) {
      if (isPaused) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.pause(true);
          }
        } catch {}
      } else {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.resume();
          }
        } catch {}
      }
    }
  }, [isPaused]);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  // Handle successful scan with single-fire lock
  const handleDecoded = useCallback((decodedText: string) => {
    if (isPausedRef.current) {
      return;
    }
    const now = Date.now();
    if (now - lastScanTime.current < 2500) {
      return;
    }
    lastScanTime.current = now;
    isPausedRef.current = true; // Lock immediately

    // Pause hardware stream
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        scannerRef.current.pause(true);
      } catch {}
    }

    onScanRef.current(decodedText);
  }, []);

  // Start Scanner
  const startCamera = useCallback(async () => {
    setIsInitializing(true);
    setCameraError(null);

    try {
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            await scannerRef.current.stop();
          }
          await scannerRef.current.clear();
        } catch {}
      }

      const html5QrCode = new Html5Qrcode(containerId);
      scannerRef.current = html5QrCode;

      const qrConfig = {
        fps: 15,
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          const qrEdge = Math.max(220, Math.min(Math.floor(minEdge * 0.75), 280));
          return { width: qrEdge, height: qrEdge };
        },
        disableFlip: false,
      };

      await html5QrCode.start(
        { facingMode },
        qrConfig,
        (decodedText) => {
          handleDecoded(decodedText);
        },
        () => {}
      );

      // Check torch capability
      try {
        const capabilities = html5QrCode.getRunningTrackCameraCapabilities();
        if (capabilities && (capabilities as any).torchFeature) {
          setHasTorch(true);
        }
      } catch {}

      setIsInitializing(false);
    } catch (err: any) {
      console.error("Camera initialization error:", err);
      setIsInitializing(false);
      setCameraError(
        err?.message ||
          "Camera access denied or unavailable. Please grant camera permissions in your browser."
      );
    }
  }, [facingMode, handleDecoded]);

  // Torch control effect
  useEffect(() => {
    if (scannerRef.current && scannerRef.current.isScanning && hasTorch) {
      try {
        const capabilities = scannerRef.current.getRunningTrackCameraCapabilities();
        const torchFeature = (capabilities as any)?.torchFeature;
        if (torchFeature && typeof torchFeature.apply === "function") {
          torchFeature.apply(torchOn);
        }
      } catch (err) {
        console.warn("Torch apply error:", err);
      }
    }
  }, [torchOn, hasTorch]);

  // Mount / Unmount lifecycle
  useEffect(() => {
    startCamera();

    return () => {
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(() => {});
          }
          scannerRef.current.clear();
        } catch {}
      }
    };
  }, [startCamera]);

  return (
    <div
      className="position-relative w-100 h-100 overflow-hidden"
      style={{
        background: "#000000",
      }}
    >
      {/* HTML5 QR Camera Viewport */}
      <div id={containerId} />

      {/* Target Reticle & Laser Overlay */}
      {!cameraError && !isInitializing && (
        <div
          className="position-absolute d-flex flex-column align-items-center justify-content-center"
          style={{
            inset: 0,
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          {/* Target Box with Google Pay Style Rounded Corners */}
          <div
            className="position-relative"
            style={{
              width: "260px",
              height: "260px",
              boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.62)",
              borderRadius: "24px",
              border: "2px solid rgba(56, 189, 248, 0.3)",
            }}
          >
            {/* Top-Left Bracket */}
            <div
              style={{
                position: "absolute",
                top: "-2px",
                left: "-2px",
                width: "36px",
                height: "36px",
                borderTop: "4px solid #38bdf8",
                borderLeft: "4px solid #38bdf8",
                borderTopLeftRadius: "22px",
              }}
            />
            {/* Top-Right Bracket */}
            <div
              style={{
                position: "absolute",
                top: "-2px",
                right: "-2px",
                width: "36px",
                height: "36px",
                borderTop: "4px solid #38bdf8",
                borderRight: "4px solid #38bdf8",
                borderTopRightRadius: "22px",
              }}
            />
            {/* Bottom-Left Bracket */}
            <div
              style={{
                position: "absolute",
                bottom: "-2px",
                left: "-2px",
                width: "36px",
                height: "36px",
                borderBottom: "4px solid #38bdf8",
                borderLeft: "4px solid #38bdf8",
                borderBottomLeftRadius: "22px",
              }}
            />
            {/* Bottom-Right Bracket */}
            <div
              style={{
                position: "absolute",
                bottom: "-2px",
                right: "-2px",
                width: "36px",
                height: "36px",
                borderBottom: "4px solid #38bdf8",
                borderRight: "4px solid #38bdf8",
                borderBottomRightRadius: "22px",
              }}
            />

            {/* Scanning Laser Animation Bar */}
            {!isPaused && (
              <div
                className="scanner-laser-bar"
                style={{
                  position: "absolute",
                  left: "8px",
                  right: "8px",
                  height: "3px",
                  background: "linear-gradient(90deg, transparent, #38bdf8, #60a5fa, transparent)",
                  boxShadow: "0 0 14px #38bdf8, 0 0 24px #60a5fa",
                  borderRadius: "3px",
                  animation: "scannerSweep 2s ease-in-out infinite alternate",
                }}
              />
            )}
          </div>

          <p
            className="mt-4 px-4 py-1.5 rounded-pill text-white fw-medium text-center small"
            style={{
              background: "rgba(15, 23, 42, 0.85)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              fontSize: "0.82rem",
              letterSpacing: "0.3px",
            }}
          >
            {isPaused ? "Processing scan..." : "Align QR code ticket inside the frame"}
          </p>
        </div>
      )}

      {/* Camera Loading Indicator */}
      {isInitializing && (
        <div
          className="position-absolute d-flex flex-column align-items-center justify-content-center text-white"
          style={{ inset: 0, background: "#060911", zIndex: 20 }}
        >
          <div className="spinner-border text-info mb-3" role="status" style={{ width: "2.8rem", height: "2.8rem" }}>
            <span className="visually-hidden">Starting camera...</span>
          </div>
          <span className="fw-semibold text-light" style={{ fontSize: "0.95rem" }}>
            Starting camera stream...
          </span>
          <small className="text-secondary mt-1">Please allow camera access if prompted</small>
        </div>
      )}

      {/* Camera Error Screen */}
      {cameraError && (
        <div
          className="position-absolute d-flex flex-column align-items-center justify-content-center text-center p-4 text-white"
          style={{ inset: 0, background: "#090d16", zIndex: 20 }}
        >
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{
              width: "60px",
              height: "60px",
              background: "rgba(239, 68, 68, 0.15)",
              color: "#ef4444",
              fontSize: "1.8rem",
            }}
          >
            <i className="bi bi-camera-video-off-fill"></i>
          </div>
          <h6 className="fw-bold text-white mb-2">Camera Unavailable</h6>
          <p className="text-secondary small mb-4" style={{ maxWidth: "300px" }}>
            {cameraError}
          </p>
          <button
            type="button"
            className="btn btn-primary px-4 py-2 rounded-3 fw-semibold"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
              border: "none",
            }}
            onClick={startCamera}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Retry Camera
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraScanner;
