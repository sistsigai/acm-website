import React, { useRef } from "react";
import { motion as m } from "framer-motion";
import { useNavigate, type To } from 'react-router-dom';
import { fadeIn } from '../../components/transitions';

// --- Timeline Data ---
const timelineData = [
  {
    year: "2024-2025",
    title: "The Founding Batch",
    description: "The pioneers of SIST ACM SIGAI Student Chapter. This batch established the chapter's foundation, launching our first initiatives and setting a high bar for innovation.",
    link: "/about?batch=2024-2025"
  },
  {
    year: "2025-2026",
    title: "The Growth Batch",
    description: "Building on the legacy, this batch expanded our reach, hosted the first regional AI symposium, and doubled our community membership.",
    link: "/about?batch=2025-2026"
  },
];

// --- REUSABLE CARD (Memoized with continuous scroll animation) ---
const RootsCard = React.memo(({ item, index, onVisit }: { item: typeof timelineData[0]; index: number; onVisit: (link: To) => void }) => {
  const direction = index % 2 === 0 ? "left" : "right";

  return (
    <m.div
      className="timeline-item"
      variants={fadeIn(direction === "left" ? "left" : "right", 0.15)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.2 }}
    >
      <div className="timeline-dot"></div>

      <div className="timeline-content">
        <span className="timeline-year">{item.year}</span>
        <h2>{item.title}</h2>
        <p>{item.description}</p>

        <button
          onClick={() => onVisit(item.link)}
          className="timeline-visit-button"
        >
          View Batch
        </button>
      </div>
    </m.div>
  );
});

const Ourroots = () => {
  const navigate = useNavigate();
  const ref = useRef(null);

  const handleVisitClick = (link: To) => {
    navigate(link);
  };

  return (
    <>
      <div className='timeline-page' ref={ref}>
        {/* Title Section */}
        <div className="page-header">
          <m.h1
            className="text-gradient"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            OUR ROOTS
          </m.h1>
        </div>

        {/* Timeline Wrapper */}
        <div className="timeline-container">
          {/* The Center Gradient Line */}
          <m.div
            className="timeline-line"
            style={{ transformOrigin: "top" }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />

          {timelineData.map((item, index) => (
            <RootsCard
              key={index}
              item={item}
              index={index}
              onVisit={handleVisitClick}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Ourroots;