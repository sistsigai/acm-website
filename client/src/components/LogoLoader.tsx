import { motion, type MotionStyle } from 'framer-motion';
import loadingImage from '../assets/acm-loader-logo.png';
import type { CSSProperties } from 'react';

const LogoLoading = () => {
  const loadingContainerStyle: MotionStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  const loadingImageStyle: CSSProperties = {
    width: '200px',
    height: '200px',
  };

  return (
    <motion.div 
      style={loadingContainerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.img
        src={loadingImage}
        alt="Loading"
        style={loadingImageStyle}
        animate={{ rotateY: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
};

export default LogoLoading;