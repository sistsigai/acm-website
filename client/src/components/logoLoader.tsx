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

  const loadingTextStyle: CSSProperties = {
    marginTop: '20px',
    fontWeight: 'bold',
    fontSize: '1.2em',
    color: 'white',
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
      <motion.p
        style={loadingTextStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Add loading text here if needed */}
      </motion.p>
    </motion.div>
  );
};

export default LogoLoading;