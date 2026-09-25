import { motion as m } from "framer-motion";
import { fadeIn } from '../../../components/transitions';

import tuno1 from '../../../assets/Archives/TechUNO/tuno1.jpeg';
import tuno2 from '../../../assets/Archives/TechUNO/tuno2.jpeg';
import tuno3 from '../../../assets/Archives/TechUNO/tuno3.jpeg';
import tuno4 from '../../../assets/Archives/TechUNO/tuno4.jpeg';
import tuno5 from '../../../assets/Archives/TechUNO/tuno5.jpeg';
import tuno6 from '../../../assets/Archives/TechUNO/tuno6.jpeg';
import tunobg from '../../../assets/Archives/TechUNO/tunobg.jpg';

const TechUNO = () => {
    const images = [tuno1, tuno2, tuno3, tuno4, tuno5, tuno6];
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
          background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${tunobg});
          background-size: cover;
          background-position: center;
          background-attachment: scroll;
          background-repeat: no-repeat;
        }

        .page-header, .section-header {
            text-align: center; margin-bottom: 40px; padding: 0 20px;
        }

        .text-gradient {
            background: linear-gradient(135deg, #fff 0%, var(--primary-blue, #3b82f6) 100%);
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

        .highlight-blue { color: #3b82f6; }

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

        strong { color: #fff; font-weight: 600; }

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

        .marquee-item:hover { transform: scale(0.98); }

        .marquee-item img {
            width: 100%; height: 100%; object-fit: cover;
            filter: grayscale(60%) brightness(0.8);
            transition: all 0.5s ease;
        }

        .marquee-item:hover img {
            filter: grayscale(0%) brightness(1);
            transform: scale(1.1);
        }

        @keyframes scroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(calc(-630px * 12)); }
        }

        @media (max-width: 900px) {
            .marquee-item { width: 350px; height: 280px; }
            .marquee-container { height: 280px; }
            @keyframes scroll {
                0%   { transform: translateX(0); }
                100% { transform: translateX(calc(-380px * 12)); }
            }
            .text-gradient { font-size: 2.5rem; }
        }
      `}</style>

            {/* TITLE */}
            <div className="page-header">
                <m.h1
                    className="text-gradient"
                    variants={fadeIn("down", 0.1)}
                    initial="hidden"
                    animate="show"
                >
                    TechUNO
                </m.h1>
            </div>

            {/* INTRO */}
            <m.div variants={fadeIn("up", 0.2)} initial="hidden" animate="show">
                <p className="content-text">
                    TechUNO was an innovative technical event that combined coding challenges with the excitement of the popular UNO card game. Participants solved technical problems based on card selections and competed in interactive rounds that tested <strong>programming knowledge, logical thinking</strong>, and quick decision-making skills. The event provided a unique blend of learning and competition, encouraging teamwork, technical awareness, and problem-solving abilities through an engaging and enjoyable game-based format.
                </p>
            </m.div>

            {/* GALLERY */}
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
                            <img src={img} alt={`TechUNO ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* HIGHLIGHTS */}
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
                    The event began with an introduction to the rules and structure of TechUNO, where participants were familiarized with the unique game-based format that combined technical challenges with the popular UNO card game. Students were divided into teams and guided on how <strong>different card colors represented various coding and problem-solving tasks</strong>. The innovative concept immediately captured the attention of participants and created an energetic atmosphere that encouraged active involvement throughout the event.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    During the first round, participants selected UNO card colors and solved technical problem statements associated with their chosen cards. The challenges covered topics such as <strong>Data Structures and Algorithms, programming logic, looping concepts</strong>, and debugging tasks. Students worked collaboratively within their teams to analyze problems, discuss solutions, and apply their technical knowledge effectively. The round encouraged logical thinking, teamwork, and quick problem-solving while allowing participants to strengthen their understanding of important programming concepts in an engaging manner.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    One of the major highlights of the event was the second round, which featured <strong>one-on-one UNO matches combined with rapid-fire technical questions</strong>. Participants were required to make quick decisions while simultaneously answering technical questions under time constraints. This round tested not only their technical awareness but also their ability to think critically and respond accurately under pressure. The competitive nature of the activity created excitement among participants and kept the audience actively engaged throughout the session.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    The event successfully blended learning with entertainment by transforming technical challenges into an interactive gaming experience. Students enthusiastically participated in both rounds and demonstrated strong analytical thinking, communication, and teamwork skills. The game-based approach helped participants apply technical concepts in a practical and enjoyable environment while encouraging healthy competition among teams.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Overall, <strong>TechUNO</strong> was a highly engaging and successful technical event that combined coding, problem-solving, and strategic gameplay in a unique format. The event enhanced students' technical knowledge, logical reasoning, and decision-making abilities while providing a fun and memorable learning experience through active participation, teamwork, and competitive challenges that fostered collaborative growth.
                </m.p>
            </div>
        </div>
    );
};

export default TechUNO;
