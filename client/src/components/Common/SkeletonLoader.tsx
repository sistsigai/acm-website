import React from "react";

export const SkeletonCard: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="skeleton-card">
          <div className="skeleton-shimmer" style={{ height: "140px", width: "100%" }} />
          <div className="skeleton-shimmer skeleton-line title" />
          <div className="skeleton-shimmer skeleton-line" />
          <div className="skeleton-shimmer skeleton-line short" />
        </div>
      ))}
    </>
  );
};

export const SkeletonHeader: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", margin: "40px 0" }}>
      <div className="skeleton-shimmer skeleton-line" style={{ height: "40px", width: "300px" }} />
      <div className="skeleton-shimmer skeleton-line" style={{ height: "18px", width: "450px", maxWidth: "90%" }} />
    </div>
  );
};

export default SkeletonCard;
