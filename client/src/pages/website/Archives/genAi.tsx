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
        <div className="genai-page" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${genBg})` }}>

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