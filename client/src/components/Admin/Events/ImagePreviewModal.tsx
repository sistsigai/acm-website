import React, { useEffect } from "react";
import { motion as m, AnimatePresence } from "framer-motion";

interface ImagePreviewModalProps {
  previewImage: { src: string; title: string; ratio?: string } | null;
  onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  previewImage,
  onClose,
}) => {
  // ESC key listener to close modal
  useEffect(() => {
    if (!previewImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewImage, onClose]);

  return (
    <AnimatePresence>
      {previewImage && (
        <m.div
          className="admin-modal-overlay"
          style={{ zIndex: 1200, backdropFilter: "blur(14px)", background: "rgba(3, 7, 18, 0.88)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <m.div
            className="admin-modal-container p-0 m-3 overflow-hidden d-flex flex-column"
            style={{
              maxWidth: "860px",
              width: "95%",
              background: "linear-gradient(165deg, #0d1527 0%, #030712 100%)",
              border: "1px solid rgba(56, 189, 248, 0.35)",
              boxShadow: "0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(56, 189, 248, 0.18)",
              borderRadius: "16px",
            }}
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 320, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="d-flex align-items-center justify-content-between px-4 py-3 flex-shrink-0"
              style={{
                background: "rgba(15, 23, 42, 0.75)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div className="d-flex align-items-center" style={{ gap: "14px" }}>
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "10px",
                    background: "rgba(56, 189, 248, 0.12)",
                    border: "1px solid rgba(56, 189, 248, 0.28)",
                    color: "#38bdf8",
                    fontSize: "1.1rem",
                  }}
                >
                  <i className="bi bi-eye"></i>
                </div>
                <div className="d-flex align-items-center flex-wrap" style={{ gap: "10px" }}>
                  <h5 className="m-0 text-white fw-bold" style={{ fontSize: "1.05rem", letterSpacing: "0.2px" }}>
                    {previewImage.title}
                  </h5>
                  {previewImage.ratio && (
                    <span
                      className="badge rounded-pill"
                      style={{
                        background: "rgba(56, 189, 248, 0.15)",
                        color: "#38bdf8",
                        border: "1px solid rgba(56, 189, 248, 0.3)",
                        padding: "5px 11px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        letterSpacing: "0.3px",
                      }}
                    >
                      {previewImage.ratio}
                    </span>
                  )}
                </div>
              </div>

              <m.button
                type="button"
                className="btn p-0 rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 34,
                  height: 34,
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#cbd5e1",
                  transition: "all 0.2s ease",
                }}
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                aria-label="Close preview"
              >
                <i className="bi bi-x-lg" style={{ fontSize: "0.9rem" }}></i>
              </m.button>
            </div>

            {/* Image Preview Container */}
            <div
              className="p-3 p-md-4 d-flex align-items-center justify-content-center flex-grow-1"
              style={{
                background: "radial-gradient(circle at center, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.98) 100%)",
                minHeight: "320px",
                maxHeight: "70vh",
                overflow: "auto",
              }}
            >
              <img
                src={previewImage.src}
                alt={previewImage.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "65vh",
                  objectFit: "contain",
                  borderRadius: "12px",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(56, 189, 248, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              />
            </div>

            {/* Footer */}
            <div
              className="d-flex align-items-center justify-content-between px-4 py-3 flex-shrink-0"
              style={{
                background: "rgba(10, 15, 30, 0.75)",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <m.a
                href={previewImage.src}
                target="_blank"
                rel="noreferrer"
                className="d-inline-flex align-items-center rounded-3 text-decoration-none"
                style={{
                  gap: "8px",
                  padding: "8px 16px",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#38bdf8",
                  background: "rgba(56, 189, 248, 0.08)",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                  transition: "all 0.2s ease",
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <i className="bi bi-box-arrow-up-right" style={{ fontSize: "0.85rem" }}></i>
                <span>Open full image in new tab</span>
              </m.a>

              <m.button
                type="button"
                className="d-inline-flex align-items-center justify-content-center rounded-3 border-0"
                style={{
                  padding: "8px 22px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#f8fafc",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
              >
                Close
              </m.button>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default ImagePreviewModal;
