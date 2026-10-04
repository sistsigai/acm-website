import React, { useRef } from "react";
import { motion as m } from "framer-motion";
import { useNavigate, type To } from 'react-router-dom';
import { fadeIn } from '../../utils/animations';
import SEO from "../../components/Common/SEO";

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  link?: string;
}

const STATIC_TIMELINE: TimelineItem[] = [
  {
    id: "1",
    year: "2024-2025",
    title: "The Founding Batch",
    description: "The pioneers of SIST ACM SIGAI Student Chapter. This batch established the chapter's foundation, launching our first initiatives and setting a high bar for innovation.",
    link: "/about?batch=2024-2025",
  },
  {
    id: "2",
    year: "2025-2026",
    title: "The Growth Batch",
    description: "Building on the legacy, this batch expanded our reach, hosted the first regional AI symposium, and doubled our community membership.",
    link: "/about?batch=2025-2026",
  },
];

// --- REUSABLE CARD (Memoized with continuous animation) ---
const RootsCard = React.memo(({ item, index, onVisit }: { item: TimelineItem; index: number; onVisit: (link: To) => void }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const direction = isMobile ? "up" : (index % 2 === 0 ? "left" : "right");

  return (
    <m.div
      className="timeline-item"
      variants={fadeIn(direction, 0.2 + index * 0.18)}
      initial="hidden"
      animate="show"
    >
      <div className="timeline-dot"></div>

      <div className="timeline-content">
        <span className="timeline-year">{item.year}</span>
        <h2>{item.title}</h2>
        <p>{item.description}</p>

        {item.link && (
          <button
            onClick={() => onVisit(item.link as To)}
            className="timeline-visit-button"
          >
            View Batch
          </button>
        )}
      </div>
    </m.div>
  );
});

const Ourroots: React.FC = () => {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const handleVisitClick = (link: To) => {
    navigate(link);
  };

  return (
    <>
      <SEO
        title="Our Roots & Chapter Legacy | SIST ACM SIGAI"
        description="Explore the journey, milestones, and leadership batches of SIST ACM SIGAI Student Chapter since inception."
        url="https://sistsigai.acm.org/our-roots"
      />

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
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ color: '#94a3b8', fontSize: '1.1rem', marginTop: '10px' }}
          >
            The visionaries, executive committees, and milestones that shaped our journey.
          </m.p>
        </div>

        {/* Timeline Wrapper */}
        <div className="timeline-container">
          {/* The Center Gradient Line */}
          <m.div
            className="timeline-line"
            style={{ transformOrigin: "top" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />

          {STATIC_TIMELINE.map((item, index) => (
            <RootsCard
              key={item.id || index}
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