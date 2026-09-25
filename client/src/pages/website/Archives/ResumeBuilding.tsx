import { motion as m } from "framer-motion";
import { fadeIn } from '../../../components/transitions';

import rd1 from '../../../assets/Archives/ResumeBuilding/rd1.jpeg';
import rd2 from '../../../assets/Archives/ResumeBuilding/rd2.jpeg';
import rd3 from '../../../assets/Archives/ResumeBuilding/rd3.jpeg';
import rd4 from '../../../assets/Archives/ResumeBuilding/rd4.jpeg';
import rd5 from '../../../assets/Archives/ResumeBuilding/rd5.jpeg';
import rdbg from "../../../assets/Archives/ResumeBuilding/rdbg.jpg"

const ResumeBuilding = () => {
    const images = [rd1, rd2, rd3, rd4, rd5];
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
          background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${rdbg});
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

        @keyframes scroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(calc(-630px * 10)); }
        }

        @media (max-width: 900px) {
            .marquee-item { width: 350px; height: 280px; }
            .marquee-container { height: 280px; }
            @keyframes scroll {
                0%   { transform: translateX(0); }
                100% { transform: translateX(calc(-380px * 10)); }
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
                    Resume Building
                </m.h1>
            </div>

            {/* INTRO */}
            <m.div variants={fadeIn("up", 0.2)} initial="hidden" animate="show">
                <p className="content-text">
                    Resume Building was a practical workshop designed to help students create professional and impactful resumes for academic and career opportunities. The session introduced participants to resume-writing fundamentals, recruiter expectations, <strong>ATS optimization</strong>, and the differences between a CV and a resume. Through hands-on guidance using <strong>Overleaf</strong> and resume templates, students learned how to effectively present their skills, projects, achievements, and qualifications in a professional format.
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
                            <img src={img} alt={`Resume Building ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

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
                    The session began with an introduction to the importance of resume building and its role in creating a strong first impression on recruiters. Participants were guided on how a well-structured resume can significantly influence internship, placement, and higher education opportunities. The speakers explained the purpose of a resume and highlighted its importance as a professional document that effectively showcases a candidate's qualifications, skills, and achievements. Students actively engaged in the discussion and gained a clear understanding of the value of presenting information professionally.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Following the introduction, participants were introduced to <strong>Overleaf</strong> and guided through the process of creating professional resumes using structured templates. <strong>Ms. Lakshana S</strong> conducted a hands-on demonstration that familiarized students with the platform and simplified the resume-building process. Students actively followed the step-by-step instructions and learned how to organize their information effectively while maintaining a clean and professional format. The practical approach enabled participants to gain confidence in creating resumes independently.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    One of the major highlights of the session was the discussion on recruiter expectations and resume evaluation criteria. Participants learned about the key differences between a <strong>CV and a resume</strong> and gained valuable insights into the elements that organizations commonly look for in candidates. The speakers emphasized the importance of showcasing relevant skills, projects, certifications, academic achievements, and extracurricular activities in a concise and impactful manner. Students also learned about <strong>Applicant Tracking Systems (ATS)</strong> and the significance of optimizing resumes to improve visibility during recruitment processes.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    The workshop further encouraged students to critically assess their own profiles and identify areas for improvement. Through hands-on practice, participants applied the concepts learned during the session and developed professional resumes tailored to future opportunities. The interactive format allowed students to clarify doubts and receive practical guidance throughout the workshop.
                </m.p>

                <m.p
                    className="content-text"
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    Overall, <strong>Resume Building</strong> was a highly informative and engaging session that enhanced students' understanding of professional resume creation, improved their confidence in presenting qualifications effectively, and prepared them for future academic, internship, and placement opportunities with greater readiness and success.
                </m.p>
            </div>
        </div>
    );
};

export default ResumeBuilding;
