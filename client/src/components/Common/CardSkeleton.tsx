import React from "react";

export const EventCardSkeleton: React.FC = () => {
  return (
    <div className="event-card-skeleton">
      {/* Top Controls Shimmer */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="card-skeleton-shimmer" style={{ width: "90px", height: "24px", borderRadius: "12px" }} />
        <div className="card-skeleton-shimmer" style={{ width: "80px", height: "24px", borderRadius: "12px" }} />
      </div>

      {/* Middle Content Shimmer */}
      <div className="d-flex flex-column gap-2 mb-3">
        <div className="card-skeleton-shimmer" style={{ width: "75%", height: "22px", borderRadius: "6px" }} />
        <div className="card-skeleton-shimmer" style={{ width: "45%", height: "14px", borderRadius: "4px" }} />
      </div>

      {/* Meta Row Shimmer */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="card-skeleton-shimmer" style={{ width: "85px", height: "14px", borderRadius: "4px" }} />
        <div className="card-skeleton-shimmer" style={{ width: "70px", height: "14px", borderRadius: "4px" }} />
        <div className="card-skeleton-shimmer" style={{ width: "90px", height: "14px", borderRadius: "4px" }} />
      </div>

      {/* Action Button Shimmer */}
      <div className="d-flex align-items-center gap-2 mt-auto">
        <div className="card-skeleton-shimmer flex-grow-1" style={{ height: "42px", borderRadius: "10px" }} />
        <div className="card-skeleton-shimmer" style={{ width: "42px", height: "42px", borderRadius: "10px" }} />
      </div>
    </div>
  );
};

export const MemberCardSkeleton: React.FC<{ isLarge?: boolean }> = ({ isLarge = false }) => {
  return (
    <div className={`member-card-skeleton ${isLarge ? "large" : ""}`}>
      <div className="d-flex flex-column align-items-center gap-2 w-100 mb-2">
        <div className="card-skeleton-shimmer" style={{ width: "70%", height: "20px", borderRadius: "6px" }} />
        <div className="card-skeleton-shimmer" style={{ width: "45%", height: "13px", borderRadius: "4px" }} />
        <div className="d-flex gap-2 mt-2">
          <div className="card-skeleton-shimmer" style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
          <div className="card-skeleton-shimmer" style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
          <div className="card-skeleton-shimmer" style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
        </div>
      </div>
    </div>
  );
};

export const BlogCardSkeleton: React.FC = () => {
  return (
    <div className="blog-card-skeleton">
      {/* Post Date Shimmer */}
      <div className="card-skeleton-shimmer mb-3" style={{ width: "90px", height: "14px", borderRadius: "4px" }} />

      {/* Post Title Shimmer */}
      <div className="card-skeleton-shimmer mb-2" style={{ width: "85%", height: "24px", borderRadius: "6px" }} />
      <div className="card-skeleton-shimmer mb-3" style={{ width: "55%", height: "24px", borderRadius: "6px" }} />

      {/* Post Excerpt Shimmer */}
      <div className="d-flex flex-column gap-2 mb-4 flex-grow-1">
        <div className="card-skeleton-shimmer" style={{ width: "100%", height: "14px", borderRadius: "4px" }} />
        <div className="card-skeleton-shimmer" style={{ width: "92%", height: "14px", borderRadius: "4px" }} />
        <div className="card-skeleton-shimmer" style={{ width: "70%", height: "14px", borderRadius: "4px" }} />
      </div>

      {/* Blog Image Placeholder */}
      <div className="card-skeleton-shimmer mb-3" style={{ width: "100%", height: "200px", borderRadius: "14px" }} />

      {/* Read More Link */}
      <div className="card-skeleton-shimmer mt-auto pt-3" style={{ width: "120px", height: "16px", borderRadius: "4px" }} />
    </div>
  );
};
