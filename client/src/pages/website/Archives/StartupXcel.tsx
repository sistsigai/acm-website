import { motion as m } from "framer-motion";
import { fadeIn } from '../../../components/transitions';

import sx1 from '../../../assets/Archives/StartupXcel/sx1.jpeg';
import sx2 from '../../../assets/Archives/StartupXcel/sx2.jpeg';
import sx3 from '../../../assets/Archives/StartupXcel/sx3.jpeg';
import sx4 from '../../../assets/Archives/StartupXcel/sx4.jpeg';
import sxbg from '../../../assets/Archives/StartupXcel/sxbg.jpg';

const StartupXcel = () => {
    const images = [sx1, sx2, sx3, sx4];
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
          background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${sxbg});
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
            animation: scroll 40s linear infinite;
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
            100% { transform: translateX(calc(-630px * 8)); }
        }

        @media (max-width: 900px) {
            .marquee-item { width: 350px; height: 280px; }
            .marquee-container { height: 280px; }
            @keyframes scroll {
                0%   { transform: translateX(0); }
                100% { transform: translateX(calc(-380px * 8)); }
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
                    Startup Xcel
                </m.h1>
            </div>

            {/* INTRO */}
            <m.div variants={fadeIn("up", 0.2)} initial="hidden" animate="show">
                <p className="content-text">
                    Startup Xcel was an engaging technical competition designed to foster <strong>creativity, innovation, branding skills, and entrepreneurial thinking</strong> among students. The event challenged participants to develop startup ideas, create unique brand identities, and pitch their business concepts through multiple interactive rounds. By combining problem-solving, teamwork, and presentation skills, the competition provided an excellent platform for students to explore entrepreneurship while showcasing their creativity, confidence, and innovative mindset.
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
                            <img src={img} alt={`Startup Xcel ${index + 1}`} />
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
                    The event began with an exciting <strong>ideation round</strong> where participants were encouraged to identify real-world problems and develop innovative startup concepts to address them. Students worked collaboratively in teams to brainstorm ideas, analyze challenges, and propose practical solutions with potential social and commercial impact. The activity encouraged creative thinking and entrepreneurial problem-solving while allowing participants to explore how innovative ideas can be transformed into meaningful business opportunities. Teams actively discussed their concepts and demonstrated enthusiasm throughout the ideation process.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Following the initial round, participants advanced to the <strong>branding and design stage</strong>, which focused on developing unique identities for their startup concepts. Teams created logos, brand names, and visual elements that effectively represented their business ideas and objectives. This round encouraged students to think beyond technical solutions and understand the importance of branding, marketing, and visual communication in building a successful startup. Participants displayed remarkable creativity and originality while designing identities that reflected the vision and purpose of their proposed ventures.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    One of the major highlights of the event was the final <strong>pitching round</strong>, where teams presented their startup ideas before the audience and coordinators. Participants explained the problem they aimed to solve, the solutions they proposed, their target audience, and the overall business strategy behind their concepts. The presentations tested communication, confidence, and persuasion skills while providing students with valuable experience in presenting ideas in a professional setting. Teams demonstrated excellent preparation and showcased their ability to articulate innovative concepts effectively.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    The competition created an energetic and collaborative atmosphere where students exchanged ideas, learned from one another, and developed a deeper appreciation for entrepreneurship and innovation. The multi-round structure encouraged participants to combine creativity, teamwork, critical thinking, and presentation skills throughout the event. Students remained actively engaged and displayed enthusiasm during every stage of the competition.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Overall, <strong>Startup Xcel</strong> was a highly interactive and successful event that promoted innovation, entrepreneurial thinking, branding, and problem-solving through engaging activities. The competition provided students with valuable exposure to startup development while enhancing their creativity, teamwork, confidence, and business communication skills.
                </m.p>
            </div>
        </div>
    );
};

export default StartupXcel;
