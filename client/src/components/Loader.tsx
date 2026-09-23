import React, { useEffect, useState } from "react";

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