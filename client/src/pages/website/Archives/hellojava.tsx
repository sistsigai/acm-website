import { motion as m } from "framer-motion";
import { fadeIn } from '../../../components/transitions';

import hj1 from "../../../assets/Archives/hellojava/hj1.jpg"
import hj2 from "../../../assets/Archives/hellojava/hj2.jpg"
import hj3 from "../../../assets/Archives/hellojava/hj3.jpg"
import hj4 from "../../../assets/Archives/hellojava/hj4.jpg"
import hj5 from "../../../assets/Archives/hellojava/hj5.jpg"
import hj6 from "../../../assets/Archives/hellojava/hj6.jpg"
import hj7 from "../../../assets/Archives/hellojava/hj7.jpg"
import hj8 from "../../../assets/Archives/hellojava/hj8.jpg"
import hj9 from "../../../assets/Archives/hellojava/hj9.jpg"
import hj10 from "../../../assets/Archives/hellojava/hj10.jpg"
import hj11 from "../../../assets/Archives/hellojava/hj11.jpg"

import hjbg from '../../../assets/Archives/hellojava/hjbg.jpg';

const HelloJava = () => {
    const images = [
        hj1, hj2, hj3, hj4, hj5, hj6,
        hj7, hj8, hj9, hj10, hj11
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
          background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${hjbg});
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
                    Hello Java'25
                </m.h1>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                animate="show"
            >
                <p className="content-text">
                    Hello Java’25 was an engaging two-day workshop designed for second-year students to strengthen their understanding of Java programming. The event combined interactive technical sessions, creative activities, and placement-oriented coding challenges to create a collaborative learning environment. Students explored fundamental and advanced Java concepts, participated in a Java Meme Contest, and enhanced their problem-solving skills through coding activities, gaining confidence and practical knowledge for future academic and career opportunities.
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
                    The event began with interactive Java learning sessions conducted for second-year students in their respective classrooms. The sessions focused on strengthening students' programming fundamentals while also introducing them to advanced Java concepts. Participants actively engaged in hands-on learning activities, which helped them gain a deeper understanding of object-oriented programming, problem-solving techniques, and practical applications of Java.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    To make the workshop more engaging and enjoyable, a <strong>"Java Meme Contest"</strong> was conducted where students creatively expressed programming concepts through humor and relatable content. The activity encouraged participants to think creatively while connecting technical concepts with fun and interactive ideas. Students enthusiastically participated and showcased their creativity through innovative meme designs.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Following this, a placement-oriented mini coding challenge was organized to help students test their technical and logical thinking abilities. Participants solved coding problems designed to enhance their problem-solving skills and prepare them for future placement opportunities. The challenge created a competitive yet motivating environment where students were able to apply the concepts they had learned during the sessions.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Throughout the two-day workshop, students actively interacted with coordinators and peers, making the learning process collaborative and engaging. The combination of technical learning, creative activities, and coding practice ensured that participants not only improved their Java knowledge but also gained confidence in applying programming concepts effectively.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Overall, Hello Java'25 was a successful and enriching workshop that provided students with a strong foundation in Java programming while encouraging creativity, teamwork, and analytical thinking in an interactive learning environment.
                </m.p>
            </div>

        </div>
    );
}

export default HelloJava;