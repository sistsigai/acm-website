import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion as m } from "framer-motion";
import Tilt from 'react-vanilla-tilt';
import { useLocation } from 'react-router-dom';
import { fadeIn } from '../../utils/animations';
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";

// --- LOCAL IMAGES (Only for non-member content) ---
import { getMembers, type Member } from '../../services/website/aboutService';
import CustomSelect from '../../components/Common/CustomSelect';

const UNIT_OPTIONS = [
  { value: "volunteers", label: "Volunteers Unit" },
  { value: "media", label: "Media Unit" },
  { value: "research", label: "Research Unit" },
];

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

// --- HELPER SORT FUNCTION ---
const sortOldestFirst = (a: Member, b: Member) => {
  const aTime = parseInt(a._id.substring(0, 8), 16) * 1000;
  const bTime = parseInt(b._id.substring(0, 8), 16) * 1000;
  return aTime - bTime;
};

// --- REUSABLE CARD COMPONENT (Memoized outside to prevent unmounting/re-animating on state changes) ---
const MemberCard = React.memo(({ member, isLarge = false }: { member: FrontendMember; isLarge?: boolean }) => {
  return (
    <m.div
      variants={fadeIn("up", 0.15)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.2 }}
    >
      <Tilt
        id="tilt-card"
        options={{ scale: 1.05, speed: 1000, max: 15 }}
        style={{
          background: "transparent",
          padding: 0,
          margin: 0,
          borderRadius: 0,
          border: "none",
          boxShadow: "none",
          width: "auto",
        }}
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
                  aria-label={social.type}
                >
                  {social.type === "instagram" && <FaInstagram />}
                  {social.type === "linkedin" && <FaLinkedin />}
                  {social.type === "facebook" && <FaFacebook />}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Tilt>
    </m.div>
  );
});

const About: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<string>('volunteers');
  const location = useLocation();
  const [selectedYear, setSelectedYear] = useState<string>('2025-2026');
  const [members, setMembers] = useState<Member[]>([]);

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

  const filterMembers = useCallback((
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
  }, [members]);

  const getMembersByUnit = useCallback((unit: string): FrontendMember[] => {
    const keywords: Record<string, string[]> = {
      volunteers: ['volunteer'],
      media: ['media'],
      research: ['research'],
    };

    return filterMembers(selectedYear, keywords[unit] || ['volunteer'], true);
  }, [selectedYear, filterMembers]);

  const getLeadershipPriority = (designation: string): number => {
    const d = designation.toLowerCase();
    if (d.includes("vice chairperson")) return 2;
    if (d.includes("chairperson")) return 1;
    if (d.includes("treasurer")) return 3;
    if (d.includes("secretary")) return 4;
    return 99; // fallback
  };

  const leadershipData = useMemo(() => {
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
  }, [members, selectedYear, filterMembers]);

  const coreTeamData = useMemo(() => {
    return filterMembers(selectedYear, ['core team'], true);
  }, [members, selectedYear, filterMembers]);

  const facultyData = useMemo(() => {
    return filterMembers(selectedYear, ['hod', 'faculty convener'], true);
  }, [members, selectedYear, filterMembers]);

  const facultyCoordinatorsData = useMemo(() => {
    return filterMembers(
      selectedYear,
      ['associate professor', 'faculty coordinator'],
      true
    );
  }, [members, selectedYear, filterMembers]);

  const unitCardsData = useMemo(() => {
    return getMembersByUnit(selectedUnit);
  }, [selectedUnit, getMembersByUnit]);

  return (
    <>
      <div className='about1' id='about'>
        {/* ENHANCED MAIN TITLE */}
        <m.h1
          className="text-gradient"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          EXPLORE ACM SIGAI!!
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
          {leadershipData.map((member) => (
            <MemberCard key={member.id} member={member} isLarge />
          ))}
        </m.div>

        {/* --- ENHANCED SECTION TITLE: CORE TEAM --- */}
        <div className='section-title'>
          <h4>OUR CORE UNIT ({selectedYear})</h4>
        </div>
        <div className='grid-container'>
          {coreTeamData.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>

        {/* --- ENHANCED SECTION TITLE: FACULTY CONVENER --- */}
        <div className='section-title'>
          <h4>FACULTY CONVENER ({selectedYear})</h4>
        </div>
        <div className='grid-container'>
          {facultyData.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>

        {/* --- ENHANCED SECTION TITLE: FACULTY COORDINATORS --- */}
        <div className='section-title'>
          <h4>FACULTY COORDINATORS ({selectedYear})</h4>
        </div>
        <div className='grid-container'>
          {facultyCoordinatorsData.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>

        {/* --- ENHANCED SECTION TITLE: UNITS --- */}
        <div className='section-title'>
          <h4>OUR UNITS ({selectedYear})</h4>
        </div>

        <div className="dropdown-container">
          <label style={{ fontWeight: 'bold', color: 'white', whiteSpace: 'nowrap' }}>Select Unit: </label>
          <div style={{ width: '220px' }}>
            <CustomSelect
              value={selectedUnit}
              options={UNIT_OPTIONS}
              onChange={setSelectedUnit}
              icon="bi-people"
              label="Select Unit"
            />
          </div>
        </div>

        <div className='grid-container'>
          {unitCardsData.length > 0 ? (
            unitCardsData.map((member: FrontendMember) => (
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