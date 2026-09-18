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
      <style>{`
        .scroll-container {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 999;
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px);
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
          cursor: pointer;
        }

        .scroll-container.visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        /* The Button Circle */
        .back-to-top-button {
          width: 50px;
          height: 50px;
          background-color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          position: relative;
          z-index: 2;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        /* Hover Effects */
        .scroll-container:hover .back-to-top-button {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(92, 160, 242, 0.4);
        }

        /* Arrow Styling & Animation */
        .scroll-icon {
          color: #5CA0F2; /* Matches your Navbar gradient end color */
          font-size: 20px;
          transition: color 0.3s ease;
          animation: bounce 2s infinite;
        }
        
        .scroll-container:hover .scroll-icon {
          color: #000000;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-3px); }
          60% { transform: translateY(-1.5px); }
        }

        /* SVG Progress Ring Styles */
        .progress-ring {
          position: absolute;
          top: -5px;
          left: -5px;
          width: 60px;
          height: 60px;
          transform: rotate(-90deg); /* Start from top */
          pointer-events: none;
          z-index: 1;
        }

        .progress-ring__circle {
          transition: stroke-dashoffset 0.1s linear;
          stroke: #5CA0F2;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .scroll-container {
            bottom: 20px;
            right: 20px;
          }
        }
      `}</style>

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