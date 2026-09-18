import React, { useEffect, useState } from 'react';
import titlevedio from '../../assets/HomePage/Titlevedio.mp4';
import { motion as m } from "framer-motion";
import { fadeIn } from '../../components/transitions';
import ne from '../../assets/HomePage/new.png';
import videoB from '../../assets/HomePage/SISTACMSIGAI.mp4';
import sat from '../../assets/HomePage/Sathyabama Institute of Science and Technology.png';
import grp from '../../assets/HomePage/grp-01.jpeg.jpg';
import { GlobalLoader } from "../../components/GlobalLoader";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from 'react-icons/fa';
import { type AdminSettings, getAdminSettings } from '../../services/website/Homeservice';
import { FloatingOrb } from '../../components/StatusMessage';
import CopyrightFooter from '../../components/Footer';
import ContactModal from '../../components/ContactModal';


const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Controls the GlobalLoader
  const [statusVisible, setStatusVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error">("success");
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

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

  useEffect(() => {
    if (statusVisible) {
      const timer = setTimeout(() => setStatusVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusVisible]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Handlers for Modal success/error states
  const handleModalSuccess = (message: string) => {
    setStatusType("success");
    setStatusMessage(message);
    setStatusVisible(true);
  };

  const handleModalError = (message: string) => {
    setStatusType("error");
    setStatusMessage(message);
    setStatusVisible(true);
  };

  const additionalStyles = `
    /* --- FORM VALIDATION STYLES --- */
    .inputbx.has-error input,
    .inputbx.has-error textarea {
      border-bottom-color: #ef4444 !important;
      background: rgba(239, 68, 68, 0.05) !important;
    }
    
    .inputbx.has-error input:focus,
    .inputbx.has-error textarea:focus {
      border-bottom-color: #dc2626 !important;
      box-shadow: 0 10px 20px -10px rgba(239, 68, 68, 0.2) !important;
    }
    
    .error-message {
      color: #ef4444;
      font-size: 0.85rem;
      margin-top: 5px;
      display: flex;
      align-items: center;
      gap: 5px;
      animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .error-icon {
      font-size: 0.9rem;
    }
    
    .character-count {
      text-align: right;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 4px;
    }
    
    .character-count.warning {
      color: #f59e0b;
    }
    
    .character-count.error {
      color: #ef4444;
    }
    
    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none !important;
    }
  `;

  return (
    <>
      <GlobalLoader isLoading={isSubmitting} />

      <FloatingOrb
        isVisible={statusVisible}
        message={statusMessage}
        type={statusType}
        onClose={() => setStatusVisible(false)}
      />

      <style>{`
        :root {
            --primary-blue: #3b82f6;
            --primary-glow: rgba(59, 130, 246, 0.6);
            --glass-bg: rgba(255, 255, 255, 0.03);
            --glass-border: rgba(255, 255, 255, 0.1);
        }

        /* --- GLOBAL RESETS --- */
        * { box-sizing: border-box; }
        video::-webkit-media-controls { display: none !important; }

        @keyframes gradientShift {
          0% { background-position: 0 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }

        /* --- LAYOUT CONTAINERS --- */
        .main {
            position: relative;
            height: 100dvh;
            width: 100%;
            min-height: 500px;
            overflow: hidden;
            background: #000; 
        }

        .main video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          z-index: 0;
        }

        .About {
            position: relative; z-index: 1; background: inherit;
            width: 100%; overflow-x: hidden; 
        }

        .Aboutt {
            width: 100%; max-width: 1200px; margin: 0 auto;
            padding: 60px 20px;
            display: flex; flex-direction: column; align-items: center; text-align: center;
        }

        /* --- SECTIONS & SPACING --- */
        .ideology, .vision, .mission, .main-about, .image-mission, .aboutsec, .image-container {
            margin-top: 80px;
            display: flex; align-items: center; justify-content: center;
            flex-direction: column; width: 100%;
        }

        .main-about { margin-top: 100px; width: 100%; }

        /* --- TECH BADGES (SECTION HEADERS) --- */
        .tech-badge {
            display: inline-block;
            padding: 12px 45px;
            margin-bottom: 30px;
            color: #fff;
            font-size: clamp(1.2rem, 3vw, 1.8rem);
            font-weight: 700;
            letter-spacing: 3px;
            text-transform: uppercase;
            
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(59, 130, 246, 0.4);
            border-radius: 50px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.15), inset 0 0 10px rgba(59, 130, 246, 0.05);
            
            position: relative;
            transition: all 0.3s ease;
        }

        .tech-badge:hover {
            border-color: #fff;
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.4);
            transform: scale(1.05);
        }

        .tech-badge::before, .tech-badge::after {
            content: ''; position: absolute; top: 50%; transform: translateY(-50%);
            width: 6px; height: 6px; background: var(--primary-blue); border-radius: 50%;
            box-shadow: 0 0 8px var(--primary-blue);
        }
        .tech-badge::before { left: 20px; }
        .tech-badge::after { right: 20px; }

        .tech-highlight { color: var(--primary-blue); }

        p.mission-paragraph, p.about-paragraph {
            color: #e0e0e0; font-size: clamp(16px, 2vw, 20px); font-weight: 300;
            font-family: "Roboto", sans-serif; line-height: 1.6; text-align: justify;
            max-width: 900px; padding: 0 10px;
        }

        .image-container img {
            width: 80%; max-width: 900px; height: auto; display: block; margin: 0 auto;
            border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
        }
        .main-about video {
            position: relative; width: 80%; max-width: 900px; height: auto;
            aspect-ratio: 16/9; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            object-fit: cover; border: 1px solid rgba(255,255,255,0.1);
        }

        /* --- FOOTER --- */
        .main-footer {
            background: linear-gradient(to right, #000428, #004e92);
            color: #ffffff; padding: 60px 0 0 0; font-family: 'Segoe UI', sans-serif;
            width: 100%; margin-top: 50px;
        }
        .footer-container {
            max-width: 1400px; margin: 0 auto; padding: 0 20px 40px 20px;
            display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; align-items: start;
        }
        .footer-col h3 {
            color: #fff; font-size: 1.3rem; margin-bottom: 25px; text-transform: uppercase;
            letter-spacing: 1px; border-bottom: 2px solid #5CA0F2; display: inline-block; padding-bottom: 5px;
        }
        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 18px;
        }
        .contact-item .icon {
          width: 26px;
          min-width: 26px;
          font-size: 1.25rem;
          color: #5CA0F2;
          line-height: 1;
          margin-top: 2px;
        }
        .contact-text { line-height: 1.6; }
        .contact-text a {
          color: #e0e0e0; text-decoration: none; font-weight: 500; display: inline-block;
        }
        .contact-item p a, .contact-item > a {
            color: #e0e0e0; text-decoration: none; transition: color 0.3s; font-weight: 500; word-break: break-word;
        }
        .contact-item p a:hover, .contact-item > a:hover { color: #5CA0F2; }
        .footer-center { text-align: center; display: flex; flex-direction: column; align-items: center; }
        
        .footer-brand {
            font-size: 2.5rem; font-weight: 900; 
            margin-bottom: 15px; letter-spacing: 1px;
            font-family: 'Poppins', sans-serif;
            text-transform: uppercase;
        }

        .write-us-btn {
            background: transparent; color: #fff; border: 1px solid #5CA0F2;
            padding: 12px 35px; font-size: 1rem; border-radius: 30px; cursor: pointer;
            box-shadow: 0 0 15px rgba(92, 160, 242, 0.2); transition: all 0.3s ease;
            margin-bottom: 30px; font-weight: 700; white-space: nowrap;
        }
        .write-us-btn:hover {
            box-shadow: 0 0 25px rgba(92, 160, 242, 0.6); background: #5CA0F2; color: #000;
        }
        .social-icons { display: flex; gap: 15px; flex-wrap: wrap; justify-content: center; }
        .social-icon {
            width: 45px; height: 45px; background: rgba(255,255,255,0.1); border-radius: 50%;
            display: flex; align-items: center; justify-content: center; text-decoration: none;
            font-size: 1.4rem; color: #e0e0e0; transition: all 0.3s ease;
            border: 1px solid rgba(255,255,255,0.05);
        }

        .social-icon.twitter:hover { 
            background: #1DA1F2; color: #fff; transform: translateY(-3px);
            box-shadow: 0 0 20px rgba(29, 161, 242, 0.5); border-color: #1DA1F2;
        }
        .social-icon.instagram:hover { 
            background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%); 
            background-origin: border-box; background-clip: border-box; color: #fff; 
            transform: translateY(-3px); box-shadow: 0 0 20px rgba(214, 36, 159, 0.5); border-color: transparent;
        }
        .social-icon.linkedin:hover { 
            background: #0A66C2; color: #fff; transform: translateY(-3px);
            box-shadow: 0 0 20px rgba(10, 102, 194, 0.5); border-color: #0A66C2;
        }
        .social-icon:hover { transform: translateY(-3px); background: #5CA0F2; color: #fff; }
        .footer-map iframe {
            width: 100%; height: 250px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        /* --- MODAL --- */
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(15px);
          display: flex; justify-content: center; align-items: flex-start;
          padding-top: 120px; z-index: 10000; padding-left: 20px; padding-right: 20px;
        }

        .modal-content-styled {
            background: rgba(10, 15, 30, 0.7);
            padding: 40px; width: 100%; max-width: 800px; border-radius: 20px;
            position: relative; border: 1px solid rgba(59, 130, 246, 0.5);
            box-shadow: 0 0 50px rgba(59, 130, 246, 0.15), inset 0 0 20px rgba(59, 130, 246, 0.05);
            color: #fff; max-height: 90vh; overflow-y: auto;
            display: flex; flex-direction: column; overflow-y: auto;
            scrollbar-width: none; -ms-overflow-style: none; 
        }
        .modal-content-styled::-webkit-scrollbar { display: none; }

        .close-modal {
            position: absolute; top: 20px; right: 20px;
            background: transparent; width: 40px; height: 40px;
            border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.2);
            font-size: 1.2rem; cursor: pointer; color: #fff;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.3s ease; z-index: 10;
        }
        .close-modal:hover {
            border-color: #ff4d4d; color: #ff4d4d; transform: rotate(90deg);
            box-shadow: 0 0 15px rgba(255, 77, 77, 0.4);
        }

        .modal-title {
            text-align: center; margin-bottom: 40px;
            font-size: 2rem; font-weight: 800; letter-spacing: 2px;
            color: #fff; text-transform: uppercase;
        }

        .hero-highlight {
            background: linear-gradient(135deg, #fff 0%, var(--primary-blue) 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 0 20px var(--primary-glow));
        }

        .formBx { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; width: 100%; }
        .inputbx.full-width { grid-column: span 2; }
        .inputbx { display: flex; flex-direction: column; width: 100%; position: relative; }
        
        .inputbx span {
            margin-bottom: 8px; font-weight: 600; font-size: 0.9rem;
            color: var(--primary-blue); text-transform: uppercase; letter-spacing: 1px;
        }

        .inputbx input, .inputbx textarea {
            width: 100%; padding: 15px; border: none; border-bottom: 2px solid rgba(255, 255, 255, 0.2);
            font-size: 1rem; color: #fff; background: rgba(255,255,255,0.03); border-radius: 4px 4px 0 0;
            transition: all 0.3s ease; font-family: 'Poppins', sans-serif;
        }

        .inputbx input:focus, .inputbx textarea:focus {
            border-bottom: 2px solid var(--primary-blue); background: rgba(59, 130, 246, 0.1);
            box-shadow: 0 10px 20px -10px rgba(59, 130, 246, 0.2); outline: none;
        }

        .submit-btn {
            background: var(--primary-blue); color: #fff; padding: 18px; border: none; border-radius: 8px;
            font-weight: 800; text-transform: uppercase; letter-spacing: 2px;
            cursor: pointer; width: 100%; margin-top: 15px; display: flex; justify-content: center; align-items: center; gap: 10px;
            transition: all 0.3s; box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }
        .submit-btn:hover { background: #2563eb; box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }

        ${additionalStyles}

        /* --- RESPONSIVE --- */
        @media (max-width: 900px) {
            .tech-badge { font-size: 1.2rem; padding: 10px 30px; }
            .footer-container { grid-template-columns: 1fr; text-align: center; }
            .footer-col h3 { border-bottom: none; margin-top: 20px; }
            .contact-item { justify-content: center; }
            .main-about video { width: 95%; }
            .formBx { grid-template-columns: 1fr; }
            .inputbx.full-width { grid-column: span 1; }
        }

        @media (max-width: 768px) {
            .main { height: 70dvh; min-height: 420px; }
            .main video { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
            .modal-overlay { padding-top: 90px; }
        }
      `}</style>

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
            <div className="tech-badge"><span className="tech-highlight">About </span>SIST ACM SIGAI</div>
            <p className='about-paragraph'>{adminSettings?.about}</p>
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='main-about'>
            <video src={videoB} autoPlay loop controls={false} muted playsInline disablePictureInPicture style={{ pointerEvents: 'none' }} />
          </m.div>

          <m.div variants={fadeIn("up", 0.4)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='mission'>
            <div className="tech-badge"><span className="tech-highlight">Our</span> Mission</div>
            <p className='mission-paragraph'>{adminSettings?.mission}</p>
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='image-container'>
            <img src={ne} alt='LOGO REVEAL' loading="lazy" />
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='vision'>
            <div className="tech-badge"><span className="tech-highlight">Our</span> Vision</div>
            <p className='mission-paragraph'>{adminSettings?.vision}</p>
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" exit="exit" viewport={{ once: false, amount: 0.3 }} className='image-container'>
            <img src={sat} alt='SIST ACM SIGAI' loading="lazy" />
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='ideology'>
            <div className="tech-badge"><span className="tech-highlight">Our</span> Ideology</div>
            <p className='mission-paragraph'>{adminSettings?.ideology}</p>
          </m.div>

          <m.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} className='image-container'>
            <img src={grp} alt='OUR CORE UNIT' loading="lazy" />
          </m.div>
        </div>
      </div>

      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-col">
            <h3>Contact Us</h3>
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

          <div className="footer-col footer-center">
            <div className="footer-brand">
              <span className="hero-highlight">{adminSettings?.orgName || "SIST ACM SIGAI"}</span>
            </div>
            <p className="cta-text">Have questions or want to collaborate?</p>
            <button className="write-us-btn" onClick={toggleModal}>
              Write to Us <FaEnvelope style={{ marginLeft: '8px', display: 'inline' }} />
            </button>
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

      {/* --- INJECT MODAL COMPONENT --- */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        onSuccess={handleModalSuccess}
        onError={handleModalError}
        onLoading={setIsSubmitting} // Connects modal loading state to GlobalLoader
      />
    </>
  );
};

export default Home;