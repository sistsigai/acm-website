import { motion as m } from "framer-motion";
import { fadeIn } from '../../../components/transitions';

// Import images
import g1 from '../../../assets/Archives/Genai/G1.jpg';
import g2 from '../../../assets/Archives/Genai/G2.jpg';
import g3 from '../../../assets/Archives/Genai/G3.jpg';
import g4 from '../../../assets/Archives/Genai/G4.jpg';
import g5 from '../../../assets/Archives/Genai/G5.jpg';
import g6 from '../../../assets/Archives/Genai/G6.jpg';
import g7 from '../../../assets/Archives/Genai/G7.jpg';
import g8 from '../../../assets/Archives/Genai/G8.jpg';
import g9 from '../../../assets/Archives/Genai/G9.jpg';
import harsha from '../../../assets/Archives/Genai/HARSHA.jpg';
import kishore from '../../../assets/Archives/Genai/kishore.jpg';

// Background Image Import
import genBg from '../../../assets/Archives/Genai/background.webp';

const sliderImages = [
    g1, g2, g3, g4, g5, g6, g7, g8, g9,
    g1, g2, g3, g4, g5, g6, g7, g8, g9
];

const Genai = () => {
    return (
        <div className="genai-page">
            <style>{`
        .genai-page {
          width: 100%;
          padding: 120px 0 60px;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          overflow-x: hidden;
          min-height: 100vh;

          /* --- BACKGROUND IMAGE SETUP --- */
          background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${genBg});
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
            color: #0099ff; /* Azure Blue */
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

        /* Calculation: 9 items * (600px + 30px) = 5670px */
        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-630px * 9)); }
        }

        /* --- SPEAKER CARD STYLES --- */
        .guest-container {
            display: flex;
            justify-content: center;
            flex-wrap: wrap; /* Allows cards to wrap */
            gap: 40px; /* Space between cards */
            margin-bottom: 80px;
            padding: 0 20px;
        }

        .guest-card {
             position: relative;
             width: 300px;
             height: 400px;
             overflow: hidden;
             box-shadow: 0 30px 30px -20px rgba(0, 0, 0, 1), inset 0 0 0 1000px rgba(67, 52, 109, .2);
             border-radius: 15px;
             display: flex;
             justify-content: center;
             align-items: center;
             transition: transform 0.3s ease;
             background: rgba(30, 41, 59, 0.8); 
             backdrop-filter: blur(5px);
        }

        .guest-card:hover { transform: scale(1.05); }

        .guest-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: 0.5s;
        }

        .guest-card .card-overlay {
            position: absolute;
            bottom: -160px;
            width: 100%;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            backdrop-filter: blur(15px);
            background: rgba(0,0,0,0.8);
            box-shadow: 0 -10px 10px rgba(0, 0, 0, 0.1);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            transition: bottom 0.5s;
        }

        .guest-card:hover .card-overlay {
            bottom: 0;
        }

        .guest-info h3 {
            text-transform: uppercase;
            color: #ffffff;
            letter-spacing: 1px;
            font-weight: 700;
            font-size: 16px;
            text-align: center;
            margin: 0;
        }

        /* --- RESPONSIVE --- */
        @media (max-width: 900px) {
            .marquee-item { width: 350px; height: 280px; }
            .marquee-container { height: 280px; }
            
            @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(calc(-380px * 9)); }
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
                    DEEP DIVE INTO <br /> GEN-AI
                </m.h1>

                <m.p
                    className="content-text"
                    style={{ textAlign: 'center' }}
                    variants={fadeIn("up", 0.3)}
                    initial="hidden"
                    animate="show"
                >
                    A Collaborative Innovation. August 1st, 2024.
                </m.p>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                animate="show"
            >
                <p className="content-text">
                    We are thrilled to announce that the SIST ACM SIGAI Student Chapter hosted its first collaborative event on August 1, 2024, in the Remibai Auditorium at Sathyabama Institute of Science and Technology, Chennai. This event was organized in partnership with the School of Science and Humanities. A special thank you to <strong>Dr. Rekha Chakravarthi</strong>, Dean of the Arts and Sciences department, for facilitating the collaboration.
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
                            <img src={img} alt="Gen-AI Event Highlight" />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- SPEAKERS --- */}
            <m.h2
                className="section-title"
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.3 }}
            >
                OUR <span className="highlight-blue">SPEAKERS</span>
            </m.h2>

            <m.div
                className="guest-container"
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.3 }}
            >
                {/* Speaker 1 */}
                <div className="guest-card">
                    <img src={harsha} alt="Mr. Jonnalagadda Sri Harsha" />
                    <div className="card-overlay">
                        <div className="guest-info">
                            <h3>Mr. Jonnalagadda Sri Harsha<br />
                                <span style={{ fontSize: '11px', fontWeight: '300', textTransform: 'initial', color: '#ccc' }}>
                                    3rd year CSE-DS
                                </span>
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Speaker 2 */}
                <div className="guest-card">
                    <img src={kishore} alt="Mr. Kishore Ramanan" />
                    <div className="card-overlay">
                        <div className="guest-info">
                            <h3>Mr. Kishore Ramanan<br />
                                <span style={{ fontSize: '11px', fontWeight: '300', textTransform: 'initial', color: '#ccc' }}>
                                    3rd year CSE-AIML
                                </span>
                            </h3>
                        </div>
                    </div>
                </div>
            </m.div>

            {/* --- HIGHLIGHTS TEXT --- */}
            <m.h2
                className="section-title"
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.3 }}
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
                    The event focused on Generative AI and was attended by an enthusiastic crowd of second-year BSc students. <strong>Ms. Janllyn Avantikha</strong>, a core unit member, started the event by introducing the speakers and providing an overview about the session.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false }}
                >
                    Two of our third-year students from the CSE Data Science specialization, <strong>Sri Harsha Jonnalagadda</strong> and <strong>Kishore Ramanan</strong>, took the lead as speakers. In the first half of the event, they introduced the students to Generative AI and explained its applications in everyday life in detail. A live demonstration of generating content like text, images, and PPTs was conducted, and input prompts were taken from the audience, encouraging active participation from all students.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false }}
                >
                    In the second half of the event, a hands-on session based on the Ollama model was conducted. This was followed by a digital art competition in which all the participants showcased their extraordinary talent. The event concluded with <strong>Ms. Vaishnavi Battina</strong>, a core team member of the club, delivering a vote of thanks.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false }}
                >
                    The event has been lively and interactive. It was well-received by all the students and dignitaries who attended. We are extremely grateful to the core unit, volunteers and all the people who contributed in making this event a success and we are look forward to hosting more such events in the future.
                </m.p>
            </div>

        </div>
    );
}

export default Genai;