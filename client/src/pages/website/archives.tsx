import { motion as m } from "framer-motion";
import { Link } from 'react-router-dom';
import { FaLongArrowAltRight } from "react-icons/fa";

// Import the fadeIn utility
import { fadeIn } from '../../components/transitions';

// Event Images
import inaugural from '../../assets/Archives/Events/inaugural.jpg';
import azure from '../../assets/Archives/Events/azure.jpg';
import genai from '../../assets/Archives/Events/genAi.jpg';
import digitalArt from '../../assets/Archives/Events/digitalArt.png';
import spaceDay from '../../assets/Archives/Events/spaceDay.jpg';
import freshers from "../../assets/Archives/Events/Freshers.jpg";
import Insightx from "../../assets/Archives/Events/Insightx.jpg"
import hellojava from "../../assets/Archives/Events/hellojava.jpg"
import ThinkTankers from "../../assets/Archives/Events/ThinkTankers.jpeg"
import ideatolaunch from "../../assets/Archives/Events/ideatolaunch.jpg"
import linkedin from "../../assets/Archives/Events/linkedin.jpg"
import harmonix from "../../assets/Archives/Events/Harmonix.jpg"

// Marquee Images
import azure1 from "../../assets/Archives/Slider/azure1.jpg"
import chairman from "../../assets/Archives/Slider/chairman.jpg"
import vicechairman from "../../assets/Archives/Slider/vicechairman.jpg"
import eventimg1 from "../../assets/Archives/Slider/Eventimg1.jpg"
import eventimg2 from "../../assets/Archives/Slider/Eventimg2.jpg"
import sigaiteam from "../../assets/Archives/Slider/team(2024-2025).jpg"
import azure2 from "../../assets/Archives/Slider/azure2.jpg"

// Image Array for the Top Marquee
const sliderImages = [
  inaugural, azure1, chairman, vicechairman,
  eventimg1, eventimg2, sigaiteam, azure2
];

// Data Array for Timeline
const eventsData = [
  {
    id: 1,
    title: "Inaugural Ceremony",
    date: "8 APR 2024",
    desc: "Excited to announce the SIST ACM SIGAI Student Chapter launched on April 8, 2024. A new beginning for AI innovation on campus.",
    img: inaugural,
    link: "/archives/inaugural"
  },
  {
    id: 2,
    title: "Azure Cascade",
    date: "8 JUL 2024",
    desc: "The SIST ACM SIGAI Student Chapter's first major technical event on cloud computing, exploring the depths of Microsoft Azure.",
    img: azure,
    link: "/archives/azure"
  },
  {
    id: 3,
    title: "Deep Dive: Gen-AI",
    date: "1 AUG 2024",
    desc: "Our first collaborative event exploring the frontiers of Generative AI models and their applications in the real world.",
    img: genai,
    link: "/archives/genai"
  },
  {
    id: 4,
    title: "Digital Art Competition",
    date: "1 AUG 2024",
    desc: "Blending creativity and algorithms. A showcase of AI-generated art that challenges the boundaries of human imagination.",
    img: digitalArt,
    link: "/archives/digiart"
  },
  {
    id: 5,
    title: "Space Day",
    date: "22 AUG 2024",
    desc: "Coordinated Space Day event celebrating astronomical achievements and the intersection of AI with aerospace.",
    img: spaceDay,
    link: "/archives/spaceday"
  },
  {
    id: 6,
    title: "Synergy to Freshers",
    date: "4 SEP 2024",
    desc: "Welcoming the new batch with insights into AI, community building, and the future of technology at SIST.",
    img: freshers,
    link: "/archives/synergy"
  },
  {
    id: 7,
    title: "InsightX'24",
    date: "19 SEP 2024",
    desc: "InsightX'24 was a dynamic tech event that combined competitive challenges and an expert talk on Big Data, fostering innovation, collaboration, and learning among students.",
    img: Insightx,
    link: "/archives/insightx"
  },
  {
    id: 8,
    title: "Hello Java'25",
    date: "22 SEP 2025",
    desc: "A two-day, classroom-based Java workshop for second-year students that blended core and advanced concepts with fun activities and a placement-focused coding challenge to build skills and confidence.",
    img: hellojava,
    link: "/archives/hellojava"
  },
  {
    id: 9,
    title: "Think Tankers",
    date: "28 OCT 2025",
    desc: "A seminar-based quiz event that engaged students in key Environmental Science topics, encouraging critical thinking on real-world sustainability and environmental challenges.",
    img: ThinkTankers,
    link: "/archives/thinktankers"
  },
  {
    id: 10,
    title: "Idea to Launch",
    date: "28 OCT 2025",
    desc: "An insightful startup awareness session where students learned how to transform ideas into ventures, guided by real-world entrepreneurial insights from an industry co-founder.",
    img: ideatolaunch,
    link: "/archives/ideatolaunch"
  },
  {
    id: 11,
    title: "Get Linked with LinkedIn",
    date: "29 OCT 2025",
    desc: "A beginner-friendly session that guided first-year students in creating LinkedIn profiles and understanding its role in building a professional presence and early career growth.",
    img: linkedin,
    link: "/archives/linkedin"
  },
  {
    id: 12,
    title: "Harmonix",
    date: "30 OCT 2025",
    desc: "A seminar-based event that introduced students to AI-generated music using Suno, combining a live demo with hands-on track creation and recognition for the top entries.",
    img: harmonix,
    link: "/archives/harmonix"
  }
];

