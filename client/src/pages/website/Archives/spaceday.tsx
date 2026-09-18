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
        <div className="spaceday-page">
            <style>{`
        .spaceday-page {
          width: 100%;
          padding: 120px 0 60px;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          overflow-x: hidden;
          min-height: 100vh;

          /* --- BACKGROUND IMAGE SETUP --- */
          background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${spaceBg});
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
            color: #0099ff; /* Primary Blue */
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
            animation: scroll 60s linear infinite;
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
            /* Adjusted for roughly 13 unique images */
            100% { transform: translateX(calc(-630px * 13)); }
        }

        /* --- GUEST CARD STYLES --- */
        .guest-container {
            display: flex;
            justify-content: center;
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
                100% { transform: translateX(calc(-380px * 13)); }
            }
            
            .text-gradient { font-size: 2.5rem; }
        }
      `}</style>

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