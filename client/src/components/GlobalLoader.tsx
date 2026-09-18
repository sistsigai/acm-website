import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoaderProps {
  isLoading: boolean;
}

export const GlobalLoader: React.FC<LoaderProps> = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            // Simplified: Dark transparent overlay instead of solid color
            background: 'rgba(0, 4, 40, 0.7)', 
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Single Glowing Ring Animation */}
          <motion.div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: '3px solid rgba(255, 255, 255, 0.1)', // Faint track
              borderTop: '3px solid #5CA0F2', // Glowing Blue Header
              boxShadow: '0 0 15px rgba(92, 160, 242, 0.5)' // Soft Glow
            }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};