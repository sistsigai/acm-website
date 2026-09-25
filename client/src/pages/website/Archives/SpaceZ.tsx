import { motion as m } from "framer-motion";
import { fadeIn } from '../../../components/transitions';

import s1 from '../../../assets/Archives/SpaceZ/s1.jpeg';
import s2 from '../../../assets/Archives/SpaceZ/s2.jpeg';
import s3 from '../../../assets/Archives/SpaceZ/s3.jpeg';
import s4 from '../../../assets/Archives/SpaceZ/s4.jpeg';
import s5 from '../../../assets/Archives/SpaceZ/s5.jpeg';
import sbg from '../../../assets/Archives/SpaceZ/sbg.avif';

const SpaceZ = () => {
    const images = [s1, s2, s3, s4, s5];
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
          background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${sbg});
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
            100% { transform: translateX(calc(-630px * 10)); }
        }

        @media (max-width: 900px) {
            .marquee-item { width: 350px; height: 280px; }
            .marquee-container { height: 280px; }
            @keyframes scroll {
                0%   { transform: translateX(0); }
                100% { transform: translateX(calc(-380px * 10)); }
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
                    SpaceZ
                </m.h1>
                <m.p
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    animate="show"
                    style={{ color: '#94a3b8', fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '8px' }}
                >
                    2nd February 2026
                </m.p>
            </div>

            {/* INTRO */}
            <m.div variants={fadeIn("up", 0.3)} initial="hidden" animate="show">
                <p className="content-text">
                    SpaceZ was an engaging multi-round competition designed to test participants' knowledge, creativity, and problem-solving abilities through <strong>space-themed challenges</strong>. The event featured quizzes, model-building activities, and image identification rounds that encouraged teamwork, innovation, and quick thinking. Participants explored concepts related to <strong>astronomy, space missions, and scientific advancements</strong> while actively engaging in interactive tasks, creating an intellectually stimulating and enjoyable learning experience for all involved.
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
                            <img src={img} alt={`SpaceZ ${index + 1}`} />
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
                    The event began with an exciting <strong>quiz round</strong> that tested participants' knowledge of space science, astronomy, planets, space missions, and scientific advancements. Students enthusiastically answered questions covering a wide range of topics related to the universe and space exploration. The round encouraged participants to recall their knowledge, think critically, and apply their understanding of scientific concepts in a competitive environment. The engaging nature of the quiz created excitement among teams and set an energetic tone for the rest of the event.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Following the quiz, participants advanced to the <strong>model-building round</strong>, which focused on creativity, innovation, and teamwork. Teams were provided with a problem statement and challenged to design and construct paper-based models that addressed the given scenario. Participants collaborated closely, exchanged ideas, and applied creative thinking to develop effective solutions within the allotted time. The activity encouraged students to combine imagination with practical problem-solving while strengthening communication and teamwork skills. The round witnessed enthusiastic participation and showcased the innovative abilities of the competing teams.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    One of the major highlights of the event was the final <strong>image identification round</strong>, where participants were required to recognize and respond to space-related visuals within a limited time. The round tested observation skills, quick thinking, and the ability to recall information accurately under pressure. Teams actively competed to identify images related to planets, spacecraft, astronomical phenomena, and other space-related subjects. The fast-paced nature of the activity kept participants engaged and added excitement to the competition.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Throughout the event, students displayed remarkable enthusiasm, teamwork, and curiosity toward space and scientific exploration. The combination of knowledge-based, creative, and rapid-response activities ensured that participants remained actively involved in every stage of the competition. The event successfully promoted learning through interaction and encouraged students to explore scientific concepts in an enjoyable manner.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Overall, <strong>SpaceZ</strong> was a highly engaging and successful competition that combined knowledge, creativity, teamwork, and quick thinking through a variety of space-themed challenges, providing participants with an enjoyable, educational, and memorable learning experience while fostering curiosity about science and innovation.
                </m.p>
            </div>
        </div>
    );
};

export default SpaceZ;
