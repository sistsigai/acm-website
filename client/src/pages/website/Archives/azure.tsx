import { motion as m } from "framer-motion";
import { fadeIn } from "../../../components/transitions";

// Import images
import BASHEER from '../../../assets/Archives/Azure/BASHEER.jpg';
import log from '../../../assets/Archives/Azure/w5.jpg';
import id2 from '../../../assets/Archives/Azure/w7.jpg';
import grp1 from '../../../assets/Archives/Azure/w8.jpg';
import grp2 from '../../../assets/Archives/Azure/w9.jpg';
import vai from '../../../assets/Archives/Azure/w1.jpg';
import sq from '../../../assets/Archives/Azure/w6.jpg';
import mani from '../../../assets/Archives/Azure/w3.jpg';
import adi from '../../../assets/Archives/Azure/w4.jpg';
import sat from '../../../assets/Archives/Azure/w2.jpg';

// Background Image Import
import bgImage from '../../../assets/Archives/Azure/background.jpg';

// Image Array for the Marquee
const sliderImages = [
    vai, sat, mani, adi, log, sq, id2, grp1, grp2,
    vai, sat, mani, adi, log, sq, id2, grp1, grp2
];

const Azure = () => {
    return (
        <div className="azure-page">
            <style>{`
        .azure-page {
          width: 100%;
          padding: 120px 0 60px;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          overflow-x: hidden;
          min-height: 100vh;

          /* --- BACKGROUND IMAGE SETUP --- */
          background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${bgImage});
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

        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-630px * 9)); }
        }

        /* --- GUEST CARD STYLES --- */
        .guest-container {
            display: flex;
            justify-content: center;
            margin-bottom: 80px;
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
                    AZURE CASCADE
                </m.h1>

                <m.p
                    className="content-text"
                    style={{ textAlign: 'center' }}
                    variants={fadeIn("up", 0.3)}
                    initial="hidden"
                    animate="show"
                >
                    First Event. July 8th, 2024.
                </m.p>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                animate="show"
            >
                <p className="content-text">
                    We are elated to share with you that <strong>SIST ACM SIGAI Student Chapter</strong> has successfully conducted its very first event which took place on 08/07/2024 at Dental Auditorium, Sathyabama University.
                </p>
                <p className="content-text">
                    The event began with two of our core team members <strong>Ms. Vaishnavi</strong> and <strong>Ms. Vedha Varshini</strong> introducing our speaker <strong>Mr. Harun Raseed Basheer</strong>, Microsoft MVP, Specialist, Hitachi Solutions India Pvt Ltd who gracefully addressed the event.
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
                            <img src={img} alt="Azure Event Highlight" />
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
                viewport={{ once: false, amount: 0.3 }}
            >
                GUEST OF <span className="highlight-blue">HONOUR</span>
            </m.h2>

            <m.div
                className="guest-container"
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.3 }}
            >
                <div className="guest-card">
                    <img src={BASHEER} alt="Mr. Harun Raseed Basheer" />
                    <div className="card-overlay">
                        <div className="guest-info">
                            <h3>Mr. Harun Raseed Basheer<br />
                                <span style={{ fontSize: '11px', fontWeight: '300', textTransform: 'initial', color: '#ccc' }}>
                                    Microsoft MVP, Specialist, Hitachi Solutions
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
                    The speaker took the lead making the session really interesting. By the end of the session, all the students in the room were familiar with the key concepts of cloud computing. The students were also informed in detail about the Microsoft Student Ambassador program and its benefits. The session has been interactive and extremely informative.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false }}
                >
                    After this session, the speaker was presented with a memento by our respected HOD, <strong>Dr. S Vigneshwari</strong> and <strong>Dr. R Sathyabama Krishna, Dr. Anubharathi.</strong>
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false }}
                >
                    The event was then followed by an empowering speech about mental health given by our very own treasurer of SIST ACM SIGAI Student Chapter, <strong>Ms. Deekshitha</strong>. The audience was ecstatic after listening to her motivating words and her own experiences. The students actively participated in the discussion by sharing their personal views too.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false }}
                >
                    We concluded the event by launching our SIST ACM SIGAI Student Chapter's official website. Our core team member <strong>Ms. Janllyn Avantika</strong> presented and explained all the features of the website to the audience.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false }}
                >
                    Overall it has been an overwhelming experience and we received a positive response from the students and the dignitaries who attended the event. We are excited and are looking forward to conducting more events this way and hope we get a similar, encouraging response.
                </m.p>
            </div>

        </div>
    );
}

export default Azure;