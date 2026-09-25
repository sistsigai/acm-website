import { motion as m } from "framer-motion";
import { fadeIn } from '../../../components/transitions';

import t1 from '../../../assets/Archives/Techmemeathon/t1.jpeg';
import t2 from '../../../assets/Archives/Techmemeathon/t2.jpeg';
import t3 from '../../../assets/Archives/Techmemeathon/t3.jpeg';
import t4 from '../../../assets/Archives/Techmemeathon/t4.jpeg';
import tbg from '../../../assets/Archives/Techmemeathon/tbg.jpg';

const Techmemeathon = () => {
    const images = [t1, t2, t3, t4];
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
          background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${tbg});
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
                    Tech-Meme-A-Thon
                </m.h1>
            </div>

            {/* INTRO */}
            <m.div variants={fadeIn("up", 0.2)} initial="hidden" animate="show">
                <p className="content-text">
                    Tech-Meme-A-Thon was a creative technical competition designed to combine <strong>technology, humor, and innovation</strong> through engaging meme-based activities. Participants worked in teams to create and present technical memes inspired by programming concepts, coding experiences, emerging technologies, and student life. Through multiple interactive rounds, the event encouraged creativity, teamwork, and communication skills while fostering a fun learning environment that allowed students to express technical knowledge in an entertaining and relatable manner.
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
                            <img src={img} alt={`Tech-Meme-A-Thon ${index + 1}`} />
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
                    The event began with an introduction to the competition format, where participants were familiarized with the rules, objectives, and different rounds of Tech-Meme-A-Thon. Students were grouped into <strong>teams of two</strong> and encouraged to combine technical knowledge with creativity to produce humorous and relatable content. The unique concept of blending technology with humor immediately generated excitement among participants and created an energetic atmosphere that encouraged active involvement throughout the event.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Following the introduction, participants took part in <strong>caption-creation activities</strong> that challenged them to develop witty and engaging captions based on programming concepts, coding experiences, and technology-related scenarios. Teams enthusiastically brainstormed ideas and used their understanding of technical subjects to create humorous content that resonated with fellow students. The activity encouraged creativity, quick thinking, and communication while allowing participants to express technical concepts in an entertaining manner.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    One of the major highlights of the event was the <strong>technical meme design round</strong>, where participants created original memes inspired by coding challenges, emerging technologies, software development experiences, and student life in the field of computing. Teams demonstrated impressive originality and creativity while transforming complex technical topics into simple and relatable visual content. The round encouraged innovation and provided students with an opportunity to showcase both their technical understanding and creative abilities through digital expression.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    The event also featured a <strong>gallery walk</strong> where teams presented and displayed their meme creations for evaluation and discussion. Participants explored the work of other teams, exchanged ideas, and appreciated different perspectives on technology-related humor. The interactive nature of this activity promoted collaboration, communication, and a stronger sense of community among participants. Students actively engaged with one another and enjoyed the opportunity to learn through creativity and shared experiences.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Overall, <strong>Tech-Meme-A-Thon</strong> was a highly engaging and successful technical event that combined innovation, teamwork, humor, and technical knowledge through creative activities. The competition encouraged participants to think creatively, communicate effectively, and present relatable technology-based content while fostering a lively, enjoyable, and collaborative learning environment for all students involved throughout the program.
                </m.p>
            </div>
        </div>
    );
};

export default Techmemeathon;
