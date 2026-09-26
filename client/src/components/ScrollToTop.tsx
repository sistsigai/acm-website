import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll to top immediately when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Calculate Scroll Progress for the Ring
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, scrolled)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // SVG Circle Configuration (Perfect concentric alignment)
  const size = 56;
  const strokeWidth = 3;
  const radius = 24; // diameter 48px, perfectly wraps around 42px button
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div 
      className={`scroll-container ${isVisible ? 'visible' : ''}`} 
      onClick={scrollToTop}
      role="button"
      tabIndex={0}
      aria-label="Back to top"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          scrollToTop();
        }
      }}
    >
      {/* SVG Progress Ring */}
      <svg 
        className="progress-ring" 
        width={size} 
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <linearGradient id="scroll-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>

        {/* Background track circle */}
        <circle
          className="progress-ring__background"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth={strokeWidth}
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        {/* Animated Blue Progress circle */}
        <circle
          className="progress-ring__circle"
          stroke="url(#scroll-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset: offset
          }}
        />
      </svg>

      {/* Center Button */}
      <div className="back-to-top-button">
        <FaArrowUp className="scroll-icon" />
      </div>
    </div>
  );
};

export default ScrollToTop;