const Archives = () => {
  return (
    <div className="archives-page">
      <style>{`
        .archives-page {
          width: 100%;
          padding: 120px 0 60px;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          overflow-x: hidden;
        }

        /* --- HEADER STYLES --- */
        .page-header {
            text-align: center; margin-bottom: 60px; padding: 0 20px;
        }

        .text-gradient {
            background: linear-gradient(135deg, #fff 0%, var(--primary-blue) 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        /* --- MARQUEE / SLIDER SECTION --- */
        .marquee-container {
            width: 100%;
            height: 400px; /* INCREASED HEIGHT */
            margin-bottom: 120px;
            overflow: hidden;
            position: relative;
            display: flex;
            align-items: center;
            /* Added mask for fading edges */
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }

        .marquee-track {
            display: flex;
            gap: 30px; /* Increased gap slightly */
            width: max-content;
            animation: scroll 40s linear infinite; /* Slowed down slightly for size */
        }
        
        .marquee-container:hover .marquee-track {
            animation-play-state: paused;
        }

        .marquee-item {
            height: 400px; /* INCREASED HEIGHT */
            width: 600px;  /* INCREASED WIDTH */
            border-radius: 16px;
            overflow: hidden;
            flex-shrink: 0;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            transition: transform 0.3s ease;
        }
        
        /* Interactive pop on hover */
        .marquee-item:hover {
            transform: scale(0.98);
        }

        .marquee-item img {
            width: 100%; height: 100%; object-fit: cover;
            filter: grayscale(60%) brightness(0.8);
            transition: all 0.5s ease;
            transform: scale(1);
        }

        /* Zoom and color on hover */
        .marquee-item:hover img {
            filter: grayscale(0%) brightness(1);
            transform: scale(1.1); /* Zoom effect */
        }

        /* CALCULATION: 
           (Item Width + Gap) * Number of Unique Items
           (600px + 30px) * 5 = 3150px
        */
        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-630px * 5)); }
        }

        /* --- TIMELINE CONTAINER --- */
        .timeline-container {
            padding: 0 20px;
        }

        /* --- TIMELINE ITEM --- */
        .timeline-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6%;
          margin-bottom: 150px;
          position: relative;
        }

        .timeline-item.reverse {
          flex-direction: row-reverse;
        }

        /* IMAGE SIDE */
        .image-wrapper {
          width: 45%;
          position: relative;
        }

        .image-frame {
          width: 100%;
          height: 400px;
          overflow: hidden;
          position: relative;
          border-radius: 20px;
        }

        .image-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s ease;
          filter: grayscale(20%);
        }

        .image-frame:hover img {
          transform: scale(1.1);
          filter: grayscale(0%);
        }

        /* TEXT SIDE */
        .content-wrapper {
          width: 45%;
          position: relative;
          z-index: 2;
        }

        .big-date {
          font-size: 6rem;
          font-weight: 900;
          position: absolute;
          top: -65px;
          left: -10px;
          opacity: 0.05;
          line-height: 1;
          white-space: nowrap;
          pointer-events: none;
          font-family: sans-serif;
        }

        .item-title {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 15px;
          line-height: 1.2;
          color: #fff;
        }

        .item-desc {
          color: #cbd5e1;
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 25px;
          font-weight: 300;
        }

        .read-more {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--primary-blue, #3b82f6);
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          transition: gap 0.3s ease;
        }

        .read-more:hover {
          gap: 15px;
          color: #fff;
        }

        /* --- RESPONSIVE / MOBILE STYLES --- */
        @media (max-width: 900px) {
          /* Adjust marquee for mobile */
          .marquee-item { width: 350px; height: 280px; }
          .marquee-container { height: 280px; }
          
          /* Recalculate scroll for mobile width (350+30)*5 */
           @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-380px * 5)); }
           }
          
          .timeline-item, .timeline-item.reverse {
            flex-direction: column;
            gap: 30px;
            margin-bottom: 80px;
            align-items: flex-start;
          }
          .image-wrapper, .content-wrapper { width: 100%; }
          .image-frame { height: 280px; }
          .big-date { font-size: 4rem; top: -40px; left: 0; }
          .item-title { font-size: 1.8rem; }
        }
      `}</style>

      {/* --- HEADER --- */}
      <div className="page-header">
        <m.h1
          className="text-gradient"
          variants={fadeIn("down", 0.1)}
          initial="hidden"
          animate="show"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '900', letterSpacing: '-2px' }}
        >
          ARCHIVES
        </m.h1>
        <m.p
          variants={fadeIn("up", 0.3)}
          initial="hidden"
          animate="show"
          style={{ color: '#94a3b8', marginTop: '10px', fontSize: '1.1rem' }}
        >
          A visual timeline of our legacy and milestones.
        </m.p>
      </div>

      {/* --- MARQUEE SECTION --- */}
      <m.div
        className="marquee-container"
        variants={fadeIn("up", 0.5)}
        initial="hidden"
        animate="show"
      >
        <div className="marquee-track">
          {sliderImages.map((img, index) => (
            <div className="marquee-item" key={index}>
              <img src={img} alt="Archive Highlight" />
            </div>
          ))}
        </div>
      </m.div>

      {/* --- TIMELINE LOOP --- */}
      <div className="timeline-container">
        {eventsData.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={item.id}
              className={`timeline-item ${!isEven ? 'reverse' : ''}`}
            >
              {/* IMAGE BLOCK */}
              <m.div
                className="image-wrapper"
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="image-frame">
                  <img src={item.img} alt={item.title} loading="lazy" />
                </div>
              </m.div>

              {/* TEXT BLOCK */}
              <m.div
                className="content-wrapper"
                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <div className="big-date">{item.date}</div>
                <h2 className="item-title">{item.title}</h2>
                <p className="item-desc">{item.desc}</p>

                <Link to={item.link} className="read-more">
                  Explore Event <FaLongArrowAltRight />
                </Link>
              </m.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Archives;