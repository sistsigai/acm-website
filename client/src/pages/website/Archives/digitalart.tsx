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
    <div className="digiart-page" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${digiBg})` }}>

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