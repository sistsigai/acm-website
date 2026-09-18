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

// --- CSS Styles ---
const styles = `
  :root {
    --primary-blue: #3b82f6; /* Matching your scrollbar thumb */
    --primary-glow: rgba(59, 130, 246, 0.5);
    --glass-bg: rgba(255, 255, 255, 0.03);
    --glass-border: rgba(255, 255, 255, 0.08);
  }

  /* Base Container - Transparent to let global bg show */
  .timeline-page {
    width: 100%;
    padding: 120px 5% 100px;
    font-family: 'Poppins', sans-serif; /* Distinct font for headers */
    overflow-x: hidden;
    background: transparent; 
    position: relative;
  }

  /* --- Typography --- */
  .timeline-main-title {
    text-align: center;
    font-size: 3.5rem;
    margin-bottom: 80px;
    font-weight: 800;
    line-height: 1.1;
    color: #fff;
    text-shadow: 0 0 20px rgba(0,0,0,0.5);
  }
  
  .highlight-text {
    background: linear-gradient(120deg, #fff, var(--primary-blue));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
    filter: drop-shadow(0 0 10px var(--primary-glow));
  }

  /* --- Timeline Structure --- */
  .timeline-container {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 0;
  }

  /* The Vertical Line */
  .timeline-line {
    position: absolute;
    width: 4px;
    /* Gradient adapted to fade out at ends */
    background: linear-gradient(180deg, 
      rgba(59, 130, 246, 0) 0%, 
      rgba(59, 130, 246, 0.6) 15%, 
      rgba(59, 130, 246, 0.6) 85%, 
      rgba(59, 130, 246, 0) 100%
    );
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 2px;
    z-index: 0;
    box-shadow: 0 0 15px var(--primary-glow);
  }

  .timeline-item {
    padding: 20px 60px;
    position: relative;
    width: 50%;
    box-sizing: border-box;
    z-index: 2;
    margin-bottom: 30px;
  }

  /* --- The Central Node (Dot) --- */
  .timeline-dot {
    position: absolute;
    top: 45px;
    width: 22px;
    height: 22px;
    background: #0f0524; /* Matches your global dark bg */
    border: 3px solid var(--primary-blue);
    border-radius: 50%;
    z-index: 3;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2), 0 0 15px var(--primary-glow);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .timeline-item:hover .timeline-dot {
    background: var(--primary-blue);
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.2), 0 0 30px var(--primary-blue);
    transform: scale(1.1);
  }

  /* Positioning Left/Right */
  .timeline-item:nth-child(odd) { left: 0; text-align: right; }
  .timeline-item:nth-child(even) { left: 50%; text-align: left; }

  .timeline-item:nth-child(odd) .timeline-dot { right: -11px; }
  .timeline-item:nth-child(even) .timeline-dot { left: -11px; }

  /* --- Glass Card --- */
  .timeline-content {
    padding: 40px;
    /* High transparency to show your moving gradient behind */
    background: rgba(255, 255, 255, 0.03); 
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
  }

  /* Hover Effect */
  .timeline-content:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(59, 130, 246, 0.05);
  }

  /* Connector Line */
  .timeline-content::before {
    content: '';
    position: absolute;
    top: 55px;
    width: 20px;
    height: 1px;
    background: var(--primary-blue);
    opacity: 0.6;
  }
  .timeline-item:nth-child(odd) .timeline-content::before { right: -20px; }
  .timeline-item:nth-child(even) .timeline-content::before { left: -20px; }

  /* --- Text Content --- */
  .timeline-year {
    display: inline-block;
    padding: 6px 14px;
    background: rgba(59, 130, 246, 0.15);
    color: #60a5fa;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.85rem;
    margin-bottom: 15px;
    border: 1px solid rgba(59, 130, 246, 0.2);
  }

  .timeline-content h2 {
    font-size: 2rem;
    color: #fff;
    margin: 0 0 15px 0;
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  .timeline-content p {
    font-size: 1rem;
    line-height: 1.7;
    color: #cbd5e1; /* Light gray for readability on dark bg */
    margin-bottom: 25px;
  }

  /* --- Button --- */
  .timeline-visit-button {
    padding: 12px 28px;
    background: transparent;
    border: 1px solid rgba(59, 130, 246, 0.5);
    color: #60a5fa;
    border-radius: 50px;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    z-index: 1;
  }

  .timeline-visit-button::before {
    content: '';
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    background: var(--primary-blue);
    z-index: -1;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  .timeline-visit-button:hover::before {
    transform: scaleX(1);
    transform-origin: left;
  }

  .timeline-visit-button:hover {
    color: #fff;
    border-color: var(--primary-blue);
    box-shadow: 0 0 25px rgba(59, 130, 246, 0.4);
  }

  /* ---------------- Responsive ---------------- */
  @media screen and (max-width: 900px) {
    .timeline-main-title { font-size: 2.5rem; }
  }

  @media screen and (max-width: 768px) {
    .timeline-page { padding: 80px 20px; }
    
    .timeline-line { left: 30px; transform: none; }
    
    .timeline-item {
      width: 100%;
      padding-left: 70px;
      padding-right: 0;
      text-align: left;
      margin-bottom: 40px;
    }

    .timeline-item:nth-child(even) { left: 0; }
    
    .timeline-item:nth-child(odd) .timeline-dot,
    .timeline-item:nth-child(even) .timeline-dot {
      left: 19px; 
      right: auto;
    }

    .timeline-item:nth-child(odd) .timeline-content::before,
    .timeline-item:nth-child(even) .timeline-content::before {
      left: -20px;
      right: auto;
      width: 20px;
    }
    
    .timeline-content { padding: 25px; }
    .timeline-content h2 { font-size: 1.6rem; }
  }
`;

const Ourroots = () => {
    const navigate = useNavigate();
    const ref = useRef(null);

    const handleVisitClick = (link: To) => {
        navigate(link);
    };

    return (
        <>
            <style>{styles}</style>

            <div className='timeline-page' ref={ref}>
                {/* Title Section */}
                <m.h1
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className='timeline-main-title'
                >
                    Our Journey & <span className="highlight-text">Batches</span>
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