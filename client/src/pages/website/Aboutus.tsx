import React, { useState, useEffect } from 'react';
import { motion as m } from "framer-motion";
import Tilt from 'react-vanilla-tilt';
import { useLocation } from 'react-router-dom';
import { fadeIn } from '../../components/transitions';
import { FaInstagram, FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";

// --- LOCAL IMAGES (Only for non-member content) ---
import { getMembers, type Member } from '../../services/website/aboutservice';
import { FloatingOrb } from '../../components/StatusMessage';

interface FrontendMember {
  id: string;
  name: string;
  designation: string;
  img: string;
  social?: Array<{
    type: "instagram" | "linkedin" | "twitter" | "facebook";
    link: string;
  }>;
  additional?: string;
}

interface AboutProps { }

const About: React.FC<AboutProps> = () => {
  const [selectedUnit, setSelectedUnit] = useState<string>('volunteers');
  const location = useLocation();
  const [selectedYear, setSelectedYear] = useState<string>('2025-2026');
  const [members, setMembers] = useState<Member[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");


  type SocialType = "instagram" | "linkedin" | "facebook";

  interface FrontendSocial {
    type: SocialType;
    link: string;
  }

  // --- FETCH MEMBERS FROM BACKEND ---
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembers();
        setMembers(data);
      } catch (err) {
        console.error("Error fetching members:", err);
        setMessageText("Failed to load team members. Please try again later.");
        setShowMessage(true);
      }
    };

    fetchMembers();
  }, []);

  // --- YEAR SELECTION LOGIC ---
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const batchParam = searchParams.get('batch');
    if (batchParam === '2024-2025') {
      setSelectedYear('2024-2025');
    } else {
      setSelectedYear('2025-2026');
    }
  }, [location]);

  const handleDropdownChange1 = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUnit(event.target.value);
  };

  // --- HELPER FUNCTIONS ---
  const convertSocialToArray = (
    social?: Member['social']
  ): FrontendSocial[] => {
    if (!social) return [];

    return [
      social.linkedin && { type: "linkedin", link: social.linkedin },
      social.instagram && { type: "instagram", link: social.instagram },
      social.facebook && { type: "facebook", link: social.facebook },
    ].filter(Boolean) as FrontendSocial[];
  };

  const convertToFrontendMember = (member: Member): FrontendMember => {
    return {
      id: member._id,
      name: member.name,
      designation: member.designation,
      img: member.imageUrl,
      social: convertSocialToArray(member.social)
    };
  };

  const normalize = (v: string) => v.replace(/[–—]/g, "-").trim();

  const filterMembers = (
    batch: string,
    designationKeywords: string[],
    sortOldest = false
  ): FrontendMember[] => {
    const normalizedBatch = normalize(batch);

    const filtered = members.filter(member =>
      normalize(member.batch) === normalizedBatch &&
      designationKeywords.some(keyword =>
        member.designation.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    if (sortOldest) {
      filtered.sort(sortOldestFirst);
    }

    return filtered.map(convertToFrontendMember);
  };


  const getMembersByUnit = (unit: string): FrontendMember[] => {
    const keywords: Record<string, string[]> = {
      volunteers: ['volunteer'],
      media: ['media'],
      research: ['research'],
    };

    return filterMembers(selectedYear, keywords[unit] || ['volunteer'], true);
  };

  const getLeadershipPriority = (designation: string): number => {
    const d = designation.toLowerCase();
    if (d.includes("vice chairperson")) return 2;
    if (d.includes("chairperson")) return 1;
    if (d.includes("treasurer")) return 3;
    if (d.includes("secretary")) return 4;
    return 99; // fallback
  };

  const getLeadershipData = (): FrontendMember[] => {
    return filterMembers(selectedYear, [
      "chairperson",
      "vice chairperson",
      "treasurer",
      "secretary",
    ]).sort(
      (a, b) =>
        getLeadershipPriority(a.designation) -
        getLeadershipPriority(b.designation)
    );
  };

  const getCoreTeamData = (): FrontendMember[] => {
    return filterMembers(selectedYear, ['core team'], true);
  };


  const getFacultyData = (): FrontendMember[] => {
    return filterMembers(selectedYear, ['hod', 'faculty convener'], true);
  };


  const getFacultyCoordinatorsData = (): FrontendMember[] => {
    return filterMembers(
      selectedYear,
      ['associate professor', 'faculty coordinator'],
      true
    );
  };


  const getCardsData = (): FrontendMember[] => {
    return getMembersByUnit(selectedUnit);
  };

  const sortOldestFirst = (a: Member, b: Member) => {
    const aTime = parseInt(a._id.substring(0, 8), 16) * 1000;
    const bTime = parseInt(b._id.substring(0, 8), 16) * 1000;

    return aTime - bTime;
  };


  // --- REUSABLE CARD COMPONENT ---
  const MemberCard = ({ member, isLarge = false }: { member: FrontendMember; isLarge?: boolean }) => {
    return (
      <m.div
        variants={fadeIn("up", 0.15)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
        style={{ willChange: "opacity, transform" }}
      >
        <Tilt
          id="tilt-card"
          options={{ scale: 1.05, speed: 1000, max: 15 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className={`member-card ${isLarge ? "large" : ""}`}>
            <div className="card-img-wrapper">
              <img
                src={member.img}
                alt={member.name}
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/280x380?text=No+Image";
                }}
              />
            </div>

            <div className="card-content">
              <div className="text-box">
                <h3>{member.name}</h3>
                <span>{member.designation}</span>
              </div>

              <div className="social-icons">
                {member.social?.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    className={`social-icon ${social.type}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.type === "instagram" && <FaInstagram />}
                    {social.type === "linkedin" && <FaLinkedin />}
                    {social.type === "twitter" && <FaTwitter />}
                    {social.type === "facebook" && <FaFacebook />}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Tilt>
      </m.div>
    );
  };



  return (
    <>

      {/* FLOATING MESSAGE */}
      <FloatingOrb
        isVisible={showMessage}
        message={messageText}
        type="error"
        onClose={() => setShowMessage(false)}
      />
      <style>{`
        /* --- MAIN LAYOUT & HERO --- */
        .about1 {
          display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
          text-align: center; min-height: 100vh; width: 100%; padding-top: 120px;
        }

        /* --- TITLE ENHANCEMENT 1: HERO TITLE --- */
        .about1 h1 {
          color: #fff; 
          font-size: clamp(35px, 6vw, 65px); /* Slightly larger */
          font-family: "Poppins", sans-serif;
          font-weight: 800; /* Bolder */
          margin-bottom: 30px;
          text-shadow: 0 0 20px rgba(0,0,0,0.5);
          letter-spacing: -1px;
        }

        /* Gradient Highlight Class for Title */
        .title-highlight {
          background: linear-gradient(120deg, #fff 0%, #00c3ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 10px rgba(0, 195, 255, 0.4));
        }

        .content1 {
          display: flex; flex-direction: column; align-items: center; max-width: 1200px;
          padding: 0 20px; color: #fff;
        }
        .content1 .img img { width: 150px; height: auto; margin-bottom: 20px; }
        .wrapper1 h3 {
          font-size: 16px; font-weight: 300; letter-spacing: 0.5px; line-height: 1.6;
          margin-bottom: 20px; text-align: justify;
        }
        .button1 a {
          color: #fff; background-color: #00c3ff; padding: 10px 30px; border-radius: 20px;
          text-transform: uppercase; letter-spacing: 1px; transition: 0.3s; display: inline-block;
          margin-top: 20px; font-weight: bold; text-decoration: none;
        }
        .button1 a:hover { background-color: #fff; color: #000; }

        /* --- MAIN CONTENT AREA --- */
        .bd { padding: 50px 0; min-height: 100vh; }

        /* --- TITLE ENHANCEMENT 2: SECTION HEADERS --- */
        .section-title {
          text-align: center; margin: 80px 0 50px;
          position: relative;
          z-index: 1;
        }
        
        .section-title h4 {
          display: inline-block;
          padding: 14px 45px;
          color: #fff;
          font-size: clamp(18px, 2.5vw, 24px);
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          
          /* Glassmorphism Badge Style */
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(0, 195, 255, 0.3);
          border-radius: 50px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 0 20px rgba(0, 195, 255, 0.1), inset 0 0 10px rgba(0, 195, 255, 0.05);
          
          position: relative;
          transition: all 0.3s ease;
        }

        /* Hover Effect for Badge */
        .section-title h4:hover {
          border-color: #00c3ff;
          box-shadow: 0 0 30px rgba(0, 195, 255, 0.3), inset 0 0 20px rgba(0, 195, 255, 0.1);
          transform: translateY(-3px);
          color: #fff;
        }

        /* Tech Dots (Left and Right decoration) */
        .section-title h4::before,
        .section-title h4::after {
          content: '';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          background-color: #00c3ff;
          border-radius: 50%;
          box-shadow: 0 0 10px #00c3ff;
        }

        .section-title h4::before { left: 20px; }
        .section-title h4::after { right: 20px; }

        .section-title span { 
          font-size: 0.8em; font-weight: bold; display: block; margin-top: 5px; opacity: 0.8; 
        }

        /* --- DROPDOWN --- */
        .dropdown-container { display: flex; justify-content: center; margin-bottom: 30px; align-items: center; gap: 10px; }
        .dropdown-container select {
          padding: 10px 20px; border: 2px solid lightblue; border-radius: 5px;
          background: rgba(0,0,0,0.5); color: #fff; cursor: pointer; outline: none;
        }
        .dropdown-container select option { background: #000; color: #fff; }

        /* --- GRID SYSTEM --- */
        .grid-container {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 40px;
          max-width: 1400px; margin: 0 auto; padding: 0 20px;
        }

        /* --- CARD STYLING --- */
        .member-card {
          width: 280px; height: 380px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px; overflow: hidden;
          position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: transform 0.3s;
        }
        
        .member-card.large { width: 320px; height: 420px; }

        .card-img-wrapper {
          width: 100%; height: 100%;
          overflow: hidden;
        }
        .card-img-wrapper img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: top center;
          transition: transform 0.5s;
        }
        .member-card:hover .card-img-wrapper img {
          transform: scale(1.1);
        }

        .card-content {
          position: absolute; bottom: 0; left: 0; width: 100%;
          padding: 20px; background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(5px);
          display: flex; flex-direction: column; align-items: center; 
          border-top: 1px solid rgba(255,255,255,0.2);
          transform: translateY(100%);
          transition: transform 0.4s ease-in-out; 
        }
        .member-card:hover .card-content { transform: translateY(0); }

        .text-box h3 {
  color: #ffffff;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 6px;
  font-family: "Poppins", sans-serif;
}
        
.text-box span {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  text-align: center;
  display: block;
}
        .text-box .additional { color: #ccc; font-size: 10px; margin-top: 2px; }

        .social-icons {
          display: flex; gap: 15px; flex-wrap: wrap; justify-content: center;
          margin-top: 15px; width: 100%;
        }

        .social-icon {
          width: 45px; height: 45px; background: rgba(255, 255, 255, 0.1);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          text-decoration: none; font-size: 1.4rem; color: #e0e0e0; transition: all 0.3s ease;
        }
        .social-icon:hover { transform: translateY(-3px); }
        .social-icon.twitter:hover { color: #1DA1F2; background: rgba(29, 161, 242, 0.1); }
        .social-icon.instagram:hover { color: #E1306C; background: rgba(225, 48, 108, 0.1); }
        .social-icon.linkedin:hover { color: #0077B5; background: rgba(0, 119, 181, 0.1); }
        .social-icon.facebook:hover { color: #1877F2; background: rgba(24, 119, 242, 0.1); }

        .loading-spinner, .error-message { text-align: center; padding: 100px 20px; color: white; }
        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.1); border-radius: 50%;
          border-top: 4px solid #00c3ff; width: 40px; height: 40px;
          animation: spin 1s linear infinite; margin: 20px auto;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .error-message h2 { color: #ff6b6b; margin-bottom: 20px; }
        .retry-button {
          background-color: #00c3ff; color: white; border: none; padding: 10px 30px;
          border-radius: 20px; cursor: pointer; font-weight: bold; transition: 0.3s;
        }
        .retry-button:hover { background-color: white; color: black; }

        @media (max-width: 768px) {
          .member-card, .member-card.large { width: 260px; height: 350px; }
          .grid-container { gap: 20px; }
        }
        
        #tilt-card { display: flex; justify-content: center; }

        .leadership-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px;
          max-width: 1400px; margin: 0 auto;
        }
        @media (max-width: 1200px) { .leadership-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .leadership-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className='about1' id='about'>
        {/* ENHANCED MAIN TITLE */}
        <m.h1
          variants={fadeIn("up", 0)}
          initial="hidden"
          animate="show"
          viewport={{ once: true, amount: 0.7 }}
        >
          EXPLORE <span className="title-highlight">ACM SIGAI!!</span>
        </m.h1>

        <div className='content1'>

          <div className='wrapper1'>
            <h3>
              The scope of SIGAI, ACM's Special Interest Group on Artificial Intelligence, consists of the study of intelligence and its realization in computer systems. SIGAI's mission is to promote and support AI-related conferences. Members receive reduced registration rates to all affiliated conferences. Members also receive proceedings from the major SIGAI-sponsored conferences.SIGAI publishes a quarterly newsletter, AI Matters, with ideas and announcements of interest to the AI community.
            </h3>

            <h3>
              ACM SIGAI is the Association for Computing Machinery's Special Interest Group on Artificial Intelligence (AI),an interdisciplinary group of academic and industrial researchers, practitioners, software developers, end users, and students who work together to promote and support the growth and application of AI principles and techniques throughout computing. SIGAI is one of the oldest special interest groups in the ACM. SIGAI, previously called SIGART, started in 1966, publishing the SIGART Newsletter that later became the SIGART Bulletin and Intelligence Magazine.
            </h3>

            <h3>
              On January 10, 1947, at the Symposium on Large-Scale Digital Calculating Machinery at the Harvard computation Laboratory, Professor Samuel H. Caldwell of Massachusetts Institute of Technology spoke of the need for an association of those interested in computing machinery, and of the need for communication between them. After making some inquiries during May and June, we believe there is ample interest to start an informal association of many of those interested in the new machinery for computing and reasoning. Since there has to be a beginning, we are acting as a temporary committee to start such an association.
            </h3>
            <div className='button1'>
              <a
                href="https://sigai.acm.org/main/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore more
              </a>
            </div>
          </div>

        </div>
      </div>

      <div className='bd'>

        {/* --- ENHANCED SECTION TITLE: LEADERSHIP --- */}
        <m.div
          className="section-title"
          variants={fadeIn("up", 0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.7 }}
        >
          <h4>MEET SIST SIGAI ({selectedYear})</h4>
        </m.div>

        <m.div
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.15 }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          className="grid-container leadership-grid"
        >
          {getLeadershipData().map((member) => (
            <MemberCard key={member.id} member={member} isLarge />
          ))}
        </m.div>

        {/* --- ENHANCED SECTION TITLE: CORE TEAM --- */}
        <div className='section-title'>
          <h4>OUR CORE UNIT ({selectedYear})</h4>
        </div>
        <div className='grid-container'>
          {getCoreTeamData().map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>

        {/* --- ENHANCED SECTION TITLE: FACULTY CONVENER --- */}
        <div className='section-title'>
          <h4>FACULTY CONVENER ({selectedYear})</h4>
        </div>
        <div className='grid-container'>
          {getFacultyData().map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>

        {/* --- ENHANCED SECTION TITLE: FACULTY COORDINATORS --- */}
        <div className='section-title'>
          <h4>FACULTY COORDINATORS ({selectedYear})</h4>
        </div>
        <div className='grid-container'>
          {getFacultyCoordinatorsData().map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>

        {/* --- ENHANCED SECTION TITLE: UNITS --- */}
        <div className='section-title'>
          <h4>OUR UNITS ({selectedYear})</h4>
        </div>

        <div className="dropdown-container">
          <label htmlFor="unit-select" style={{ fontWeight: 'bold', color: 'white' }}>Select Unit: </label>
          <select id="unit-select" onChange={handleDropdownChange1} value={selectedUnit}>
            <option value="volunteers">Volunteers Unit</option>
            <option value="media">Media Unit</option>
            <option value="research">Research Unit</option>
          </select>
        </div>

        <div className='grid-container'>
          {getCardsData().length > 0 ? (
            getCardsData().map((member) => (
              <MemberCard key={member.id} member={member} />
            ))
          ) : (
            <div style={{ color: 'white', textAlign: 'center', width: '100%' }}>
              No members found for this unit in {selectedYear}
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default About;