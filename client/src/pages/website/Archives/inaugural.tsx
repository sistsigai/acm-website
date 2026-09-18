import { motion as m } from "framer-motion";
import { fadeIn } from "../../../components/transitions";

// Import images
import inauguralchiefguest from '../../../assets/Archives/Inaugural/inauguralchiefguest.jpg';
import logoReveal from '../../../assets/Archives/Inaugural/logoReveal.jpg';
import img1 from '../../../assets/Archives/Inaugural/img1.jpg';
import grpimg from '../../../assets/Archives/Inaugural/grpimg.jpg';
import sigaigrp from '../../../assets/Archives/Inaugural/sigaigrp.jpg';
import speech1 from '../../../assets/Archives/Inaugural/speech1.jpg';
import img2 from '../../../assets/Archives/Inaugural/img2.jpg';
import img3 from '../../../assets/Archives/Inaugural/img3.jpg';
import img4 from '../../../assets/Archives/Inaugural/img4.jpg';
import bgImage from '../../../assets/Archives/Inaugural/background.jpg';

// Image Array for the Marquee
const sliderImages = [
  speech1, img3, img4, logoReveal, img2, img1, grpimg, sigaigrp,
  speech1, img3, img4, logoReveal, img2, img1, grpimg, sigaigrp
];

const Inaugural = () => {
  return (
    <div className="inaugural-page">
      <style>{`
        .inaugural-page {
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

        .highlight-blue {
            color: #3b82f6; /* Primary Blue */
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
          INAUGURATION OF <br /> SIST ACM SIGAI
        </m.h1>

        <m.p
          className="content-text"
          style={{ textAlign: 'center' }}
          variants={fadeIn("up", 0.3)}
          initial="hidden"
          animate="show"
        >
          A new chapter begins. April 8th, 2024.
        </m.p>
      </div>

      {/* --- INTRO TEXT --- */}
      <m.div
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        animate="show"
      >
        <p className="content-text">
          We are excited to share that the SIST ACM SIGAI Student Chapter has been successfully inaugurated on 8th April 2024 (Monday) at Tmt. Soundrabai Auditorium, Sathyabama Institute of Science & Technology, Chennai. We would like to thank all the Admins, Deans, HoDs, Faculties and Students who supported us.
        </p>
        <p className="content-text">
          Graced by the presence of esteemed dignitaries: Vice President <strong>Ms. Maria Catherine Jayapriya</strong>, Vice Chancellor <strong>Dr. Sasipraba T</strong>, Chief Guest <strong>Ms. Rajalakshmi Srinivasan</strong>, Director Administration <strong>Dr. Sundari G</strong>, Dean COMPUTING <strong>Dr. T. Sasikala</strong>, and our distinguished Heads of Departments.
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
              <img src={img} alt="Inauguration Highlight" />
            </div>
          ))}
        </div>
      </div>

      {/* --- GUESTS OF HONOUR --- */}
      <m.h2
        className="section-title"
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
      >
        GUESTS OF <span className="highlight-blue">HONOUR</span>
      </m.h2>

      {/* Changed div to m.div for animation */}
      <m.div
        className="guest-container"
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
      >
        <div className="guest-card">
          <img src={inauguralchiefguest} alt="Ms. Rajalakshmi Srinivasan" />
          <div className="card-overlay">
            <div className="guest-info">
              <h3>Ms. Rajalakshmi Srinivasan<br />
                <span style={{ fontSize: '11px', fontWeight: '300', textTransform: 'initial', color: '#ccc' }}>
                  Director - Product Management, Zoho
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
          Ceremonial lighting of the lamp followed by a welcome address by <strong>Dean of School of Computing, Dr. T. Sasikala</strong>.
          <strong> Mrs. Rajalakshmi Srinivasan</strong>, Director of Product Management at Zoho Corporations, emphasized the importance of practical learning.
          <strong> Vice President Ms. Maria Catherine Jayapriya</strong> pledged support for the club's initiatives.
          <strong> Vice Chancellor Dr. T. Sasiprabha</strong> stressed inter-departmental collaboration.
        </m.p>

        <m.p
          className="content-text"
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
        >
          <strong>The Head of Computer Science and Engineering department, Dr. S. Vigneshwari</strong> took a moment to express her appreciation for the Chairperson, Vice Chairperson, and every member of the core unit and she spoke very enthusiastically about the projects related to AI and her vision to bring the community together.
        </m.p>

        <m.p
          className="content-text"
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
        >
          The core unit of the club were introduced by the Chairperson. Each and every member was called onto the stage and was presented with ID cards by our respectful Vice president mam and Vice Chancellor mam.
        </m.p>

        <m.p
          className="content-text"
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
        >
          <strong>Core Unit:</strong> Chairperson - Gowtham S, Vice Chairperson – Bharath Kodidasu, Treasurer – Deekshitha Uppu, and our dedicated team members: Bellamkonda Harithreenath, Aditya Sai Teja B, Siva Krishna Adimulam, Manisri Venkatesh, Meghana Tanikella, Battina Vaishnavi, Niharika Ramayanam, D V Bhuvanesh, Ram Prasath, Sushree Sonali Patra, Vedha Varshini Vijay Ananth, Faheem Mohamed Rafi, Devendra Reddy, Janllyn Avantikha.
        </m.p>
      </div>
    </div>
  );
}

export default Inaugural;