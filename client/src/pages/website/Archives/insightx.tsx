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
        <div className="synergy-page" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${insightxBg})` }}>

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
                viewport={{ once: false, amount: 0.1 }}
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
                    The event began with our core unit members, <strong>Ms. Janllyn Avantikha and Ms. Vaishnavi Battina</strong>, introducing our Student Chapter to the audience, followed by a speech from our honorable Head of the Department, <strong>Dr. Vigneshwari.</strong>
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false }}
                >
                    The first round of the event was a non-technical fun activity, "Trash to Treasure." All the students were divided into teams and provided with a bunch of trash and chart paper. They were tasked with creating something innovative from the materials they were given. The students showed immense enthusiasm and worked wonders with their creations. The results were evaluated by our faculty coordinators, <strong>Dr. R. Sathyabama Krishna and Dr. Anu Barathi</strong>. Two winners were selected from the teams.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false }}
                >
                    Following this was an orientation session where the members of our Student Chapter took the stage to explain the various future opportunities available to students after graduation. <strong>Ms. Sri Soundharya</strong>, Secretary of the Student Chapter, gave a detailed explanation of the current placement opportunities and how to aim for them. <strong>Ms. Sushree Sonali Patra</strong>, a core unit member, discussed entrepreneurship opportunities, highlighting its advantages and drawbacks with real-life examples. <strong>Ms. Vaishnavi Battina</strong>, another core unit member, familiarized the students with post-graduation degrees available to them, their eligibility criteria, and how to approach them. The students found this session extremely informative.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false }}
                >
                    <strong>Ms. Deekshitha</strong>, Treasurer of the Student Chapter, engaged with the students and spoke about the anxiety surrounding career decisions, offering advice on how to handle it and passionately pursue one's dreams.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false }}
                >
                    Overall, the event was a great success, and all the students thoroughly enjoyed it. We are thankful to all the dignitaries, faculty coordinators, student coordinators, and freshers who attended the event, contributing to its success. We look forward to organizing more such events in the future.
                </m.p>
            </div>

        </div>
    );
}

export default Insightx;