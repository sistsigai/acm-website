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
    <div className="inaugural-page" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${bgImage})` }}>

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