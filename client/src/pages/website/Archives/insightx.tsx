import { motion as m } from "framer-motion";
import { fadeIn } from '../../../components/transitions';

import insi1 from "../../../assets/Archives/Insightx/insi1.jpg"
import insi2 from "../../../assets/Archives/Insightx/insi2.jpg"
import insi3 from "../../../assets/Archives/Insightx/insi3.jpg"
import insi4 from "../../../assets/Archives/Insightx/insi4.jpg"
import insi5 from "../../../assets/Archives/Insightx/insi5.jpg"
import insi6 from "../../../assets/Archives/Insightx/insi6.jpg"
import insi7 from "../../../assets/Archives/Insightx/insi7.jpg"
import insi8 from "../../../assets/Archives/Insightx/insi8.jpg"
import insi9 from "../../../assets/Archives/Insightx/insi9.jpg"
import insi10 from "../../../assets/Archives/Insightx/insi10.jpg"

import insightxBg from '../../../assets/Archives/Insightx/insightxbg.jpg';

const Insightx = () => {
    const images = [
        insi1, insi2, insi3, insi4, insi5, insi6,
        insi7, insi8, insi9, insi10
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
          background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${insightxBg});
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
                    INSIGHTX’24
                </m.h1>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                animate="show"
            >
                <p className="content-text">
                    InsightX’24 was a dynamic event designed to showcase innovation and creativity within the tech community. It featured a blend of technical and non-technical competitions alongside an insightful guest talk on the Big Data revolution. The event provided an excellent platform for students to compete and learn, promoting collaborative knowledge sharing. Cash prizes were awarded to the winners, and e-certificates were given to recognize every participant.
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
                    The event featured several engaging technical and non-technical activities that encouraged students to showcase their creativity, teamwork, and problem-solving skills. One of the major attractions was <strong>"Data Pix,"</strong> where participants combined data science with storytelling by analyzing datasets using Python and presenting their ideas creatively through Canva and PowerPoint presentations. Students actively participated and explored innovative approaches to solving real-world problems.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Following this was <strong>"Debug Dominion,"</strong> a coding-based competition that tested logical thinking and collaboration among teams. Participants worked together in assigned roles such as Problem Solver, Code Checker, and Planner to identify bugs and review code efficiently. The event created a competitive atmosphere that strengthened both technical knowledge and team coordination skills among students.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    The symposium also included an insightful guest talk on <strong>"Trends Shaping the Future"</strong> delivered by <strong>Mr. Arun C.</strong> The session focused on the Big Data Revolution and highlighted the growing importance of data-driven technologies across industries. Students gained valuable insights into emerging trends, practical applications of big data, and the role of analytics in modern decision-making.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Several non-technical competitions added excitement and energy to the event. <strong>"Enchanting Quest"</strong> engaged students in an adventurous treasure hunt where teams solved clues and challenges to reach the final destination. <strong>"Guess It"</strong> entertained participants through interactive visual puzzles that tested their creativity and reasoning abilities. <strong>"Stack 'N' Conquer"</strong> further promoted communication and teamwork through unique cup-stacking challenges conducted under time pressure.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    The <strong>Free Fire</strong> and <strong>BGMI</strong> tournaments also attracted enthusiastic participation from gaming enthusiasts. Teams competed strategically through multiple rounds, showcasing coordination, precision, and gaming skills in intense battle royale matches.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Overall, the event successfully created an engaging platform for students to learn, compete, interact, and collaborate, making InsightX'24 a memorable experience for everyone involved.
                </m.p>
            </div>

        </div>
    );
}

export default Insightx;