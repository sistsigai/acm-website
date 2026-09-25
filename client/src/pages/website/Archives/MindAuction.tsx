import { motion as m } from "framer-motion";
import { fadeIn } from '../../../components/transitions';

import ma1 from '../../../assets/Archives/MindAuction/ma1.jpeg';
import ma2 from '../../../assets/Archives/MindAuction/ma2.jpeg';
import ma3 from '../../../assets/Archives/MindAuction/ma3.jpeg';
import ma4 from '../../../assets/Archives/MindAuction/ma4.jpeg';
import ma5 from '../../../assets/Archives/MindAuction/ma5.jpeg';

import mabg from '../../../assets/Archives/MindAuction/mabg.jpg';

const MindAuction = () => {
    const images = [
        ma1, ma2, ma3, ma4, ma5
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
          background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${mabg});
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
            100% { transform: translateX(calc(-630px * 5)); }
        }

        /* --- RESPONSIVE --- */
        @media (max-width: 900px) {
            .marquee-item { width: 350px; height: 280px; }
            .marquee-container { height: 280px; }
            
            @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(calc(-380px * 5)); }
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
                    MIND AUCTION
                </m.h1>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                animate="show"
            >
                <p className="content-text">
                    Mind Auction was an interactive non-technical event designed to enhance students’ critical thinking, communication, and decision-making abilities through debate-based activities. Participants presented their viewpoints on assigned topics within limited time durations, encouraging thoughtful discussions and active participation. The event created an engaging platform for students to express ideas confidently, develop analytical thinking skills, and improve public speaking abilities while participating in competitive and intellectually stimulating discussions together.
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
                            <img src={img} alt={`Mind Auction Highlight ${index}`} />
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
                    The event began with an introduction to the structure and objectives of Mind Auction, where participants were familiarized with the debate-based format and the rules of the activity. Students were informed about how topics would be assigned and how they would be required to present their viewpoints within a limited period of time. The session immediately created curiosity and excitement among participants, encouraging them to think critically and prepare themselves for active discussions throughout the event.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    As the event progressed, participants enthusiastically presented their opinions on a variety of assigned topics, expressing their ideas with confidence and clarity. Students actively engaged in debates, shared perspectives, defended their viewpoints, and responded thoughtfully to opposing opinions during discussions. The activity encouraged participants to analyze topics from different angles and develop logical arguments within limited time constraints. The competitive environment motivated students to think quickly, communicate effectively, and present their ideas in a structured and convincing manner.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    One of the major highlights of the event was the active participation and confidence displayed by students during the debate rounds. Participants demonstrated strong communication skills, creativity, analytical thinking, and decision-making abilities while presenting their viewpoints. The event also encouraged students to listen carefully to others' opinions, respect different perspectives, and engage in healthy intellectual discussions. The interactive nature of the activity made the session lively, engaging, and enjoyable for both participants and the audience.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    The debate-based format helped students improve their public speaking skills and boosted their confidence in expressing ideas before an audience. Participants learned the importance of clarity, reasoning, and time management while presenting arguments effectively. The event successfully created an environment that promoted collaboration, discussion, and knowledge sharing among students through meaningful conversations and critical analysis.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Overall, Mind Auction was a highly engaging and successful non-technical event that effectively enhanced students' communication, critical thinking, decision-making, and public speaking abilities through interactive debates, active participation, and intellectually stimulating discussions conducted in a competitive and enjoyable atmosphere.
                </m.p>
            </div>

        </div>
    );
}

export default MindAuction;
