import { motion as m, type Variants } from "framer-motion";
import { useNavigate, type To } from 'react-router-dom';
import { useRef } from "react";

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

// --- Animation Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = (direction: "left" | "right"): Variants => ({
  hidden: {
    opacity: 0,
    y: 50,
    x: direction === "left" ? -50 : 50
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 14,
      mass: 1
    }
  },
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
        <m.h1
          className="text-gradient"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          OUR ROOTS & TIMELINE
        </m.h1>

        {/* Timeline Wrapper */}
        <m.div
          className="timeline-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* The Center Gradient Line */}
          <m.div
            className="timeline-line"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            viewport={{ once: true }}
          />

          {timelineData.map((item, index) => {
            const direction = index % 2 === 0 ? 'left' : 'right';

            return (
              <m.div
                key={index}
                className="timeline-item"
                variants={itemVariants(direction)}
              >
                <div className="timeline-dot"></div>

                <div className="timeline-content">
                  <span className="timeline-year">{item.year}</span>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>

                  <button
                    onClick={() => handleVisitClick(item.link)}
                    className="timeline-visit-button"
                  >
                    View Batch
                  </button>
                </div>
              </m.div>
            );
          })}
        </m.div>
      </div>
    </>
  );
};

export default Ourroots;