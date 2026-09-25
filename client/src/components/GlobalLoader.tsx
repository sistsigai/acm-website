import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface LoaderProps {
  isLoading: boolean;
  message?: string;
  submessage?: string;
}

export const GlobalLoader: React.FC<LoaderProps> = ({
  isLoading,
  message = "Submitting...",
  submessage = "Please wait a moment",
}) => {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="global-fullpage-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(3, 7, 18, 0.82)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 999999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'wait',
            pointerEvents: 'all',
          }}
        >
          {/* Animated Glowing Ring Spinner */}
          <div
            style={{
              position: 'relative',
              width: '64px',
              height: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                inset: -6,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, rgba(99, 102, 241, 0) 70%)',
              }}
              animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            />
            <motion.div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '3px solid rgba(255, 255, 255, 0.12)',
                borderTop: '3px solid #38bdf8',
                borderRight: '3px solid #818cf8',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.45)',
              }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.85, ease: "linear" }}
            />
          </div>

          {/* Status Text Indicator */}
          <div style={{ marginTop: '1.25rem', textAlign: 'center', padding: '0 1.5rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: '#ffffff',
                fontSize: '1.1rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              {message}
            </motion.div>
            {submessage && (
              <div
                style={{
                  marginTop: '0.35rem',
                  color: 'rgba(255, 255, 255, 0.65)',
                  fontSize: '0.85rem',
                  letterSpacing: '0.01em',
                }}
              >
                {submessage}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};