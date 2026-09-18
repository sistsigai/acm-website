import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

interface MessageProps {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const FloatingOrb: React.FC<MessageProps> = ({
  isVisible,
  message,
  type,
  onClose
}) => {
  // Determine colors based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: '#5CA0F2',
          glow: 'rgba(92, 160, 242, 0.5)'
        };
      case 'error':
        return {
          bgColor: '#ff4757',
          glow: 'rgba(255, 71, 87, 0.5)'
        };
      case 'info':
        return {
          bgColor: '#3b82f6',
          glow: 'rgba(59, 130, 246, 0.5)'
        };
      default:
        return {
          bgColor: '#5CA0F2',
          glow: 'rgba(92, 160, 242, 0.5)'
        };
    }
  };

  const { bgColor, glow } = getTypeStyles();

  // ⏱ Auto close after 5 seconds
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            bottom: '40px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 10000,
            pointerEvents: 'none'
          }}
        >
          <motion.div
            initial={{ y: 100, scale: 0.5, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 100, scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              pointerEvents: 'auto',
              background: 'rgba(20, 20, 20, 0.6)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50px',
              padding: '10px 25px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              boxShadow: `0 20px 40px -10px #000, 0 0 20px ${glow}`,
              cursor: 'pointer'
            }}
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              style={{
                background: bgColor,
                borderRadius: '50%',
                width: '10px',
                height: '10px',
                boxShadow: `0 0 10px ${bgColor}`
              }}
            />

            <span
              style={{
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: 500
              }}
            >
              {message}
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};