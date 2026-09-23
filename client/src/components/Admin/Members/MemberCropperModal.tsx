import React from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";

interface MemberCropperModalProps {
  show: boolean;
  imageToCrop: string;
  crop: Point;
  zoom: number;
  onCropChange: (crop: Point) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const MemberCropperModal: React.FC<MemberCropperModalProps> = ({
  show,
  imageToCrop,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onSave,
  onCancel,
}) => {
  if (!show || !imageToCrop) return null;

  return (
    <div className="admin-modal-overlay" style={{ zIndex: 1100 }}>
      <div className="admin-modal-container p-4 m-2" style={{ maxWidth: "720px", width: "100%" }}>
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
                Member Portrait Framing (3:4 Portrait)
              </h5>
              <p className="text-secondary small mb-0 mt-0.5" style={{ fontSize: "0.78rem" }}>
                Drag and zoom to align the profile picture
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-link text-secondary p-1 rounded-circle"
            onClick={onCancel}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Cropper Viewport */}
        <div
          className="position-relative overflow-hidden rounded-3 mb-3"
          style={{
            height: "440px",
            background: "#020617",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <Cropper
            image={imageToCrop}
            crop={crop}
            zoom={zoom}
            aspect={3 / 4}
            showGrid={true}
            onCropChange={onCropChange}
            onCropComplete={onCropComplete}
            onZoomChange={onZoomChange}
          />
        </div>

        {/* Footer */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 pt-2">
          <div className="d-flex align-items-center w-100 w-sm-auto" style={{ gap: "12px" }}>
            <i className="bi bi-zoom-out text-secondary"></i>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="form-range"
              style={{ width: 140, cursor: "pointer" }}
            />
            <i className="bi bi-zoom-in text-secondary"></i>
            <span className="badge bg-dark border border-secondary text-secondary ms-2">
              {zoom.toFixed(1)}x
            </span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn-admin-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-admin-primary"
              onClick={onSave}
            >
              <i className="bi bi-check2 fs-5"></i>
              <span>Apply Crop</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCropperModal;
