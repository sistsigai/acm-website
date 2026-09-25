import { motion as m } from "framer-motion";
import { fadeIn } from '../../../components/transitions';

import itl1 from "../../../assets/Archives/ideatolaunch/itl1.jpg"
import itl2 from "../../../assets/Archives/ideatolaunch/itl2.jpg"
import itl3 from "../../../assets/Archives/ideatolaunch/itl3.jpg"
import itl4 from "../../../assets/Archives/ideatolaunch/itl4.jpg"
import itl5 from "../../../assets/Archives/ideatolaunch/itl5.jpg"
import itl6 from "../../../assets/Archives/ideatolaunch/itl6.jpg"
import itl7 from "../../../assets/Archives/ideatolaunch/itl7.jpg"
import itl8 from "../../../assets/Archives/ideatolaunch/itl8.jpg"

import itlbg from '../../../assets/Archives/ideatolaunch/itlbg.jpg';

const IdeaToLaunch = () => {
    const images = [
        itl1, itl2, itl3, itl4, itl5, itl6,
        itl7, itl8
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
          background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${itlbg});
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
                    IDEA TO LAUNCH
                </m.h1>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                animate="show"
            >
                <p className="content-text">
                    Idea to Launch was an insightful seminar designed to introduce students to the world of startups and entrepreneurship. The session, led by <strong>Mr. Sai Varun C</strong>, Co-Founder of Alletrix Tech LLP, guided participants on transforming innovative ideas into successful startup ventures. Students gained valuable insights into entrepreneurship concepts such as idea identification, skill development, and investment opportunities, creating an inspiring and informative learning experience for aspiring entrepreneurs.
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

            {/* --- SPEAKERS --- */}
            <m.h2
                className="section-title"
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
            >
                OUR <span className="highlight-blue">SPEAKER</span>
            </m.h2>

            <m.div
                className="guest-container"
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
            >
                {/* Speaker 1 */}
                <div className="guest-card">
                    <img src={'https://res.cloudinary.com/dxpglrdwn/image/upload/v1769709978/members/koddtujayynkvdmq3tkc.jpg'} alt="Mr. Sai varun C" />
                    <div className="card-overlay">
                        <div className="guest-info">
                            <h3>Mr. Sai varun C<br />
                                <span style={{ fontSize: '11px', fontWeight: '300', textTransform: 'initial', color: '#ccc' }}>
                                    4th year CSE-AIML
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
                    The event began with an engaging seminar session led by <strong>Mr. Sai Varun C</strong>, Co-Founder of Alletrix Tech LLP, who shared his inspiring entrepreneurial journey and experiences in building a startup from scratch. Students actively listened as he explained the challenges, risks, and opportunities involved in establishing a successful startup venture. His personal experiences and practical insights motivated participants to think innovatively and consider entrepreneurship as a potential career path.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    During the session, students were introduced to important entrepreneurship concepts such as idea identification, market analysis, skill development, and business planning. The speaker explained how innovative ideas can be transformed into practical startup ventures through consistent effort, strategic planning, and adaptability. Participants gained a better understanding of the importance of identifying real-world problems and developing creative solutions that could create meaningful impact in society.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    One of the major highlights of the event was the interactive discussion on investment opportunities and startup growth. Students learned about different funding methods, including investors, partnerships, and startup support initiatives available for young entrepreneurs. The session also focused on the importance of communication skills, leadership qualities, teamwork, and decision-making in successfully managing a startup environment. Participants enthusiastically engaged in the discussions and clarified their doubts regarding entrepreneurship and business development.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    The seminar created an inspiring atmosphere where students were encouraged to think creatively, explore innovative ideas, and understand the practical aspects of launching a startup. Participants showed great interest throughout the session and actively interacted with the speaker during discussions and question-answer segments. The event successfully provided students with valuable exposure to entrepreneurship and startup culture while motivating them to develop confidence in pursuing their own innovative ideas.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Overall, Idea to Launch was a highly informative and motivational seminar that encouraged students to explore entrepreneurship, innovation, and leadership through real-world insights and interactive learning experiences effectively.
                </m.p>
            </div>

        </div>
    );
}

export default IdeaToLaunch;
