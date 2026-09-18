import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// --- Premium CSS Animations ---
const modernLoaderStyles = `
  /* 1. ORBIT VARIANT */
  .loader-orbit {
    width: 60px;
    height: 60px;
    position: relative;
  }
  .loader-orbit::before, .loader-orbit::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #0d6efd; /* Primary Color */
    border-bottom-color: #0d6efd;
  }
  .loader-orbit::before {
    top: 0; left: 0; right: 0; bottom: 0;
    animation: orbit-spin 1.5s linear infinite;
  }
  .loader-orbit::after {
    top: 10px; left: 10px; right: 10px; bottom: 10px;
    border-top-color: #0dcaf0; /* Info Color (Cyan) */
    border-bottom-color: #0dcaf0;
    animation: orbit-spin 1s linear infinite reverse;
  }
  @keyframes orbit-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* 2. WAVE VARIANT */
  .loader-wave {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    height: 40px;
  }
  .loader-wave div {
    background-color: #0d6efd;
    height: 100%;
    width: 6px;
    border-radius: 50px;
    animation: wave-stretch 1.2s infinite ease-in-out;
  }
  .loader-wave div:nth-child(1) { animation-delay: -1.1s; }
  .loader-wave div:nth-child(2) { animation-delay: -1.0s; }
  .loader-wave div:nth-child(3) { animation-delay: -0.9s; }
  .loader-wave div:nth-child(4) { animation-delay: -0.8s; }
  .loader-wave div:nth-child(5) { animation-delay: -0.7s; }
  
  @keyframes wave-stretch {
    0%, 40%, 100% { transform: scaleY(0.4); opacity: 0.6; }
    20% { transform: scaleY(1.0); opacity: 1; box-shadow: 0 0 15px rgba(13, 110, 253, 0.4); }
  }

  /* 3. BREATHING VARIANT */
  .loader-breath {
    width: 60px;
    height: 60px;
    background-color: #0d6efd;
    border-radius: 50%;
    position: relative;
    animation: breath-pulse 2s infinite ease-in-out;
  }
  .loader-breath::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid #0d6efd;
    top: 0; left: 0;
    animation: breath-ping 2s infinite cubic-bezier(0, 0, 0.2, 1);
  }
  @keyframes breath-pulse {
    0% { transform: scale(0.8); opacity: 0.8; }
    50% { transform: scale(1); opacity: 1; box-shadow: 0 0 30px rgba(13, 110, 253, 0.6); }
    100% { transform: scale(0.8); opacity: 0.8; }
  }
  @keyframes breath-ping {
    0% { transform: scale(1); opacity: 1; }
    75%, 100% { transform: scale(2); opacity: 0; }
  }

  /* FADE TRANSITIONS */
  .loader-container {
    transition: opacity 0.4s ease, backdrop-filter 0.4s ease;
  }
  .loader-hidden {
    opacity: 0;
    pointer-events: none;
  }
  .loader-visible {
    opacity: 1;
    pointer-events: all;
  }
`;

interface LoaderProps {
  loading: boolean;
  text?: string;
  variant?: "orbit" | "wave" | "breath";
  fullscreen?: boolean;
  theme?: "light" | "dark";
}

const Loader: React.FC<LoaderProps> = ({
  loading,
  variant = "orbit",
  fullscreen = true,
  theme = "light",
}) => {
  const [shouldRender, setShouldRender] = useState(loading);
  const [opacityClass, setOpacityClass] = useState("loader-hidden");

  useEffect(() => {
    if (loading) {
      setShouldRender(true);
      requestAnimationFrame(() => setOpacityClass("loader-visible"));
    } else {
      setOpacityClass("loader-hidden");
      setShouldRender(false);
    }
  }, [loading]);

  if (!shouldRender) return null;

  const renderVisuals = () => {
    switch (variant) {
      case "wave":
        return (
          <div className="loader-wave">
            <div></div><div></div><div></div><div></div><div></div>
          </div>
        );
      case "breath":
        return <div className="loader-breath"></div>;
      case "orbit":
      default:
        return <div className="loader-orbit"></div>;
    }
  };

  // Theme configuration
  const bg = theme === "dark"
    ? "rgba(0, 0, 0, 0.85)"
    : "rgba(255, 255, 255, 0.8)";


  return (
    <>
      <style>{modernLoaderStyles}</style>
      <div
        className={`loader-container d-flex flex-column justify-content-center align-items-center ${opacityClass}`}
        style={{
          position: fullscreen ? "fixed" : "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 9999,
          backgroundColor: bg,
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Visual Component */}
        <div className="mb-4">
          {renderVisuals()}
        </div>
      </div>
    </>
  );
};

export default Loader;