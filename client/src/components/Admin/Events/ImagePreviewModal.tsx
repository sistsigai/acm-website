import React from "react";

interface ImagePreviewModalProps {
  previewImage: { src: string; title: string; ratio?: string } | null;
  onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  previewImage,
  onClose,
}) => {
  if (!previewImage) return null;

  return (
    <div
      className="admin-modal-overlay"
      style={{ zIndex: 1100, backdropFilter: "blur(10px)", background: "rgba(3, 7, 18, 0.88)" }}
      onClick={onClose}
    >
      <div
        className="admin-modal-container p-0 m-3 overflow-hidden d-flex flex-column"
        style={{
          maxWidth: "850px",
          width: "100%",
          background: "linear-gradient(165deg, #090d16 0%, #030712 100%)",
          border: "1px solid rgba(56, 189, 248, 0.3)",
          boxShadow: "0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(56, 189, 248, 0.2)",
          borderRadius: "16px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom border-dark border-opacity-50">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-eye text-primary fs-5"></i>
            <h5 className="m-0 text-white fw-bold fs-6">{previewImage.title}</h5>
            {previewImage.ratio && (
              <span
                className="badge ms-2 px-2 py-0.5"
                style={{
                  background: "rgba(56, 189, 248, 0.12)",
                  color: "#38bdf8",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                {previewImage.ratio}
              </span>
            )}
          </div>
          <button
            type="button"
            className="btn btn-sm btn-link text-secondary p-1"
            onClick={onClose}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Image Preview Container */}
        <div
          className="p-3 d-flex align-items-center justify-content-center"
          style={{
            background: "radial-gradient(circle at center, rgba(15, 23, 42, 0.8) 0%, rgba(3, 7, 18, 0.95) 100%)",
            minHeight: "300px",
            maxHeight: "72vh",
            overflow: "auto",
          }}
        >
          <img
            src={previewImage.src}
            alt={previewImage.title}
            style={{
              maxWidth: "100%",
              maxHeight: "68vh",
              objectFit: "contain",
              borderRadius: "10px",
              boxShadow: "0 15px 35px rgba(0,0,0,0.7), 0 0 20px rgba(56, 189, 248, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          />
        </div>

        {/* Footer */}
        <div className="d-flex align-items-center justify-content-between px-4 py-2.5 border-top border-dark border-opacity-50">
          <a
            href={previewImage.src}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-link text-info text-decoration-none p-0 d-inline-flex align-items-center gap-1.5"
            style={{ fontSize: "0.82rem" }}
          >
            <i className="bi bi-box-arrow-up-right"></i> Open full image in new tab
          </a>
          <button
            type="button"
            className="btn-admin-secondary px-3 py-1.5"
            style={{ fontSize: "0.85rem" }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
