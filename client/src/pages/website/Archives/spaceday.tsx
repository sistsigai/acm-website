import { motion as m } from "framer-motion";
import { fadeIn } from "../../../components/transitions";

// Import images
import s1 from '../../../assets/Archives/Spaceday/S1.jpg';
import s2 from '../../../assets/Archives/Spaceday/S2.jpg';
import s3 from '../../../assets/Archives/Spaceday/S3.jpg';
import s5 from '../../../assets/Archives/Spaceday/S5.jpg';
import s6 from '../../../assets/Archives/Spaceday/S6.jpg';
import s7 from '../../../assets/Archives/Spaceday/S7.jpg';
import s8 from '../../../assets/Archives/Spaceday/S8.jpg';
import s9 from '../../../assets/Archives/Spaceday/S9.jpg';
import s10 from '../../../assets/Archives/Spaceday/S10.jpg';
import s11 from '../../../assets/Archives/Spaceday/S11.jpg';
import s12 from '../../../assets/Archives/Spaceday/S12.jpg';
import s13 from '../../../assets/Archives/Spaceday/S13.jpg';
import s14 from '../../../assets/Archives/Spaceday/S14.jpg';
import guest from '../../../assets/Archives/Spaceday/guest.jpg';

// Background Image Import
import spaceBg from '../../../assets/Archives/Spaceday/background.jpg';

const sliderImages = [
    s1, s2, s3, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14,
    s1, s2, s3, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14
];

const Spaceday = () => {
    return (
        <div className="spaceday-page" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${spaceBg})` }}>

            {/* --- TITLE SECTION --- */}
            {/* Uses animate="show" for instant visibility on load */}
            <div className="page-header">
                <m.h1
                    className="text-gradient"
                    variants={fadeIn("down", 0.1)}
                    initial="hidden"
                    animate="show"
                >
                    SPACE DAY
                </m.h1>

                <m.p
                    className="content-text"
                    style={{ textAlign: 'center' }}
                    variants={fadeIn("up", 0.3)}
                    initial="hidden"
                    animate="show"
                >
                    Exploring the Cosmos. August 22nd, 2024.
                </m.p>
            </div>

            {/* --- INTRO TEXT --- */}
            {/* Uses animate="show" to ensure it's visible without needing to scroll first */}
            <m.div
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                animate="show"
            >
                <p className="content-text">
                    We are pleased to share that the SIST ACM SIGAI Student Chapter, in collaboration with the Centre for Remote Sensing and Informatics, conducted an event on the occasion of National Space Day on 22/08/2024 (Thursday) at Sathyabama Institute of Science and Technology, Chennai. Students from GHSS Perungudi and Evergreen School were invited to the university to participate in the event.
                </p>
            </m.div>

            {/* --- MARQUEE GALLERY --- */}
            {/* Reduced amount to 0.1 so it triggers immediately when any part is visible */}
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
                            <img src={img} alt="Space Day Highlight" />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- GUEST OF HONOUR --- */}
            <m.h2
                className="section-title"
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
            >
                GUEST OF <span className="highlight-blue">HONOUR</span>
            </m.h2>

            <m.div
                className="guest-container"
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
            >
                <div className="guest-card">
                    <img src={guest} alt="Padma Shri Dr. Mylswamy Annadurai" />
                    <div className="card-overlay">
                        <div className="guest-info">
                            <h3>Padma Shri Dr. Mylswamy Annadurai<br />
                                <span style={{ fontSize: '11px', fontWeight: '300', textTransform: 'initial', color: '#ccc' }}>
                                    MOON MAN OF INDIA
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
                viewport={{ once: true, amount: 0.1 }}
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
                    The morning session began with an orientation, during which <strong>Dr. Vigneshwari</strong>, Head of the Department of Computer Science (specializations in AI, AIML, DS), along with <strong>Dr. K Nagamani</strong>, delivered brief speeches outlining the day's events. This was followed by three competitions—painting, quiz, and ideathon—conducted simultaneously. In the painting competition, the participating students were provided with chart paper and given multiple space-related themes to illustrate in their paintings.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    The afternoon session featured a workshop led by our chief guest, the esteemed <strong>Padma Shri Dr. Mylswamy Annadurai</strong>, known as the <strong>"Moon Man of India"</strong>. He graciously addressed the event, interacting with all the students. He conducted a seminar on space science and exploration for future India, which captivated the students' interest.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    The event concluded with a prize distribution ceremony. All the winners of the painting, quiz, and ideathon contests were awarded certificates and Decathlon vouchers worth Rs. 3000, Rs. 2000, and Rs. 1000 for first, second, and third prizes, respectively.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Overall, the school students thoroughly enjoyed participating in the events. Transport was provided to all the students. The event was a grand success, and all the dignitaries praised it. We are grateful to all the faculty coordinators, student coordinators, and volunteers who contributed to the success of the event.
                </m.p>
            </div>

        </div>
    );
}

export default Spaceday;