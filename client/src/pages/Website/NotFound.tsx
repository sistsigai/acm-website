import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaCompass } from "react-icons/fa";

const NotFound: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 20px",
        color: "#fff",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: "600px" }}
      >
        <h1
          style={{
            fontSize: "clamp(5rem, 12vw, 9rem)",
            fontWeight: 900,
            background: "linear-gradient(135deg, #00d2ff 0%, #0072ff 50%, #7928ca 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            lineHeight: 1,
          }}
        >
          404
        </h1>
        <h2
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
            fontWeight: 700,
            margin: "20px 0 12px",
            color: "#e2e8f0",
          }}
        >
          Page Not Found
        </h2>
        <p
          style={{
            fontSize: "1.05rem",
            color: "#94a3b8",
            lineHeight: 1.6,
            marginBottom: "32px",
          }}
        >
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable in the neural matrix.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "50px",
              background: "linear-gradient(135deg, #0072ff, #00c6ff)",
              color: "#fff",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 4px 15px rgba(0, 114, 255, 0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            <FaHome /> Back to Home
          </Link>
          <Link
            to="/events"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "50px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#e2e8f0",
              fontWeight: 600,
              textDecoration: "none",
              backdropFilter: "blur(10px)",
              transition: "background 0.2s",
            }}
          >
            <FaCompass /> Explore Events
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
