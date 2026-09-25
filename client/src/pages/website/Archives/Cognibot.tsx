import { motion as m } from "framer-motion";
import { fadeIn } from '../../../components/transitions';

import c1 from '../../../assets/Archives/Cognibot/c1.jpeg';
import c2 from '../../../assets/Archives/Cognibot/c2.jpeg';
import c3 from '../../../assets/Archives/Cognibot/c3.jpeg';
import c4 from '../../../assets/Archives/Cognibot/c4.jpeg';
import c5 from '../../../assets/Archives/Cognibot/c5.jpeg';
import c6 from '../../../assets/Archives/Cognibot/c6.jpeg';
import cbg from '../../../assets/Archives/Cognibot/cbg.jpg';
import AjayKumar from "../../../assets/Archives/Cognibot/AjayKumar.jpeg"

const Cognibot = () => {
    const images = [c1, c2, c3, c4, c5, c6];
    const sliderImages = [...images, ...images, ...images];

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
          background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${cbg});
          background-size: cover;
          background-position: center;
          background-attachment: scroll;
          background-repeat: no-repeat;
        }

        .page-header, .section-header {
            text-align: center; margin-bottom: 40px; padding: 0 20px;
        }

        .text-gradient {
            background: linear-gradient(135deg, #fff 0%, var(--primary-blue, #3b82f6) 100%);
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

        .highlight-blue { color: #3b82f6; }

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

        strong { color: #fff; font-weight: 600; }

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

        .marquee-item:hover { transform: scale(0.98); }

        .marquee-item img {
            width: 100%; height: 100%; object-fit: cover;
            filter: grayscale(60%) brightness(0.8);
            transition: all 0.5s ease;
        }

        .marquee-item:hover img {
            filter: grayscale(0%) brightness(1);
            transform: scale(1.1);
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

        @keyframes scroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(calc(-630px * 18)); }
        }

        @media (max-width: 900px) {
            .marquee-item { width: 350px; height: 280px; }
            .marquee-container { height: 280px; }
            @keyframes scroll {
                0%   { transform: translateX(0); }
                100% { transform: translateX(calc(-380px * 18)); }
            }
            .text-gradient { font-size: 2.5rem; }
        }
      `}</style>

            {/* TITLE */}
            <div className="page-header">
                <m.h1
                    className="text-gradient"
                    variants={fadeIn("down", 0.1)}
                    initial="hidden"
                    animate="show"
                >
                    Cognibot
                </m.h1>
            </div>

            {/* INTRO */}
            <m.div variants={fadeIn("up", 0.2)} initial="hidden" animate="show">
                <p className="content-text">
                    COGNIBOT: Industrial Applications of Machine Learning was an informative technical session designed to expose students to the real-world implementation of Machine Learning across industries. Led by <strong>Mr. Ajay Kumar</strong>, CTO of Cognibot, the session explored practical applications, automation strategies, predictive analytics, and intelligent decision-making systems. Participants gained valuable industry-oriented insights into how organizations leverage Machine Learning technologies to improve efficiency, solve complex problems, and drive innovation.
                </p>
            </m.div>

            {/* GALLERY */}
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
                            <img src={img} alt={`Cognibot event photo ${index + 1}`} />
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
                    <img src={AjayKumar} alt="Mr. Ajay Kumar" />
                    <div className="card-overlay">
                        <div className="guest-info">
                            <h3>Mr. Ajay Kumar<br />
                                <span style={{ fontSize: '11px', fontWeight: '300', textTransform: 'initial', color: '#ccc' }}>
                                    Chief Technology Officer, Cognibot
                                </span>
                            </h3>
                        </div>
                    </div>
                </div>
            </m.div>

            {/* HIGHLIGHTS */}
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
                    The session began with an insightful introduction by <strong>Mr. Ajay Kumar, CTO of Cognibot</strong>, who provided students with an overview of Machine Learning and its growing significance in modern industries. Participants were introduced to the role of Artificial Intelligence and Machine Learning in solving real-world business challenges and improving operational efficiency. The speaker explained how these technologies have evolved beyond academic concepts and are now widely adopted across various industrial sectors to drive innovation and intelligent decision-making.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Following the introduction, the session focused on the practical applications of Machine Learning in industrial environments. Students learned how organizations utilize Machine Learning models to <strong>automate repetitive tasks, optimize workflows, analyze large volumes of data</strong>, and improve productivity. Through industry-oriented examples and case studies, the speaker demonstrated how Machine Learning contributes to predictive analytics, process automation, quality control, and business intelligence. These practical insights helped participants understand the direct impact of AI-driven solutions on organizational performance and growth.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    One of the major highlights of the session was the discussion on implementing and scaling Machine Learning solutions in real-world scenarios. The speaker explained the challenges organizations face while deploying AI systems, including <strong>data quality, model accuracy, scalability</strong>, and integration with existing processes. Students gained valuable exposure to industry practices and learned how professionals approach the development and deployment of Machine Learning applications in complex environments. The discussion provided participants with a realistic understanding of the opportunities and challenges associated with industrial AI adoption.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    The interactive nature of the session encouraged students to actively engage with the speaker and seek clarification on industry-related concepts. Participants explored emerging trends in Artificial Intelligence, discussed future career opportunities in Machine Learning, and gained a deeper appreciation for the importance of continuous learning in rapidly evolving technological fields. The session effectively bridged the gap between academic knowledge and industry expectations.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Overall, <strong>COGNIBOT</strong> was a highly informative and engaging technical session that provided students with practical insights into industrial Machine Learning applications, implementation strategies, and the transformative impact of Artificial Intelligence across various sectors worldwide today.
                </m.p>
            </div>
        </div>
    );
};

export default Cognibot;
