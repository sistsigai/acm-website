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