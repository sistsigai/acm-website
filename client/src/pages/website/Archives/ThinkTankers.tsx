import { motion as m } from "framer-motion";
import { fadeIn } from '../../../components/transitions';

import tt1 from "../../../assets/Archives/ThinkTankers/tt1.jpeg"
import tt2 from "../../../assets/Archives/ThinkTankers/tt2.jpeg"
import tt3 from "../../../assets/Archives/ThinkTankers/tt3.jpeg"
import tt4 from "../../../assets/Archives/ThinkTankers/tt4.jpeg"
import tt5 from "../../../assets/Archives/ThinkTankers/tt5.jpeg"
import tt6 from "../../../assets/Archives/ThinkTankers/tt6.jpeg"
import tt7 from "../../../assets/Archives/ThinkTankers/tt7.jpeg"
import tt8 from "../../../assets/Archives/ThinkTankers/tt8.jpeg"
import tt9 from "../../../assets/Archives/ThinkTankers/tt9.jpeg"
import tt10 from "../../../assets/Archives/ThinkTankers/tt10.jpeg"
import tt11 from "../../../assets/Archives/ThinkTankers/tt11.jpeg"

import ttbg from '../../../assets/Archives/ThinkTankers/ttbg.jpg';

const ThinkTankers = () => {
    const images = [
        tt1, tt2, tt3, tt4, tt5, tt6,
        tt7, tt8, tt9, tt10, tt11
    ];
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
          background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${ttbg});
          background-size: cover;
          background-position: center;
          background-attachment: scroll; 
          background-repeat: no-repeat;
        }

        /* --- TYPOGRAPHY & HEADERS --- */
        .page-header, .section-header {
            text-align: center; margin-bottom: 40px; padding: 0 20px;
        }

        .text-gradient {
            background: linear-gradient(135deg, #fff 0%, var(--primary-blue, var(--primary-blue)) 100%);
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
            color: var(--primary-blue); /* Primary Blue */
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
                    Think Tankers
                </m.h1>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                animate="show"
            >
                <p className="content-text">
                    Think Tankers was an interactive seminar-based quiz event designed to help students explore important concepts related to Environmental Science. The event introduced participants to various themes including biodiversity, sustainable development, agricultural productivity, and global food security through informative discussions and engaging quiz rounds. Students were encouraged to think critically about real-world environmental challenges and analyze meaningful solutions through active participation. The event provided an excellent platform for participants to enhance their environmental awareness, improve analytical thinking, and engage in collaborative learning in an interactive and informative atmosphere.
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
                viewport={{ once: true, amount: 0.3 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    The event began with an informative seminar session that introduced students to important Environmental Science concepts and their relevance in addressing present-day global challenges. Participants actively engaged in discussions on topics such as biodiversity, sustainable development, agricultural productivity, and global food security. The session encouraged students to think beyond theoretical knowledge and understand the practical impact of environmental issues on society and future generations. The interactive nature of the seminar created an engaging learning atmosphere and motivated students to participate enthusiastically throughout the event.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Following the seminar session, multiple quiz rounds were conducted to test the participants' understanding, critical thinking, and analytical abilities. The quiz questions were designed around real-world environmental challenges and encouraged students to apply their knowledge in identifying practical and meaningful solutions. Participants displayed great enthusiasm and competitiveness while answering questions related to environmental conservation, sustainability practices, food security, and ecological balance. The rounds not only tested their awareness but also enhanced their ability to think logically under pressure.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    One of the major highlights of the event was the active involvement of students during the discussion and quiz sessions. Participants confidently shared their perspectives on environmental concerns and demonstrated a strong interest in learning about sustainable practices and global environmental developments. The event successfully created an interactive platform where students could exchange ideas, improve their awareness, and strengthen their understanding of Environmental Science concepts in an enjoyable manner.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Overall, Think Tankers was a successful and enriching seminar-based event that combined learning with interaction and critical thinking. The event helped students develop a deeper understanding of environmental issues while encouraging teamwork, participation, and knowledge sharing. The enthusiastic response from participants reflected the success of the event in creating awareness and promoting meaningful discussions on environmental sustainability and responsibility today.
                </m.p>
            </div>

        </div>
    );
}

export default ThinkTankers;