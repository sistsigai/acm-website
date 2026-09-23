import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // 1. Calculate Visibility
      const currentScrollY = window.scrollY;
      if (currentScrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // 2. Calculate Scroll Progress for the Ring
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // SVG Circle Configuration
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      <div 
        className={`scroll-container ${isVisible ? 'visible' : ''}`} 
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        {/* SVG Progress Ring */}
        <svg className="progress-ring" width="60" height="60">
          {/* Background grey circle */}
          <circle
            className="progress-ring__background"
            stroke="#e6e6e6"
            strokeWidth="3"
            fill="transparent"
            r={radius}
            cx="30"
            cy="30"
          />
          {/* Animated Blue Progress circle */}
          <circle
            className="progress-ring__circle"
            stroke="url(#gradient)" // Uses gradient definition below
            strokeWidth="3"
            fill="transparent"
            r={radius}
            cx="30"
            cy="30"
            style={{
              strokeDasharray: `${circumference} ${circumference}`,
              strokeDashoffset: offset
            }}
          />
          {/* Gradient Definition for the ring */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F5F7F6" />
              <stop offset="100%" stopColor="#5CA0F2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Button */}
        <button className="back-to-top-button">
          <FaArrowUp className="scroll-icon" />
        </button>
      </div>
    </>
  );
};

export default ScrollToTop;