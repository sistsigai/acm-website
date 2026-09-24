import React from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";

interface EventCropperModalProps {
  show: boolean;
  imageToCrop: string;
  cropTarget: "thumbnail" | "poster" | null;
  crop: Point;
  zoom: number;
  onCropChange: (crop: Point) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const EventCropperModal: React.FC<EventCropperModalProps> = ({
  show,
  imageToCrop,
  cropTarget,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onSave,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {show && imageToCrop && (
        <m.div
          className="admin-modal-overlay"
          style={{ zIndex: 1100 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
        >
          <m.div
            className="event-crop-modal p-4 m-2"
            style={{ maxWidth: "760px", width: "100%" }}
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 320, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom border-dark border-opacity-50">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    background: "rgba(56, 189, 248, 0.15)",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    color: "#38bdf8",
                  }}
                >
                  <i className="bi bi-crop fs-5"></i>
                </div>
                <div>
                  <h5 className="m-0 fw-bold text-white tracking-tight" style={{ fontSize: "1.1rem" }}>
                    {cropTarget === "thumbnail"
                      ? "Event Thumbnail Framing (16:9 Card Ratio)"
                      : "Event Poster Framing (1810 × 2560 Poster)"}
                  </h5>
                  <p className="text-secondary small mb-0 mt-0.5" style={{ fontSize: "0.78rem" }}>
                    {cropTarget === "thumbnail"
                      ? "Align visual elements for the 16:9 website event cards"
                      : "Drag and zoom to perfectly frame the event poster visual"}
                  </p>
                </div>
              </div>
              <m.button
                type="button"
                className="btn btn-sm btn-link text-secondary text-decoration-none p-1.5 rounded-circle hover-light"
                onClick={onCancel}
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="bi bi-x-lg"></i>
              </m.button>
            </div>

            {/* Cropper Viewport */}
            <div
              className="position-relative overflow-hidden rounded-3 mb-3"
              style={{
                height: cropTarget === "thumbnail" ? "400px" : "460px",
                background: "#020617",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "inset 0 0 40px rgba(0,0,0,0.8)",
              }}
            >
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={cropTarget === "thumbnail" ? 16 / 9 : 1810 / 2560}
                restrictPosition={true}
                minZoom={1}
                maxZoom={4}
                onCropChange={onCropChange}
                onCropComplete={onCropComplete}
                onZoomChange={onZoomChange}
                showGrid={true}
              />
            </div>

            {/* Footer Controls */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 pt-2">
              <div className="d-flex align-items-center w-100 w-sm-auto" style={{ gap: "12px" }}>
                <i className="bi bi-zoom-out text-secondary" style={{ fontSize: "1rem", flexShrink: 0 }}></i>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => onZoomChange(Number(e.target.value))}
                  className="form-range"
                  style={{ width: 140, cursor: "pointer", margin: "0 4px" }}
                />
                <i className="bi bi-zoom-in text-secondary" style={{ fontSize: "1rem", flexShrink: 0 }}></i>
                <span
                  className="badge rounded-pill bg-dark border border-secondary text-secondary"
                  style={{
                    fontSize: "0.75rem",
                    padding: "6px 12px",
                    marginLeft: "8px",
                    letterSpacing: "0.5px",
                  }}
                >
                  {zoom.toFixed(1)}x
                </span>
              </div>
              <div className="d-flex align-items-center w-100 w-sm-auto justify-content-end" style={{ gap: "10px" }}>
                <m.button
                  type="button"
                  className="btn-admin-secondary"
                  onClick={onCancel}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Cancel
                </m.button>
                <m.button
                  type="button"
                  className="btn-admin-primary"
                  onClick={onSave}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <i className="bi bi-check2 fs-5"></i>
                  <span>Apply Crop</span>
                </m.button>
              </div>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default EventCropperModal;