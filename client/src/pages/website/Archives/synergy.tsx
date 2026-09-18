import { motion as m } from "framer-motion";
import { fadeIn } from '../../../components/transitions';

import fre1 from "../../../assets/Archives/Synergy/FRE1.avif"
import fre2 from "../../../assets/Archives/Synergy/FRE2.avif"
import fre3 from "../../../assets/Archives/Synergy/FRE3.avif"
import fre4 from "../../../assets/Archives/Synergy/FRE4.jpg"
import fre5 from "../../../assets/Archives/Synergy/FRE5.avif"
import fre6 from "../../../assets/Archives/Synergy/FRE6.avif"
import fre7 from "../../../assets/Archives/Synergy/FRE7.avif"
import fre8 from "../../../assets/Archives/Synergy/FRE8.avif"
import fre9 from "../../../assets/Archives/Synergy/FRE9.avif"
import fre10 from "../../../assets/Archives/Synergy/FRE10.jpg"
import fre11 from "../../../assets/Archives/Synergy/FRE11.avif"

import synergyBg from '../../../assets/Archives/Synergy/frebg.jpg';

const Synergy = () => {
  const images = [
    fre1, fre2, fre3, fre4, fre5, fre6, 
    fre7, fre8, fre9, fre10, fre11
  ];
  // Double the array for seamless scrolling
  const sliderImages = [...images, ...images];

  return (
    <div className="synergy-page">
      <style>{`
        .synergy-page {
          width: 100%;
          padding: 120px 0 60px;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          overflow-x: hidden;
          min-height: 100vh;

          /* --- BACKGROUND IMAGE SETUP --- */
          background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${synergyBg});
          background-size: cover;
          background-position: center;
          background-attachment: fixed; 
          background-repeat: no-repeat;
        }

        /* --- TYPOGRAPHY & HEADERS --- */
        .page-header, .section-header {
            text-align: center; margin-bottom: 40px; padding: 0 20px;
        }

        .text-gradient {
            background: linear-gradient(135deg, #fff 0%, var(--primary-blue, #0099ff) 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            font-weight: 900;
            letter-spacing: -2px;
            font-size: clamp(2.5rem, 6vw, 4.5rem);
            margin-bottom: 20px;
        }

        .section-title {
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 800;
            margin: 80px 0 40px;
            text-align: center;
        }

        .highlight-blue {
            color: #0099ff; /* Primary Blue */
        }

        p.content-text {
            color: #cbd5e1;
            font-size: 1.1rem;
            line-height: 1.8;
            max-width: 1000px;
            margin: 0 auto 30px;
            text-align: justify;
            font-weight: 300;
            padding: 0 20px;
        }

        strong {
            color: #fff;
            font-weight: 600;
        }

        /* --- MARQUEE STYLES --- */
        .marquee-container {
            width: 100%;
            height: 400px;
            margin: 60px 0 100px;
            overflow: hidden;
            position: relative;
            display: flex;
            align-items: center;
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }

        .marquee-track {
            display: flex;
            gap: 30px;
            width: max-content;
            animation: scroll 50s linear infinite; 
        }
        
        .marquee-container:hover .marquee-track {
            animation-play-state: paused;
        }

        .marquee-item {
            height: 400px;
            width: 600px;
            border-radius: 16px;
            overflow: hidden;
            flex-shrink: 0;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            transition: transform 0.3s ease;
        }
        
        .marquee-item:hover {
            transform: scale(0.98);
        }

        .marquee-item img {
            width: 100%; height: 100%; object-fit: cover;
            filter: grayscale(60%) brightness(0.8);
            transition: all 0.5s ease;
            transform: scale(1);
        }

        .marquee-item:hover img {
            filter: grayscale(0%) brightness(1);
            transform: scale(1.1);
        }

        @keyframes scroll {
            0% { transform: translateX(0); }
            /* Adjusted for roughly 12 unique images */
            100% { transform: translateX(calc(-630px * 12)); }
        }

        /* --- RESPONSIVE --- */
        @media (max-width: 900px) {
            .marquee-item { width: 350px; height: 280px; }
            .marquee-container { height: 280px; }
            
            @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(calc(-380px * 12)); }
            }
            
            .text-gradient { font-size: 2.5rem; }
        }
      `}</style>

      {/* --- TITLE SECTION --- */}
      <div className="page-header">
        <m.h1 
            className="text-gradient"
            variants={fadeIn("down", 0.1)}
            initial="hidden"
            animate="show"
        >
            SYNERGY <br /> TO FRESHERS
        </m.h1>
        
        <m.p 
            className="content-text" 
            style={{ textAlign: 'center' }}
            variants={fadeIn("up", 0.3)}
            initial="hidden"
            animate="show"
        >
            Welcoming the New Batch. September 4th, 2024.
        </m.p>
      </div>

      {/* --- INTRO TEXT --- */}
      <m.div
         variants={fadeIn("up", 0.2)}
         initial="hidden"
         animate="show"
      >
        <p className="content-text">
            We are happy to share that the SIST ACM SIGAI Student Chapter successfully conducted an exciting event for the new generation, "Synergy for Freshers," on 4th September 2024 (Wednesday) at the Dental Auditorium, Sathyabama Institute of Science and Technology, Chennai.
        </p>
      </m.div>

      {/* --- MARQUEE GALLERY --- */}
      <m.h2 
        className="section-title"
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        animate="show"
      >
        EVENT <span className="highlight-blue">GALLERY</span>
      </m.h2>
      
      <div className="marquee-container">
        <div className="marquee-track">
            {sliderImages.map((img, index) => (
                <div className="marquee-item" key={index}>
                    <img src={img} alt={`Synergy Highlight ${index}`} />
                </div>
            ))}
        </div>
      </div>

      {/* --- HIGHLIGHTS TEXT --- */}
      <m.h2 
        className="section-title"
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.1 }}
      >
        KEY <span className="highlight-blue">HIGHLIGHTS</span>
      </m.h2>

      <div>
        <m.p 
            className="content-text"
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false }}
        >
            The event began with our core unit members, <strong>Ms. Janllyn Avantikha and Ms. Vaishnavi Battina</strong>, introducing our Student Chapter to the audience, followed by a speech from our honorable Head of the Department, <strong>Dr. Vigneshwari.</strong>
        </m.p>
        
        <m.p 
            className="content-text"
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false }}
        >
            The first round of the event was a non-technical fun activity, "Trash to Treasure." All the students were divided into teams and provided with a bunch of trash and chart paper. They were tasked with creating something innovative from the materials they were given. The students showed immense enthusiasm and worked wonders with their creations. The results were evaluated by our faculty coordinators, <strong>Dr. R. Sathyabama Krishna and Dr. Anu Barathi</strong>. Two winners were selected from the teams.
        </m.p>
        
        <m.p 
            className="content-text"
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false }}
        >
             Following this was an orientation session where the members of our Student Chapter took the stage to explain the various future opportunities available to students after graduation. <strong>Ms. Sri Soundharya</strong>, Secretary of the Student Chapter, gave a detailed explanation of the current placement opportunities and how to aim for them. <strong>Ms. Sushree Sonali Patra</strong>, a core unit member, discussed entrepreneurship opportunities, highlighting its advantages and drawbacks with real-life examples. <strong>Ms. Vaishnavi Battina</strong>, another core unit member, familiarized the students with post-graduation degrees available to them, their eligibility criteria, and how to approach them. The students found this session extremely informative.
        </m.p>

        <m.p 
            className="content-text"
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false }}
        >
            <strong>Ms. Deekshitha</strong>, Treasurer of the Student Chapter, engaged with the students and spoke about the anxiety surrounding career decisions, offering advice on how to handle it and passionately pursue one's dreams.
        </m.p>

        <m.p 
            className="content-text"
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false }}
        >
            Overall, the event was a great success, and all the students thoroughly enjoyed it. We are thankful to all the dignitaries, faculty coordinators, student coordinators, and freshers who attended the event, contributing to its success. We look forward to organizing more such events in the future.
        </m.p>
      </div>

    </div>
  );
}

export default Synergy;