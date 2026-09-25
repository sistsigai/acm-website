import { motion as m } from "framer-motion";
import { fadeIn } from '../../../components/transitions';

import gcwl1 from '../../../assets/Archives/Linkedin/gcwl1.jpg';
import gcwl2 from '../../../assets/Archives/Linkedin/gcwl2.jpg';
import gcwl3 from '../../../assets/Archives/Linkedin/gcwl3.jpg';
import gcwl4 from '../../../assets/Archives/Linkedin/gcwl4.jpg';
import gcwl5 from '../../../assets/Archives/Linkedin/gcwl5.jpg';
import gcwl6 from '../../../assets/Archives/Linkedin/gcwl6.jpg';
import gcwl7 from '../../../assets/Archives/Linkedin/gcwl7.jpg';
import gcwl8 from '../../../assets/Archives/Linkedin/gcwl8.jpg';
import gcwl9 from '../../../assets/Archives/Linkedin/gcwl9.jpg';
import gcwl10 from '../../../assets/Archives/Linkedin/gcwl10.jpg';
import gcwl11 from '../../../assets/Archives/Linkedin/gcwl11.jpg';

import gcwlbg from '../../../assets/Archives/Linkedin/gcwlbg.jpg';

const linkedin = () => {
    const images = [
        gcwl1, gcwl2, gcwl3, gcwl4, gcwl5, gcwl6,
        gcwl7, gcwl8, gcwl9, gcwl10, gcwl11
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
          background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${gcwlbg});
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
                    Get linked with Linkedin
                </m.h1>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                animate="show"
            >
                <p className="content-text">
                    Get Linked with LinkedIn was an interactive workshop designed to help first-year students understand the importance of LinkedIn and build their professional presence online. The session guided participants in creating LinkedIn accounts, setting up profiles, and exploring key platform features. Students also learned how LinkedIn supports career development, networking, and job opportunities, making the event an informative and valuable experience for their future professional growth.
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
                    The event began with an introductory session that familiarized first-year students with LinkedIn and its growing importance in today's professional world. Participants were introduced to the purpose of LinkedIn as a professional networking platform and learned how it helps students connect with industry professionals, explore career opportunities, and build a strong online presence. The session created awareness among students about the importance of maintaining a professional identity from the early stages of their academic journey.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Following the introduction, students were guided through the process of creating their own LinkedIn accounts and setting up professional profiles. The session included step-by-step explanations on adding profile details such as educational background, skills, achievements, certifications, and profile photographs. Participants actively followed the instructions and learned how to organize their profiles effectively to create a positive first impression for recruiters and professional connections.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    One of the major highlights of the event was the interactive guidance provided on exploring LinkedIn features and using the platform for career development. Students learned how to build professional networks, connect with peers and mentors, follow organizations, and stay updated with industry trends. The session also explained how LinkedIn can support internship opportunities, job searches, and personal branding through active engagement and content sharing. Participants showed great interest in understanding how the platform could contribute to their future academic and professional growth.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    The workshop encouraged active participation and interaction throughout the session, with students clarifying doubts and exploring the platform practically during the event. The hands-on approach made the learning process engaging and easy to understand for beginners. Participants gained confidence in using LinkedIn effectively and recognized its value in developing professional communication and networking skills.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Overall, Get Linked with LinkedIn was a highly informative and practical workshop that successfully introduced students to professional networking and career development through interactive learning and guided profile-building activities for future success.
                </m.p>
            </div>

        </div>
    );
}

export default linkedin;
