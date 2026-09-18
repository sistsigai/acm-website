import { motion as m } from "framer-motion";
import { fadeIn } from '../../../components/transitions';

// Import images
import spiderman from '../../../assets/Archives/Digiart/spiderman.jpg';
import winner from '../../../assets/Archives/Digiart/winner.jpg';
import grpimg from '../../../assets/Archives/Digiart/grpimg.jpg';

// Background Image Import
import digiBg from '../../../assets/Archives/Digiart/background.jpg';

const Digiart = () => {
  return (
    <div className="digiart-page">
      <style>{`
        .digiart-page {
          width: 100%;
          padding: 120px 0 60px;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          overflow-x: hidden;
          min-height: 100vh;

          /* --- BACKGROUND IMAGE SETUP --- */
          background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${digiBg});
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

        /* --- IMAGES & CONTAINERS --- */
        .image-container {
            display: flex;
            justify-content: center;
            margin: 40px 0;
            padding: 0 20px;
        }

        .showcase-image {
            max-width: 100%;
            height: auto;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
            transition: transform 0.3s ease;
        }

        .showcase-image:hover {
            transform: scale(1.02);
        }

        /* --- WINNER CARD STYLE --- */
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
            .text-gradient { font-size: 2.5rem; }
            .showcase-image { width: 100%; }
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
            DIGITAL <br /> ART
        </m.h1>
        
        <m.p 
            className="content-text" 
            style={{ textAlign: 'center' }}
            variants={fadeIn("up", 0.3)}
            initial="hidden"
            animate="show"
        >
            Creativity meets Technology. August 1st, 2024.
        </m.p>
      </div>

      {/* --- INTRO TEXT --- */}
      <m.div
         variants={fadeIn("up", 0.2)}
         initial="hidden"
         animate="show"
      >
        <p className="content-text">
            We are thrilled to announce that the SIST ACM SIGAI Student Chapter hosted a digital art event on August 1, 2024, in the Remibai Auditorium at Sathyabama Institute of Science and Technology, Chennai.
        </p>
      </m.div>

      {/* --- WINNER'S ARTWORK --- */}
      <m.h2 
        className="section-title"
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
      >
        WINNER'S <span className="highlight-blue">ARTWORK</span>
      </m.h2>
      
      <m.div 
        className="image-container"
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false }}
      >
        <img 
            src={spiderman} 
            alt="Winner Artwork - Spiderman" 
            className="showcase-image"
            style={{ width: '400px' }}
        />
      </m.div>

      {/* --- EVENT WINNER --- */}
      <m.h2 
        className="section-title"
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
      >
        EVENT <span className="highlight-blue">WINNER</span>
      </m.h2>
      
      <m.div 
        className="guest-container"
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
      >
        <div className="guest-card">
            <img src={winner} alt="Mr. Godwin Deepak T" />
            <div className="card-overlay">
                <div className="guest-info">
                    <h3>Mr. Godwin Deepak T<br />
                    <span style={{ fontSize: '11px', fontWeight: '300', textTransform: 'initial', color: '#ccc' }}>
                        3rd year CSE
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
            The SIST ACM SIGAI Student Chapter recently conducted an artistic "Digital Art Competition" for the students of the CSE department on August 1, 2024. It was a remarkable event where participants enthusiastically showcased their talent in digital technology through their excellent artistic skills. The theme of this exciting competition was freestyle comics, and the artist who captured the hearts of the audience with his work was <strong>Godwin Deepak T</strong>.
        </m.p>
        
        {/* Winners Group Photo */}
        <m.div 
            className="image-container"
            variants={fadeIn("up", 0.3)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false }}
        >
            <img 
                src={grpimg} 
                alt="Digital Art Competition Winners" 
                className="showcase-image"
                style={{ width: '800px' }}
            />
        </m.div>
      </div>

    </div>
  );
}

export default Digiart;