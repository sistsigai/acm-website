import React from "react";

export type EventFilterType = "all" | "upcoming" | "past";

interface EventFilterPillsProps {
  filter: EventFilterType;
  counts: {
    all: number;
    upcoming: number;
    past: number;
  };
  onFilterChange: (filter: EventFilterType) => void;
}

export const EventFilterPills: React.FC<EventFilterPillsProps> = ({
  filter,
  counts,
  onFilterChange,
}) => {
  const tabs: { id: EventFilterType; label: string; count: number }[] = [
    { id: "all", label: "All Events", count: counts.all },
    { id: "upcoming", label: "Upcoming", count: counts.upcoming },
    { id: "past", label: "Past Events", count: counts.past },
  ];

  return (
    <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
      {tabs.map((tab) => {
        const isActive = filter === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`btn rounded-pill px-4 py-2 fw-medium d-inline-flex align-items-center gap-2 transition-all ${
              isActive
                ? "btn-primary shadow-lg"
                : "btn-outline-secondary text-light border-opacity-25"
            }`}
            style={{
              background: isActive
                ? "linear-gradient(135deg, #3b82f6, #06b6d4)"
                : "rgba(255,255,255,0.04)",
              borderColor: isActive ? "transparent" : "rgba(255,255,255,0.1)",
              fontSize: "0.9rem",
            }}
            onClick={() => onFilterChange(tab.id)}
          >
            <span>{tab.label}</span>
            <span
              className={`badge rounded-pill ${
                isActive ? "bg-white text-primary" : "bg-dark text-secondary"
              }`}
              style={{ fontSize: "0.75rem" }}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default EventFilterPills;
