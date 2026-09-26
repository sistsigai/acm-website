import React, { useEffect, useState } from 'react';
import titlevedio from '../../assets/HomePage/TitleVideo.mp4';
import { motion as m } from "framer-motion";
import { fadeIn } from '../../utils/animations';
import ne from '../../assets/HomePage/new.png';
import videoB from '../../assets/HomePage/SISTACMSIGAI.mp4';
import sat from '../../assets/HomePage/Sathyabama Institute of Science and Technology.png';
import grp from '../../assets/HomePage/grp-01.jpg';
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from 'react-icons/fa';
import { type AdminSettings, getAdminSettings } from '../../services/website/homeService';
import CopyrightFooter from '../../components/Footer';


const Home: React.FC = () => {
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getAdminSettings();
        setAdminSettings(data);
      } catch (err) {
        console.error("Failed to load admin settings", err);
      }
    };
    fetchSettings();
  }, []);



  return (
    <>
      {/* --- HERO SECTION --- */}
      <div className='main'>
        <video
          src={titlevedio}
          autoPlay loop muted playsInline preload="auto"
          controls={false} disablePictureInPicture
          style={{ pointerEvents: "none" }}
        />
      </div>

      <div className='About'>
        <div className='Aboutt'>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='aboutsec'>
            <m.h1
              className="text-gradient"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', marginBottom: '20px' }}
            >
              ABOUT SIST ACM SIGAI
            </m.h1>
            <p className='about-paragraph'>{adminSettings?.about}</p>
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='main-about'>
            <video src={videoB} autoPlay loop controls={false} muted playsInline disablePictureInPicture style={{ pointerEvents: 'none' }} />
          </m.div>

          <m.div variants={fadeIn("up", 0.4)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='mission'>
            <m.h1
              className="text-gradient"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', marginBottom: '20px' }}
            >
              OUR MISSION
            </m.h1>
            <p className='mission-paragraph'>{adminSettings?.mission}</p>
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='image-container'>
            <img src={ne} alt='LOGO REVEAL' loading="lazy" />
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='vision'>
            <m.h1
              className="text-gradient"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', marginBottom: '20px' }}
            >
              OUR VISION
            </m.h1>
            <p className='mission-paragraph'>{adminSettings?.vision}</p>
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" exit="exit" viewport={{ once: false, amount: 0.3 }} className='image-container'>
            <img src={sat} alt='SIST ACM SIGAI' loading="lazy" />
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='ideology'>
            <m.h1
              className="text-gradient"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', marginBottom: '20px' }}
            >
              OUR IDEOLOGY
            </m.h1>
            <p className='mission-paragraph'>{adminSettings?.ideology}</p>
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='image-container'>
            <img src={grp} alt='OUR CORE UNIT' loading="lazy" />
          </m.div>
        </div>
      </div>

      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-col footer-contact">
            <h3>Contact Us</h3>
            <div className="contact-list">
              <div className="contact-item">
                <span className="icon"><FaMapMarkerAlt /></span>
                <div className="contact-text">
                  <a href="https://www.sathyabama.ac.in" target="_blank" rel="noopener noreferrer">
                    {adminSettings?.contact.location || ""}
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <span className="icon"><FaEnvelope /></span>
                <div className="contact-text">
                  <a href={`mailto:${adminSettings?.contact.email}`}>{adminSettings?.contact.email}</a>
                </div>
              </div>
              <div className="contact-item">
                <span className="icon"><FaPhoneAlt /></span>
                <div className="contact-text">
                  <a href={`tel:${adminSettings?.contact.phone}`}>{adminSettings?.contact.phone}</a>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-col footer-center">
            <div className="footer-brand">
              <span className="hero-highlight">{adminSettings?.orgName || "SIST ACM SIGAI"}</span>
            </div>
            <p className="cta-text">Have questions or want to collaborate?</p>
            <a
              href="mailto:sist.sigai@gmail.com"
              className="write-us-btn"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              Write to Us <FaEnvelope style={{ marginLeft: '8px', display: 'inline' }} />
            </a>
            <div className="social-icons">
              <a href={adminSettings?.socials.twitter} target="_blank" aria-label="Twitter" className="social-icon twitter"><FaTwitter /></a>
              <a href={adminSettings?.socials.instagram} target="_blank" aria-label="Instagram" className="social-icon instagram"><FaInstagram /></a>
              <a href={adminSettings?.socials.linkedin} target="_blank" aria-label="LinkedIn" className="social-icon linkedin"><FaLinkedin /></a>
            </div>
          </div>

          <div className="footer-col footer-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.5412320274245!2d80.22350177642874!3d12.87288078743351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525b8c90befe2b%3A0x170ab8b5b21bb530!2sSathyabama%20Institute%20of%20Science%20and%20Technology!5e0!3m2!1sen!2sin!4v1710506289648!5m2!1sen!2sin"
              title="Sathyabama Location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <CopyrightFooter />
      </footer>
    </>
  );
};

export default Home;