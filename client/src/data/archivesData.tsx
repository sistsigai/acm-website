import React from "react";
import { motion as m } from "framer-motion";
import { fadeIn } from "../utils/animations";

import ev_agileengineering_ae1 from '../assets/Archives/AgileEngineering/ae1.jpeg';
import ev_agileengineering_ae2 from '../assets/Archives/AgileEngineering/ae2.jpeg';
import ev_agileengineering_ae3 from '../assets/Archives/AgileEngineering/ae3.jpeg';
import ev_agileengineering_ae4 from '../assets/Archives/AgileEngineering/ae4.jpeg';
import ev_agileengineering_ae5 from '../assets/Archives/AgileEngineering/ae5.jpeg';
import ev_agileengineering_aebg from '../assets/Archives/AgileEngineering/aebg.jpg';
import ev_azure_BASHEER from '../assets/Archives/Azure/BASHEER.jpg';
import ev_azure_log from '../assets/Archives/Azure/w5.jpg';
import ev_azure_id2 from '../assets/Archives/Azure/w7.jpg';
import ev_azure_grp1 from '../assets/Archives/Azure/w8.jpg';
import ev_azure_grp2 from '../assets/Archives/Azure/w9.jpg';
import ev_azure_vai from '../assets/Archives/Azure/w1.jpg';
import ev_azure_sq from '../assets/Archives/Azure/w6.jpg';
import ev_azure_mani from '../assets/Archives/Azure/w3.jpg';
import ev_azure_adi from '../assets/Archives/Azure/w4.jpg';
import ev_azure_sat from '../assets/Archives/Azure/w2.jpg';
import ev_azure_bgImage from '../assets/Archives/Azure/background.jpg';
import ev_careercompass_cc1 from '../assets/Archives/CareerCompass/cc1.jpeg';
import ev_careercompass_cc2 from '../assets/Archives/CareerCompass/cc2.jpeg';
import ev_careercompass_cc3 from '../assets/Archives/CareerCompass/cc3.jpeg';
import ev_careercompass_cc4 from '../assets/Archives/CareerCompass/cc4.jpeg';
import ev_careercompass_cc5 from '../assets/Archives/CareerCompass/cc5.jpeg';
import ev_careercompass_cc6 from '../assets/Archives/CareerCompass/cc6.jpeg';
import ev_careercompass_ccbg from '../assets/Archives/CareerCompass/ccbg.jpg';
import ev_cognibot_c1 from '../assets/Archives/Cognibot/c1.jpeg';
import ev_cognibot_c2 from '../assets/Archives/Cognibot/c2.jpeg';
import ev_cognibot_c3 from '../assets/Archives/Cognibot/c3.jpeg';
import ev_cognibot_c4 from '../assets/Archives/Cognibot/c4.jpeg';
import ev_cognibot_c5 from '../assets/Archives/Cognibot/c5.jpeg';
import ev_cognibot_c6 from '../assets/Archives/Cognibot/c6.jpeg';
import ev_cognibot_cbg from '../assets/Archives/Cognibot/cbg.jpg';
import ev_cognibot_AjayKumar from '../assets/Archives/Cognibot/AjayKumar.jpeg';
import ev_cybersprint_cs1 from '../assets/Archives/CyberSprint/cs1.jpeg';
import ev_cybersprint_cs2 from '../assets/Archives/CyberSprint/cs2.jpeg';
import ev_cybersprint_cs3 from '../assets/Archives/CyberSprint/cs3.jpeg';
import ev_cybersprint_cs4 from '../assets/Archives/CyberSprint/cs4.jpeg';
import ev_cybersprint_cs5 from '../assets/Archives/CyberSprint/cs5.jpeg';
import ev_cybersprint_csbg from '../assets/Archives/CyberSprint/csbg.jpg';
import ev_digiart_spiderman from '../assets/Archives/Digiart/spiderman.jpg';
import ev_digiart_winner from '../assets/Archives/Digiart/winner.jpg';
import ev_digiart_grpimg from '../assets/Archives/Digiart/grpimg.jpg';
import ev_digiart_digiBg from '../assets/Archives/Digiart/background.jpg';
import ev_genai_g1 from '../assets/Archives/Genai/G1.jpg';
import ev_genai_g2 from '../assets/Archives/Genai/G2.jpg';
import ev_genai_g3 from '../assets/Archives/Genai/G3.jpg';
import ev_genai_g4 from '../assets/Archives/Genai/G4.jpg';
import ev_genai_g5 from '../assets/Archives/Genai/G5.jpg';
import ev_genai_g6 from '../assets/Archives/Genai/G6.jpg';
import ev_genai_g7 from '../assets/Archives/Genai/G7.jpg';
import ev_genai_g8 from '../assets/Archives/Genai/G8.jpg';
import ev_genai_g9 from '../assets/Archives/Genai/G9.jpg';
import ev_genai_harsha from '../assets/Archives/Genai/HARSHA.jpg';
import ev_genai_kishore from '../assets/Archives/Genai/kishore.jpg';
import ev_genai_genBg from '../assets/Archives/Genai/background.webp';
import ev_gitready_gi1 from '../assets/Archives/Gitready/gi1.jpeg';
import ev_gitready_gi2 from '../assets/Archives/Gitready/gi2.jpeg';
import ev_gitready_gi3 from '../assets/Archives/Gitready/gi3.jpeg';
import ev_gitready_gi4 from '../assets/Archives/Gitready/gi4.jpeg';
import ev_gitready_gi5 from '../assets/Archives/Gitready/gi5.jpeg';
import ev_gitready_gi6 from '../assets/Archives/Gitready/gi6.jpeg';
import ev_gitready_gibg from '../assets/Archives/Gitready/gibg.jpg';
import ev_harmonix_h1 from '../assets/Archives/Harmonix/h1.jpg';
import ev_harmonix_h2 from '../assets/Archives/Harmonix/h2.jpg';
import ev_harmonix_h3 from '../assets/Archives/Harmonix/h3.jpg';
import ev_harmonix_h4 from '../assets/Archives/Harmonix/h4.jpg';
import ev_harmonix_h5 from '../assets/Archives/Harmonix/h5.jpg';
import ev_harmonix_h6 from '../assets/Archives/Harmonix/h6.jpg';
import ev_harmonix_h7 from '../assets/Archives/Harmonix/h7.jpg';
import ev_harmonix_h8 from '../assets/Archives/Harmonix/h8.jpg';
import ev_harmonix_h9 from '../assets/Archives/Harmonix/h9.jpg';
import ev_harmonix_hbg from '../assets/Archives/Harmonix/hbg.jpg';
import ev_hellojava_hj1 from '../assets/Archives/hellojava/hj1.jpg';
import ev_hellojava_hj2 from '../assets/Archives/hellojava/hj2.jpg';
import ev_hellojava_hj3 from '../assets/Archives/hellojava/hj3.jpg';
import ev_hellojava_hj4 from '../assets/Archives/hellojava/hj4.jpg';
import ev_hellojava_hj5 from '../assets/Archives/hellojava/hj5.jpg';
import ev_hellojava_hj6 from '../assets/Archives/hellojava/hj6.jpg';
import ev_hellojava_hj7 from '../assets/Archives/hellojava/hj7.jpg';
import ev_hellojava_hj8 from '../assets/Archives/hellojava/hj8.jpg';
import ev_hellojava_hj9 from '../assets/Archives/hellojava/hj9.jpg';
import ev_hellojava_hj10 from '../assets/Archives/hellojava/hj10.jpg';
import ev_hellojava_hj11 from '../assets/Archives/hellojava/hj11.jpg';
import ev_hellojava_hjbg from '../assets/Archives/hellojava/hjbg.jpg';
import ev_ideatolaunch_itl1 from '../assets/Archives/ideatolaunch/itl1.jpg';
import ev_ideatolaunch_itl2 from '../assets/Archives/ideatolaunch/itl2.jpg';
import ev_ideatolaunch_itl3 from '../assets/Archives/ideatolaunch/itl3.jpg';
import ev_ideatolaunch_itl4 from '../assets/Archives/ideatolaunch/itl4.jpg';
import ev_ideatolaunch_itl5 from '../assets/Archives/ideatolaunch/itl5.jpg';
import ev_ideatolaunch_itl6 from '../assets/Archives/ideatolaunch/itl6.jpg';
import ev_ideatolaunch_itl7 from '../assets/Archives/ideatolaunch/itl7.jpg';
import ev_ideatolaunch_itl8 from '../assets/Archives/ideatolaunch/itl8.jpg';
import ev_ideatolaunch_itlbg from '../assets/Archives/ideatolaunch/itlbg.jpg';
import ev_inaugural_inauguralchiefguest from '../assets/Archives/Inaugural/inauguralchiefguest.jpg';
import ev_inaugural_logoReveal from '../assets/Archives/Inaugural/logoReveal.jpg';
import ev_inaugural_img1 from '../assets/Archives/Inaugural/img1.jpg';
import ev_inaugural_grpimg from '../assets/Archives/Inaugural/grpimg.jpg';
import ev_inaugural_sigaigrp from '../assets/Archives/Inaugural/sigaigrp.jpg';
import ev_inaugural_speech1 from '../assets/Archives/Inaugural/speech1.jpg';
import ev_inaugural_img2 from '../assets/Archives/Inaugural/img2.jpg';
import ev_inaugural_img3 from '../assets/Archives/Inaugural/img3.jpg';
import ev_inaugural_img4 from '../assets/Archives/Inaugural/img4.jpg';
import ev_inaugural_bgImage from '../assets/Archives/Inaugural/background.jpg';
import ev_insightx_insi1 from '../assets/Archives/Insightx/insi1.jpg';
import ev_insightx_insi2 from '../assets/Archives/Insightx/insi2.jpg';
import ev_insightx_insi3 from '../assets/Archives/Insightx/insi3.jpg';
import ev_insightx_insi4 from '../assets/Archives/Insightx/insi4.jpg';
import ev_insightx_insi5 from '../assets/Archives/Insightx/insi5.jpg';
import ev_insightx_insi6 from '../assets/Archives/Insightx/insi6.jpg';
import ev_insightx_insi7 from '../assets/Archives/Insightx/insi7.jpg';
import ev_insightx_insi8 from '../assets/Archives/Insightx/insi8.jpg';
import ev_insightx_insi9 from '../assets/Archives/Insightx/insi9.jpg';
import ev_insightx_insi10 from '../assets/Archives/Insightx/insi10.jpg';
import ev_insightx_insightxBg from '../assets/Archives/Insightx/insightxbg.jpg';
import ev_linkedin_gcwl1 from '../assets/Archives/Linkedin/gcwl1.jpg';
import ev_linkedin_gcwl2 from '../assets/Archives/Linkedin/gcwl2.jpg';
import ev_linkedin_gcwl3 from '../assets/Archives/Linkedin/gcwl3.jpg';
import ev_linkedin_gcwl4 from '../assets/Archives/Linkedin/gcwl4.jpg';
import ev_linkedin_gcwl5 from '../assets/Archives/Linkedin/gcwl5.jpg';
import ev_linkedin_gcwl6 from '../assets/Archives/Linkedin/gcwl6.jpg';
import ev_linkedin_gcwl7 from '../assets/Archives/Linkedin/gcwl7.jpg';
import ev_linkedin_gcwl8 from '../assets/Archives/Linkedin/gcwl8.jpg';
import ev_linkedin_gcwl9 from '../assets/Archives/Linkedin/gcwl9.jpg';
import ev_linkedin_gcwl10 from '../assets/Archives/Linkedin/gcwl10.jpg';
import ev_linkedin_gcwl11 from '../assets/Archives/Linkedin/gcwl11.jpg';
import ev_linkedin_gcwlbg from '../assets/Archives/Linkedin/gcwlbg.jpg';
import ev_mindauction_ma1 from '../assets/Archives/MindAuction/ma1.jpeg';
import ev_mindauction_ma2 from '../assets/Archives/MindAuction/ma2.jpeg';
import ev_mindauction_ma3 from '../assets/Archives/MindAuction/ma3.jpeg';
import ev_mindauction_ma4 from '../assets/Archives/MindAuction/ma4.jpeg';
import ev_mindauction_ma5 from '../assets/Archives/MindAuction/ma5.jpeg';
import ev_mindauction_mabg from '../assets/Archives/MindAuction/mabg.jpg';
import ev_quicktrain_qt1 from '../assets/Archives/Quicktrain/qt1.jpeg';
import ev_quicktrain_qt2 from '../assets/Archives/Quicktrain/qt2.jpeg';
import ev_quicktrain_qt3 from '../assets/Archives/Quicktrain/qt3.jpeg';
import ev_quicktrain_qt4 from '../assets/Archives/Quicktrain/qt4.jpeg';
import ev_quicktrain_qt5 from '../assets/Archives/Quicktrain/qt5.jpeg';
import ev_quicktrain_qt6 from '../assets/Archives/Quicktrain/qt6.jpeg';
import ev_quicktrain_qtbg from '../assets/Archives/Quicktrain/qtbg.jpg';
import ev_resumebuilding_rd1 from '../assets/Archives/ResumeBuilding/rd1.jpeg';
import ev_resumebuilding_rd2 from '../assets/Archives/ResumeBuilding/rd2.jpeg';
import ev_resumebuilding_rd3 from '../assets/Archives/ResumeBuilding/rd3.jpeg';
import ev_resumebuilding_rd4 from '../assets/Archives/ResumeBuilding/rd4.jpeg';
import ev_resumebuilding_rd5 from '../assets/Archives/ResumeBuilding/rd5.jpeg';
import ev_resumebuilding_rdbg from '../assets/Archives/ResumeBuilding/rdbg.jpg';
import ev_spaceday_s1 from '../assets/Archives/Spaceday/S1.jpg';
import ev_spaceday_s2 from '../assets/Archives/Spaceday/S2.jpg';
import ev_spaceday_s3 from '../assets/Archives/Spaceday/S3.jpg';
import ev_spaceday_s5 from '../assets/Archives/Spaceday/S5.jpg';
import ev_spaceday_s6 from '../assets/Archives/Spaceday/S6.jpg';
import ev_spaceday_s7 from '../assets/Archives/Spaceday/S7.jpg';
import ev_spaceday_s8 from '../assets/Archives/Spaceday/S8.jpg';
import ev_spaceday_s9 from '../assets/Archives/Spaceday/S9.jpg';
import ev_spaceday_s10 from '../assets/Archives/Spaceday/S10.jpg';
import ev_spaceday_s11 from '../assets/Archives/Spaceday/S11.jpg';
import ev_spaceday_s12 from '../assets/Archives/Spaceday/S12.jpg';
import ev_spaceday_s13 from '../assets/Archives/Spaceday/S13.jpg';
import ev_spaceday_s14 from '../assets/Archives/Spaceday/S14.jpg';
import ev_spaceday_guest from '../assets/Archives/Spaceday/guest.jpg';
import ev_spaceday_spaceBg from '../assets/Archives/Spaceday/background.jpg';
import ev_spacez_s1 from '../assets/Archives/SpaceZ/s1.jpeg';
import ev_spacez_s2 from '../assets/Archives/SpaceZ/s2.jpeg';
import ev_spacez_s3 from '../assets/Archives/SpaceZ/s3.jpeg';
import ev_spacez_s4 from '../assets/Archives/SpaceZ/s4.jpeg';
import ev_spacez_s5 from '../assets/Archives/SpaceZ/s5.jpeg';
import ev_spacez_sbg from '../assets/Archives/SpaceZ/sbg.avif';
import ev_startupxcel_sx1 from '../assets/Archives/StartupXcel/sx1.jpeg';
import ev_startupxcel_sx2 from '../assets/Archives/StartupXcel/sx2.jpeg';
import ev_startupxcel_sx3 from '../assets/Archives/StartupXcel/sx3.jpeg';
import ev_startupxcel_sx4 from '../assets/Archives/StartupXcel/sx4.jpeg';
import ev_startupxcel_sxbg from '../assets/Archives/StartupXcel/sxbg.jpg';
import ev_synergy_fre1 from '../assets/Archives/Synergy/FRE1.avif';
import ev_synergy_fre2 from '../assets/Archives/Synergy/FRE2.avif';
import ev_synergy_fre3 from '../assets/Archives/Synergy/FRE3.avif';
import ev_synergy_fre4 from '../assets/Archives/Synergy/FRE4.jpg';
import ev_synergy_fre5 from '../assets/Archives/Synergy/FRE5.avif';
import ev_synergy_fre6 from '../assets/Archives/Synergy/FRE6.avif';
import ev_synergy_fre7 from '../assets/Archives/Synergy/FRE7.avif';
import ev_synergy_fre8 from '../assets/Archives/Synergy/FRE8.avif';
import ev_synergy_fre9 from '../assets/Archives/Synergy/FRE9.avif';
import ev_synergy_fre10 from '../assets/Archives/Synergy/FRE10.jpg';
import ev_synergy_fre11 from '../assets/Archives/Synergy/FRE11.avif';
import ev_synergy_synergyBg from '../assets/Archives/Synergy/frebg.jpg';
import ev_techmemeathon_t1 from '../assets/Archives/Techmemeathon/t1.jpeg';
import ev_techmemeathon_t2 from '../assets/Archives/Techmemeathon/t2.jpeg';
import ev_techmemeathon_t3 from '../assets/Archives/Techmemeathon/t3.jpeg';
import ev_techmemeathon_t4 from '../assets/Archives/Techmemeathon/t4.jpeg';
import ev_techmemeathon_tbg from '../assets/Archives/Techmemeathon/tbg.jpg';
import ev_technopoly_t1 from '../assets/Archives/Technopoly/t1.jpeg';
import ev_technopoly_t2 from '../assets/Archives/Technopoly/t2.jpeg';
import ev_technopoly_t3 from '../assets/Archives/Technopoly/t3.jpeg';
import ev_technopoly_t4 from '../assets/Archives/Technopoly/t4.jpeg';
import ev_technopoly_t5 from '../assets/Archives/Technopoly/t5.jpeg';
import ev_technopoly_tbg from '../assets/Archives/Technopoly/tbg.webp';
import ev_techuno_tuno1 from '../assets/Archives/TechUNO/tuno1.jpeg';
import ev_techuno_tuno2 from '../assets/Archives/TechUNO/tuno2.jpeg';
import ev_techuno_tuno3 from '../assets/Archives/TechUNO/tuno3.jpeg';
import ev_techuno_tuno4 from '../assets/Archives/TechUNO/tuno4.jpeg';
import ev_techuno_tuno5 from '../assets/Archives/TechUNO/tuno5.jpeg';
import ev_techuno_tuno6 from '../assets/Archives/TechUNO/tuno6.jpeg';
import ev_techuno_tunobg from '../assets/Archives/TechUNO/tunobg.jpg';
import ev_thinktankers_tt1 from '../assets/Archives/ThinkTankers/tt1.jpeg';
import ev_thinktankers_tt2 from '../assets/Archives/ThinkTankers/tt2.jpeg';
import ev_thinktankers_tt3 from '../assets/Archives/ThinkTankers/tt3.jpeg';
import ev_thinktankers_tt4 from '../assets/Archives/ThinkTankers/tt4.jpeg';
import ev_thinktankers_tt5 from '../assets/Archives/ThinkTankers/tt5.jpeg';
import ev_thinktankers_tt6 from '../assets/Archives/ThinkTankers/tt6.jpeg';
import ev_thinktankers_tt7 from '../assets/Archives/ThinkTankers/tt7.jpeg';
import ev_thinktankers_tt8 from '../assets/Archives/ThinkTankers/tt8.jpeg';
import ev_thinktankers_tt9 from '../assets/Archives/ThinkTankers/tt9.jpeg';
import ev_thinktankers_tt10 from '../assets/Archives/ThinkTankers/tt10.jpeg';
import ev_thinktankers_tt11 from '../assets/Archives/ThinkTankers/tt11.jpeg';
import ev_thinktankers_ttbg from '../assets/Archives/ThinkTankers/ttbg.jpg';

export interface ArchiveEventConfig {
    slug: string;
    bgImage?: string;
    render: () => React.JSX.Element;
}

const Archive_agileengineering = () => {
    const images = [ev_agileengineering_ae1, ev_agileengineering_ae2, ev_agileengineering_ae3, ev_agileengineering_ae4, ev_agileengineering_ae5];
    const sliderImages = [...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* TITLE */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    Agile Engineering
                </m.h1>
            </div>

            {/* INTRO */}
            <m.div variants={fadeIn("up", 0.2)} initial="hidden" animate="show">
                <p className="content-text">
                    Agile Engineering was an insightful expert talk designed to introduce students to the principles of agility, empathy, and inclusive design in technology development. Led by Mr. Sunil Kumar Suvvari, the session explored accessibility needs, user-centric engineering, and universal product design through practical examples. Participants gained valuable insights into building inclusive technological solutions and understanding the importance of accessibility in creating meaningful experiences for diverse users.
                </p>
            </m.div>

            {/* GALLERY */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`Agile Engineering ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* HIGHLIGHTS */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The session began with an insightful introduction by <strong>Mr. Sunil Kumar Suvvari</strong>, who discussed the importance of agility, empathy, and inclusion in modern engineering practices. Participants were introduced to the concept of designing technology that is accessible to people with diverse abilities and needs. The speaker emphasized that successful technological solutions should not only focus on functionality but also ensure accessibility, usability, and inclusivity for a wider audience. Students actively engaged with the discussion and gained a broader understanding of user-centric design principles.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Following the introduction, the speaker explained the core principles of inclusive design and their significance in creating universal products. Participants learned how accessibility considerations can be integrated into the development process from the initial stages of design. Through practical examples and industry insights, students understood how inclusive thinking contributes to better user experiences and improves the effectiveness of technological solutions. The session highlighted the importance of considering diverse user requirements while designing products and services.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    One of the major highlights of the event was the discussion on accessibility features and their real-world applications. The speaker demonstrated how technologies such as <strong>voice control, gesture navigation, screen readers</strong>, and other assistive tools help users overcome challenges and interact effectively with digital systems. Students gained valuable knowledge about the role of accessibility in ensuring equal access to technology and improving usability across different environments and situations.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The session also explored various types of accessibility needs, including <strong>permanent, temporary, and situational</strong> challenges. Participants learned how inclusive design benefits not only individuals with disabilities but also a broader range of users in different contexts. The interactive discussions encouraged students to think critically about accessibility and consider its importance while developing future technological innovations.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, Agile Engineering was a highly informative and engaging expert talk that successfully introduced students to inclusive design principles, accessibility practices, and user-centered engineering approaches. The session inspired participants to incorporate empathy, accessibility, and inclusivity into their future technology solutions and professional development journeys.
                </m.p>
            </div>
        </div>
    );
};

const Archive_azure = () => {
    const sliderImages = [
        ev_azure_vai, ev_azure_sat, ev_azure_mani, ev_azure_adi, ev_azure_log, ev_azure_sq, ev_azure_id2, ev_azure_grp1, ev_azure_grp2,
        ev_azure_vai, ev_azure_sat, ev_azure_mani, ev_azure_adi, ev_azure_log, ev_azure_sq, ev_azure_id2, ev_azure_grp1, ev_azure_grp2
    ];
    return (
        <div className="archive-detail-content">
            {/* --- TITLE SECTION --- */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    AZURE CASCADE
                </m.h1>

                <m.p
                    className="content-text"
                    style={{ textAlign: 'center' }}
                    variants={fadeIn("up", 0.3)}
                    initial="hidden"
                    animate="show"
                >
                    First Event. July 8th, 2024.
                </m.p>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)} initial="hidden" animate="show"
            >
                <p className="content-text">
                    We are elated to share with you that <strong>SIST ACM SIGAI Student Chapter</strong> has successfully conducted its very first event which took place on 08/07/2024 at Dental Auditorium, Sathyabama University.
                </p>
                <p className="content-text">
                    The event began with two of our core team members <strong>Ms. Vaishnavi</strong> and <strong>Ms. Vedha Varshini</strong> introducing our speaker <strong>Mr. Harun Raseed Basheer</strong>, Microsoft MVP, Specialist, Hitachi Solutions India Pvt Ltd who gracefully addressed the event.
                </p>
            </m.div>

            {/* --- MARQUEE GALLERY --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`Azure event photo ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- GUEST OF HONOUR --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                GUEST OF <span className="highlight-blue">HONOUR</span>
            </m.h2>

            <m.div
                className="guest-container"
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
            >
                <div className="guest-card">
                    <img src={ev_azure_BASHEER} alt="Mr. Harun Raseed Basheer" />
                    <div className="card-overlay">
                        <div className="guest-info">
                            <h3>Mr. Harun Raseed Basheer<br />
                                <span style={{ fontSize: '11px', fontWeight: '300', textTransform: 'initial', color: '#ccc' }}>
                                    Microsoft MVP, Specialist, Hitachi Solutions
                                </span>
                            </h3>
                        </div>
                    </div>
                </div>
            </m.div>

            {/* --- HIGHLIGHTS TEXT --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The speaker took the lead making the session really interesting. By the end of the session, all the students in the room were familiar with the key concepts of cloud computing. The students were also informed in detail about the Microsoft Student Ambassador program and its benefits. The session has been interactive and extremely informative.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    After this session, the speaker was presented with a memento by our respected HOD, <strong>Dr. S Vigneshwari</strong> and <strong>Dr. R Sathyabama Krishna, Dr. Anubharathi.</strong>
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event was then followed by an empowering speech about mental health given by our very own treasurer of SIST ACM SIGAI Student Chapter, <strong>Ms. Deekshitha</strong>. The audience was ecstatic after listening to her motivating words and her own experiences. The students actively participated in the discussion by sharing their personal views too.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    We concluded the event by launching our SIST ACM SIGAI Student Chapter's official website. Our core team member <strong>Ms. Janllyn Avantika</strong> presented and explained all the features of the website to the audience.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall it has been an overwhelming experience and we received a positive response from the students and the dignitaries who attended the event. We are excited and are looking forward to conducting more events this way and hope we get a similar, encouraging response.
                </m.p>
            </div>
        </div>
    );
};

const Archive_careercompass = () => {
    const images = [ev_careercompass_cc1, ev_careercompass_cc2, ev_careercompass_cc3, ev_careercompass_cc4, ev_careercompass_cc5, ev_careercompass_cc6];
    const sliderImages = [...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* --- TITLE SECTION --- */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    CAREER COMPASS
                </m.h1>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)} initial="hidden" animate="show"
            >
                <p className="content-text">
                    Career Compass was an interactive guidance session designed to help students prepare for placements and future career opportunities. Led by final-year students, the session provided valuable insights into placement experiences, internship journeys, skill development, and career planning strategies. Participants actively engaged in discussions, clarified doubts, and gained practical guidance on placement readiness and decision-making. The event created an informative and motivating environment that encouraged confidence and career awareness among students.
                </p>
            </m.div>

            {/* --- MARQUEE GALLERY --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`Career Compass Highlight ${index}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- HIGHLIGHTS TEXT --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event began with an interactive guidance session led by final-year students <strong>Mr. Nagul Udhayan</strong>, <strong>Ms. Vijaya Harika Chilakapati</strong>, and <strong>Mr. Jonnalagadda Sri Harsha</strong>, who shared their personal placement experiences and internship journeys with the participants. Students actively listened as the speakers explained the challenges they faced, the strategies they followed, and the lessons they learned while preparing for placements and career opportunities. Their real-world experiences created a relatable and motivating atmosphere that encouraged participants to think seriously about their future career goals.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Following the introductory discussion, the speakers guided students on important aspects of placement preparation and career planning. Participants learned about the significance of skill development, technical knowledge, communication abilities, and consistency in achieving career success. The session also highlighted the importance of internships, project experiences, and continuous learning in building strong professional profiles. Students gained valuable insights into how they could effectively prepare themselves for placement drives and future opportunities in the technology industry.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    One of the major highlights of the event was the interactive question-and-answer session where students actively clarified doubts regarding placements, internships, resume building, interview preparation, and career decision-making. The speakers provided practical suggestions and shared useful preparation techniques based on their own experiences. The open and interactive format encouraged students to participate confidently and engage in meaningful discussions throughout the session. Participants showed great interest in understanding real placement processes and the expectations of recruiters in professional environments.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The guidance session also motivated students to develop confidence, improve problem-solving abilities, and focus on long-term career growth. The discussion emphasized the importance of balancing technical skills with communication and teamwork abilities for overall professional development. Students appreciated the practical advice and relatable experiences shared by the speakers during the session.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, Career Compass was a highly informative and motivating event that successfully guided students toward placement readiness, career awareness, and professional growth through interactive discussions, practical insights, and real-world experiences shared by senior students effectively.
                </m.p>
            </div>
        </div>
    );
};

const Archive_cognibot = () => {
    const images = [ev_cognibot_c1, ev_cognibot_c2, ev_cognibot_c3, ev_cognibot_c4, ev_cognibot_c5, ev_cognibot_c6];
    const sliderImages = [...images, ...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* TITLE */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
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
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`Cognibot event photo ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- SPEAKERS --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                OUR <span className="highlight-blue">SPEAKER</span>
            </m.h2>

            <m.div
                className="guest-container"
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
            >
                {/* Speaker 1 */}
                <div className="guest-card">
                    <img src={ev_cognibot_AjayKumar} alt="Mr. Ajay Kumar" />
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
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The session began with an insightful introduction by <strong>Mr. Ajay Kumar, CTO of Cognibot</strong>, who provided students with an overview of Machine Learning and its growing significance in modern industries. Participants were introduced to the role of Artificial Intelligence and Machine Learning in solving real-world business challenges and improving operational efficiency. The speaker explained how these technologies have evolved beyond academic concepts and are now widely adopted across various industrial sectors to drive innovation and intelligent decision-making.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Following the introduction, the session focused on the practical applications of Machine Learning in industrial environments. Students learned how organizations utilize Machine Learning models to <strong>automate repetitive tasks, optimize workflows, analyze large volumes of data</strong>, and improve productivity. Through industry-oriented examples and case studies, the speaker demonstrated how Machine Learning contributes to predictive analytics, process automation, quality control, and business intelligence. These practical insights helped participants understand the direct impact of AI-driven solutions on organizational performance and growth.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    One of the major highlights of the session was the discussion on implementing and scaling Machine Learning solutions in real-world scenarios. The speaker explained the challenges organizations face while deploying AI systems, including <strong>data quality, model accuracy, scalability</strong>, and integration with existing processes. Students gained valuable exposure to industry practices and learned how professionals approach the development and deployment of Machine Learning applications in complex environments. The discussion provided participants with a realistic understanding of the opportunities and challenges associated with industrial AI adoption.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The interactive nature of the session encouraged students to actively engage with the speaker and seek clarification on industry-related concepts. Participants explored emerging trends in Artificial Intelligence, discussed future career opportunities in Machine Learning, and gained a deeper appreciation for the importance of continuous learning in rapidly evolving technological fields. The session effectively bridged the gap between academic knowledge and industry expectations.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, <strong>COGNIBOT</strong> was a highly informative and engaging technical session that provided students with practical insights into industrial Machine Learning applications, implementation strategies, and the transformative impact of Artificial Intelligence across various sectors worldwide today.
                </m.p>
            </div>
        </div>
    );
};

const Archive_cybersprint = () => {
    const images = [ev_cybersprint_cs1, ev_cybersprint_cs2, ev_cybersprint_cs3, ev_cybersprint_cs4, ev_cybersprint_cs5];
    const sliderImages = [...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* TITLE */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    Cyber Sprint
                </m.h1>
            </div>

            {/* INTRO */}
            <m.div variants={fadeIn("up", 0.2)} initial="hidden" animate="show">
                <p className="content-text">
                    Cyber Sprint was an engaging technical competition designed to enhance <strong>cybersecurity awareness, analytical thinking, and problem-solving abilities</strong> among students. Through multiple challenge-based rounds, participants explored concepts such as <strong>cyber threats, phishing attacks, ethical hacking</strong>, and secure digital practices. The event encouraged teamwork, critical thinking, and technical learning while providing an interactive platform for students to develop a stronger understanding of cybersecurity principles and responsible online behavior.
                </p>
            </m.div>

            {/* GALLERY */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`Cyber Sprint ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* HIGHLIGHTS */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event began with an introductory round focused on <strong>cybersecurity awareness and fundamental security concepts</strong>. Participants answered questions related to cyber threats, phishing attacks, ethical hacking, online privacy, and secure digital practices. The round encouraged students to assess their existing knowledge while learning about common cybersecurity risks and preventive measures. Teams actively participated in the discussions and demonstrated enthusiasm in exploring topics that are increasingly important in today's digital world.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Following the initial round, participants advanced to a series of <strong>challenge-based activities</strong> designed to test their observation, analytical thinking, and problem-solving abilities. Students were required to identify suspicious online activities, analyze cybersecurity-related scenarios, and solve puzzles based on real-world digital security situations. The tasks encouraged participants to think critically, evaluate potential threats, and apply logical reasoning to arrive at effective solutions. The interactive nature of the activities created an engaging environment where students could learn while competing with their peers.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    One of the major highlights of the event was the <strong>scenario-based challenge round</strong>, where teams worked together to address practical cybersecurity situations and demonstrate their understanding of cyber ethics and responsible digital behavior. Participants analyzed different cases, discussed possible security concerns, and proposed appropriate solutions based on secure online practices. The round promoted teamwork, communication, and collaborative problem-solving while helping students understand the importance of ethical decision-making in cybersecurity environments.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Throughout the competition, students actively engaged in every stage of the event and displayed strong technical awareness, critical thinking, and confidence. The team-based format encouraged participants to exchange ideas, support one another, and develop a deeper understanding of cybersecurity concepts through practical application. The event successfully combined learning and competition, making the experience both educational and enjoyable for all involved.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, <strong>Cyber Sprint</strong> was a highly interactive and successful technical competition that enhanced participants' cybersecurity awareness, analytical thinking, teamwork, and problem-solving abilities. The event provided valuable exposure to digital security concepts while encouraging responsible online behavior and fostering interest in cybersecurity through engaging, challenge-based learning experiences for future professionals.
                </m.p>
            </div>
        </div>
    );
};

const Archive_digiart = () => {
    return (
        <div className="archive-detail-content">
            {/* --- TITLE SECTION --- */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    DIGITAL ART
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
                variants={fadeIn("up", 0.2)} initial="hidden" animate="show"
            >
                <p className="content-text">
                    We are thrilled to announce that the SIST ACM SIGAI Student Chapter hosted a Digital Art Competition on August 1, 2024, at the Remibai Auditorium, Sathyabama Institute of Science and Technology, Chennai. The event brought together talented students with a passion for creativity, design, and digital innovation, providing them with a platform to showcase their artistic abilities through modern digital tools.
                </p>

                <p className="content-text">
                    The competition witnessed enthusiastic participation from students across the department, each presenting unique and imaginative artworks that reflected their creativity, technical skills, and storytelling abilities. Centered around the theme of Freestyle Comics, participants explored diverse artistic styles and concepts, producing visually captivating pieces that impressed both the audience and the judges.
                </p>
            </m.div>

            {/* --- WINNER'S ARTWORK --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                WINNER'S <span className="highlight-blue">ARTWORK</span>
            </m.h2>

            <m.div
                className="image-container"
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
            >
                <img
                    src={ev_digiart_spiderman}
                    alt="Winner Artwork - Spiderman"
                    className="showcase-image"
                    style={{ width: '400px' }}
                />
            </m.div>

            {/* --- EVENT WINNER --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">WINNER</span>
            </m.h2>

            <m.div
                className="guest-container"
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
            >
                <div className="guest-card">
                    <img src={ev_digiart_winner} alt="Mr. Godwin Deepak T" />
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
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The SIST ACM SIGAI Student Chapter recently conducted an artistic "Digital Art Competition" for the students of the CSE department on August 1, 2024. It was a remarkable event where participants enthusiastically showcased their talent in digital technology through their excellent artistic skills. The theme of this exciting competition was freestyle comics, and the artist who captured the hearts of the audience with his work was <strong>Godwin Deepak T</strong>.
                </m.p>

                {/* Winners Group Photo */}
                <m.div
                    className="image-container"
                    variants={fadeIn("up", 0.3)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.2 }}
                >
                    <img
                        src={ev_digiart_grpimg}
                        alt="Digital Art Competition Winners"
                        className="showcase-image"
                        style={{ width: '800px' }}
                    />
                </m.div>
            </div>
        </div>
    );
};

const Archive_genai = () => {
    const sliderImages = [
        ev_genai_g1, ev_genai_g2, ev_genai_g3, ev_genai_g4, ev_genai_g5, ev_genai_g6, ev_genai_g7, ev_genai_g8, ev_genai_g9,
        ev_genai_g1, ev_genai_g2, ev_genai_g3, ev_genai_g4, ev_genai_g5, ev_genai_g6, ev_genai_g7, ev_genai_g8, ev_genai_g9
    ];
    return (
        <div className="archive-detail-content">
            {/* --- TITLE SECTION --- */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    DEEP DIVE INTO GEN-AI
                </m.h1>

                <m.p
                    className="content-text"
                    style={{ textAlign: 'center' }}
                    variants={fadeIn("up", 0.3)}
                    initial="hidden"
                    animate="show"
                >
                    A Collaborative Innovation. August 1st, 2024.
                </m.p>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)} initial="hidden" animate="show"
            >
                <p className="content-text">
                    We are thrilled to announce that the SIST ACM SIGAI Student Chapter hosted its first collaborative event on August 1, 2024, in the Remibai Auditorium at Sathyabama Institute of Science and Technology, Chennai. This event was organized in partnership with the School of Science and Humanities. A special thank you to <strong>Dr. Rekha Chakravarthi</strong>, Dean of the Arts and Sciences department, for facilitating the collaboration.
                </p>
            </m.div>

            {/* --- MARQUEE GALLERY --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt="Gen-AI Event Highlight" />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- SPEAKERS --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                OUR <span className="highlight-blue">SPEAKERS</span>
            </m.h2>

            <m.div
                className="guest-container"
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
            >
                {/* Speaker 1 */}
                <div className="guest-card">
                    <img src={ev_genai_harsha} alt="Mr. Jonnalagadda Sri Harsha" />
                    <div className="card-overlay">
                        <div className="guest-info">
                            <h3>Mr. Jonnalagadda Sri Harsha<br />
                                <span style={{ fontSize: '11px', fontWeight: '300', textTransform: 'initial', color: '#ccc' }}>
                                    3rd year CSE-DS
                                </span>
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Speaker 2 */}
                <div className="guest-card">
                    <img src={ev_genai_kishore} alt="Mr. Kishore Ramanan" />
                    <div className="card-overlay">
                        <div className="guest-info">
                            <h3>Mr. Kishore Ramanan<br />
                                <span style={{ fontSize: '11px', fontWeight: '300', textTransform: 'initial', color: '#ccc' }}>
                                    3rd year CSE-AIML
                                </span>
                            </h3>
                        </div>
                    </div>
                </div>
            </m.div>

            {/* --- HIGHLIGHTS TEXT --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event focused on Generative AI and was attended by an enthusiastic crowd of second-year BSc students. <strong>Ms. Janllyn Avantikha</strong>, a core unit member, started the event by introducing the speakers and providing an overview about the session.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Two of our third-year students from the CSE Data Science specialization, <strong>Sri Harsha Jonnalagadda</strong> and <strong>Kishore Ramanan</strong>, took the lead as speakers. In the first half of the event, they introduced the students to Generative AI and explained its applications in everyday life in detail. A live demonstration of generating content like text, images, and PPTs was conducted, and input prompts were taken from the audience, encouraging active participation from all students.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    In the second half of the event, a hands-on session based on the Ollama model was conducted. This was followed by a digital art competition in which all the participants showcased their extraordinary talent. The event concluded with <strong>Ms. Vaishnavi Battina</strong>, a core team member of the club, delivering a vote of thanks.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event has been lively and interactive. It was well-received by all the students and dignitaries who attended. We are extremely grateful to the core unit, volunteers and all the people who contributed in making this event a success and we are look forward to hosting more such events in the future.
                </m.p>
            </div>
        </div>
    );
};

const Archive_gitready = () => {
    const images = [ev_gitready_gi1, ev_gitready_gi2, ev_gitready_gi3, ev_gitready_gi4, ev_gitready_gi5, ev_gitready_gi6];
    const sliderImages = [...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* --- TITLE SECTION --- */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    GIT READY
                </m.h1>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)} initial="hidden" animate="show"
            >
                <p className="content-text">
                    GIT READY was an interactive hands-on workshop designed to introduce students to GitHub, version control, and collaborative development practices. Conducted as part of SIGAI’s Week 2025, the session familiarized participants with repositories, commits, branches, and open-source workflows through practical activities and demonstrations. The event encouraged teamwork, experimentation, and real-world coding practices, helping students gain confidence in managing and sharing code efficiently in professional environments today.
                </p>
            </m.div>

            {/* --- MARQUEE GALLERY --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`Git Ready Highlight ${index}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- HIGHLIGHTS TEXT --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event began with an introductory session conducted by <strong>Mr. Gorakati Teja</strong> and <strong>Mr. Jonnalagadda Sri Harsha</strong>, who introduced participants to the fundamentals of GitHub, version control systems, and collaborative software development practices. Students were familiarized with the importance of version control in professional programming environments and gained an understanding of how developers efficiently manage, track, and share code while working on projects as teams. The session created curiosity among participants and encouraged them to actively engage throughout the workshop.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Following the introduction, the speakers demonstrated key GitHub concepts such as repositories, commits, branches, cloning, and pushing code changes. Participants learned how these features are used in real-world software development workflows to maintain project organization and collaboration. The hands-on explanations made the learning process simple and interactive, allowing students to understand technical concepts through practical implementation rather than theoretical discussion alone. Students enthusiastically followed the demonstrations and explored the platform features during the session.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    One of the major highlights of the workshop was the interactive practical activities conducted to help students gain real-time experience with GitHub workflows. Participants worked together to create repositories, make commits, manage branches, and collaborate on shared projects. The activities encouraged teamwork, communication, and problem-solving while giving students confidence in using GitHub for academic and professional projects. The collaborative environment helped participants understand how developers contribute to projects efficiently in real-world scenarios.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The workshop also introduced students to open-source development practices and emphasized the importance of collaboration in modern software engineering. Participants gained valuable exposure to practical development workflows and learned how GitHub supports project management, contribution tracking, and code sharing among teams. Students actively interacted with the speakers, clarified doubts, and explored various GitHub tools and features throughout the session.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, GIT READY was a successful and highly engaging workshop that provided students with practical knowledge, collaborative experience, and confidence in using GitHub and version control systems effectively for future software development opportunities.
                </m.p>
            </div>
        </div>
    );
};

const Archive_harmonix = () => {
    const images = [ev_harmonix_h1, ev_harmonix_h2, ev_harmonix_h3, ev_harmonix_h4, ev_harmonix_h5, ev_harmonix_h6,
        ev_harmonix_h7, ev_harmonix_h8, ev_harmonix_h9];
    const sliderImages = [...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* --- TITLE SECTION --- */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    Harmonix
                </m.h1>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)} initial="hidden" animate="show"
            >
                <p className="content-text">
                    Harmonix was an innovative seminar-based competition designed to introduce students to the world of AI-generated music using the Suno application. The event combined informative sessions, live demonstrations, and hands-on activities to help participants understand how artificial intelligence can transform text prompts into complete musical tracks. Students actively explored creativity through AI-generated music creation, making the event an engaging and interactive experience that highlighted AI's growing influence in creative and artistic fields.
                </p>
            </m.div>

            {/* --- MARQUEE GALLERY --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`Synergy Highlight ${index}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- HIGHLIGHTS TEXT --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event began with an informative seminar session that introduced students to the concept of AI-generated music and its growing impact on creative industries. Participants were given an overview of the Suno application and learned how artificial intelligence can transform simple text prompts into complete musical compositions. The session highlighted the role of AI in modern content creation and demonstrated how technology can support creativity, innovation, and artistic expression in unique ways. Students actively engaged throughout the presentation and showed great curiosity in exploring the capabilities of AI-powered music generation.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Following the introductory session, a live demonstration was conducted to showcase the practical use of the Suno application. Participants observed how prompts could be converted into songs with lyrics, melodies, and musical arrangements within a short period of time. The demonstration helped students understand the technical process behind AI-generated music while also encouraging them to think creatively about using technology in artistic fields. The interactive explanation created excitement among participants and motivated them to experiment with their own musical ideas.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    One of the major highlights of the event was the hands-on activity conducted during the afternoon session, where students created their own AI-generated tracks using the Suno application. Participants enthusiastically experimented with different prompts, themes, and musical styles to develop unique compositions. The activity encouraged creativity, innovation, and independent thinking while allowing students to practically apply the concepts introduced earlier in the seminar. Students actively collaborated, exchanged ideas, and explored different creative approaches throughout the competition.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    At the conclusion of the event, the best AI-generated tracks were evaluated and the top three entries were selected based on creativity, originality, and overall presentation. Certificates were awarded to the winners in recognition of their efforts and performance. Overall, Harmonix was a successful and engaging event that combined technology, creativity, and practical learning through interactive participation and innovative musical experimentation.
                </m.p>
            </div>
        </div>
    );
};

const Archive_hellojava = () => {
    const images = [ev_hellojava_hj1, ev_hellojava_hj2, ev_hellojava_hj3, ev_hellojava_hj4, ev_hellojava_hj5, ev_hellojava_hj6,
        ev_hellojava_hj7, ev_hellojava_hj8, ev_hellojava_hj9, ev_hellojava_hj10, ev_hellojava_hj11];
    const sliderImages = [...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* --- TITLE SECTION --- */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    Hello Java'25
                </m.h1>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)} initial="hidden" animate="show"
            >
                <p className="content-text">
                    Hello Java’25 was an engaging two-day workshop designed for second-year students to strengthen their understanding of Java programming. The event combined interactive technical sessions, creative activities, and placement-oriented coding challenges to create a collaborative learning environment. Students explored fundamental and advanced Java concepts, participated in a Java Meme Contest, and enhanced their problem-solving skills through coding activities, gaining confidence and practical knowledge for future academic and career opportunities.
                </p>
            </m.div>

            {/* --- MARQUEE GALLERY --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`Synergy Highlight ${index}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- HIGHLIGHTS TEXT --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event began with interactive Java learning sessions conducted for second-year students in their respective classrooms. The sessions focused on strengthening students' programming fundamentals while also introducing them to advanced Java concepts. Participants actively engaged in hands-on learning activities, which helped them gain a deeper understanding of object-oriented programming, problem-solving techniques, and practical applications of Java.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    To make the workshop more engaging and enjoyable, a <strong>"Java Meme Contest"</strong> was conducted where students creatively expressed programming concepts through humor and relatable content. The activity encouraged participants to think creatively while connecting technical concepts with fun and interactive ideas. Students enthusiastically participated and showcased their creativity through innovative meme designs.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Following this, a placement-oriented mini coding challenge was organized to help students test their technical and logical thinking abilities. Participants solved coding problems designed to enhance their problem-solving skills and prepare them for future placement opportunities. The challenge created a competitive yet motivating environment where students were able to apply the concepts they had learned during the sessions.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Throughout the two-day workshop, students actively interacted with coordinators and peers, making the learning process collaborative and engaging. The combination of technical learning, creative activities, and coding practice ensured that participants not only improved their Java knowledge but also gained confidence in applying programming concepts effectively.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, Hello Java'25 was a successful and enriching workshop that provided students with a strong foundation in Java programming while encouraging creativity, teamwork, and analytical thinking in an interactive learning environment.
                </m.p>
            </div>
        </div>
    );
};

const Archive_ideatolaunch = () => {
    const images = [ev_ideatolaunch_itl1, ev_ideatolaunch_itl2, ev_ideatolaunch_itl3, ev_ideatolaunch_itl4, ev_ideatolaunch_itl5, ev_ideatolaunch_itl6,
        ev_ideatolaunch_itl7, ev_ideatolaunch_itl8];
    const sliderImages = [...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* --- TITLE SECTION --- */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    IDEA TO LAUNCH
                </m.h1>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)} initial="hidden" animate="show"
            >
                <p className="content-text">
                    Idea to Launch was an insightful seminar designed to introduce students to the world of startups and entrepreneurship. The session, led by <strong>Mr. Sai Varun C</strong>, Co-Founder of Alletrix Tech LLP, guided participants on transforming innovative ideas into successful startup ventures. Students gained valuable insights into entrepreneurship concepts such as idea identification, skill development, and investment opportunities, creating an inspiring and informative learning experience for aspiring entrepreneurs.
                </p>
            </m.div>

            {/* --- MARQUEE GALLERY --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`Synergy Highlight ${index}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- SPEAKERS --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                OUR <span className="highlight-blue">SPEAKER</span>
            </m.h2>

            <m.div
                className="guest-container"
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
            >
                {/* Speaker 1 */}
                <div className="guest-card">
                    <img src={'https://res.cloudinary.com/dxpglrdwn/image/upload/v1769709978/members/koddtujayynkvdmq3tkc.jpg'} alt="Mr. Sai varun C" />
                    <div className="card-overlay">
                        <div className="guest-info">
                            <h3>Mr. Sai varun C<br />
                                <span style={{ fontSize: '11px', fontWeight: '300', textTransform: 'initial', color: '#ccc' }}>
                                    4th year CSE-AIML
                                </span>
                            </h3>
                        </div>
                    </div>
                </div>
            </m.div>

            {/* --- HIGHLIGHTS TEXT --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event began with an engaging seminar session led by <strong>Mr. Sai Varun C</strong>, Co-Founder of Alletrix Tech LLP, who shared his inspiring entrepreneurial journey and experiences in building a startup from scratch. Students actively listened as he explained the challenges, risks, and opportunities involved in establishing a successful startup venture. His personal experiences and practical insights motivated participants to think innovatively and consider entrepreneurship as a potential career path.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    During the session, students were introduced to important entrepreneurship concepts such as idea identification, market analysis, skill development, and business planning. The speaker explained how innovative ideas can be transformed into practical startup ventures through consistent effort, strategic planning, and adaptability. Participants gained a better understanding of the importance of identifying real-world problems and developing creative solutions that could create meaningful impact in society.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    One of the major highlights of the event was the interactive discussion on investment opportunities and startup growth. Students learned about different funding methods, including investors, partnerships, and startup support initiatives available for young entrepreneurs. The session also focused on the importance of communication skills, leadership qualities, teamwork, and decision-making in successfully managing a startup environment. Participants enthusiastically engaged in the discussions and clarified their doubts regarding entrepreneurship and business development.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The seminar created an inspiring atmosphere where students were encouraged to think creatively, explore innovative ideas, and understand the practical aspects of launching a startup. Participants showed great interest throughout the session and actively interacted with the speaker during discussions and question-answer segments. The event successfully provided students with valuable exposure to entrepreneurship and startup culture while motivating them to develop confidence in pursuing their own innovative ideas.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, Idea to Launch was a highly informative and motivational seminar that encouraged students to explore entrepreneurship, innovation, and leadership through real-world insights and interactive learning experiences effectively.
                </m.p>
            </div>
        </div>
    );
};

const Archive_inaugural = () => {
    const sliderImages = [
        ev_inaugural_speech1, ev_inaugural_img3, ev_inaugural_img4, ev_inaugural_logoReveal, ev_inaugural_img2, ev_inaugural_img1, ev_inaugural_grpimg, ev_inaugural_sigaigrp,
        ev_inaugural_speech1, ev_inaugural_img3, ev_inaugural_img4, ev_inaugural_logoReveal, ev_inaugural_img2, ev_inaugural_img1, ev_inaugural_grpimg, ev_inaugural_sigaigrp
    ];
    return (
        <div className="archive-detail-content">
            {/* --- TITLE SECTION --- */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
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
                variants={fadeIn("up", 0.2)} initial="hidden" animate="show"
            >
                <p className="content-text">
                    We are excited to share that the SIST ACM SIGAI Student Chapter has been successfully inaugurated on 8th April 2024 (Monday) at Tmt. Soundrabai Auditorium, Sathyabama Institute of Science & Technology, Chennai. We would like to thank all the Admins, Deans, HoDs, Faculties and Students who supported us.
                </p>
                <p className="content-text">
                    Graced by the presence of esteemed dignitaries: Vice President <strong>Ms. Maria Catherine Jayapriya</strong>, Vice Chancellor <strong>Dr. Sasipraba T</strong>, Chief Guest <strong>Ms. Rajalakshmi Srinivasan</strong>, Director Administration <strong>Dr. Sundari G</strong>, Dean COMPUTING <strong>Dr. T. Sasikala</strong>, and our distinguished Heads of Departments.
                </p>
            </m.div>

            {/* --- MARQUEE GALLERY --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt="Inauguration Highlight" />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- GUESTS OF HONOUR --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                GUESTS OF <span className="highlight-blue">HONOUR</span>
            </m.h2>

            {/* Changed div to m.div for animation */}
            <m.div
                className="guest-container"
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
            >
                <div className="guest-card">
                    <img src={ev_inaugural_inauguralchiefguest} alt="Ms. Rajalakshmi Srinivasan" />
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
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Ceremonial lighting of the lamp followed by a welcome address by <strong>Dean of School of Computing, Dr. T. Sasikala</strong>.
                    <strong> Mrs. Rajalakshmi Srinivasan</strong>, Director of Product Management at Zoho Corporations, emphasized the importance of practical learning.
                    <strong> Vice President Ms. Maria Catherine Jayapriya</strong> pledged support for the club's initiatives.
                    <strong> Vice Chancellor Dr. T. Sasiprabha</strong> stressed inter-departmental collaboration.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    <strong>The Head of Computer Science and Engineering department, Dr. S. Vigneshwari</strong> took a moment to express her appreciation for the Chairperson, Vice Chairperson, and every member of the core unit and she spoke very enthusiastically about the projects related to AI and her vision to bring the community together.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The core unit of the club were introduced by the Chairperson. Each and every member was called onto the stage and was presented with ID cards by our respectful Vice president mam and Vice Chancellor mam.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    <strong>Core Unit:</strong> Chairperson - Gowtham S, Vice Chairperson – Bharath Kodidasu, Treasurer – Deekshitha Uppu, and our dedicated team members: Bellamkonda Harithreenath, Aditya Sai Teja B, Siva Krishna Adimulam, Manisri Venkatesh, Meghana Tanikella, Battina Vaishnavi, Niharika Ramayanam, D V Bhuvanesh, Ram Prasath, Sushree Sonali Patra, Vedha Varshini Vijay Ananth, Faheem Mohamed Rafi, Devendra Reddy, Janllyn Avantikha.
                </m.p>
            </div>
        </div>
    );
};

const Archive_insightx = () => {
    const images = [ev_insightx_insi1, ev_insightx_insi2, ev_insightx_insi3, ev_insightx_insi4, ev_insightx_insi5, ev_insightx_insi6,
        ev_insightx_insi7, ev_insightx_insi8, ev_insightx_insi9, ev_insightx_insi10];
    const sliderImages = [...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* --- TITLE SECTION --- */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    INSIGHTX’24
                </m.h1>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)} initial="hidden" animate="show"
            >
                <p className="content-text">
                    InsightX’24 was a dynamic event designed to showcase innovation and creativity within the tech community. It featured a blend of technical and non-technical competitions alongside an insightful guest talk on the Big Data revolution. The event provided an excellent platform for students to compete and learn, promoting collaborative knowledge sharing. Cash prizes were awarded to the winners, and e-certificates were given to recognize every participant.
                </p>

            </m.div>

            {/* --- MARQUEE GALLERY --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`Synergy Highlight ${index}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- HIGHLIGHTS TEXT --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event featured several engaging technical and non-technical activities that encouraged students to showcase their creativity, teamwork, and problem-solving skills. One of the major attractions was <strong>"Data Pix,"</strong> where participants combined data science with storytelling by analyzing datasets using Python and presenting their ideas creatively through Canva and PowerPoint presentations. Students actively participated and explored innovative approaches to solving real-world problems.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Following this was <strong>"Debug Dominion,"</strong> a coding-based competition that tested logical thinking and collaboration among teams. Participants worked together in assigned roles such as Problem Solver, Code Checker, and Planner to identify bugs and review code efficiently. The event created a competitive atmosphere that strengthened both technical knowledge and team coordination skills among students.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The symposium also included an insightful guest talk on <strong>"Trends Shaping the Future"</strong> delivered by <strong>Mr. Arun C.</strong> The session focused on the Big Data Revolution and highlighted the growing importance of data-driven technologies across industries. Students gained valuable insights into emerging trends, practical applications of big data, and the role of analytics in modern decision-making.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Several non-technical competitions added excitement and energy to the event. <strong>"Enchanting Quest"</strong> engaged students in an adventurous treasure hunt where teams solved clues and challenges to reach the final destination. <strong>"Guess It"</strong> entertained participants through interactive visual puzzles that tested their creativity and reasoning abilities. <strong>"Stack 'N' Conquer"</strong> further promoted communication and teamwork through unique cup-stacking challenges conducted under time pressure.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The <strong>Free Fire</strong> and <strong>BGMI</strong> tournaments also attracted enthusiastic participation from gaming enthusiasts. Teams competed strategically through multiple rounds, showcasing coordination, precision, and gaming skills in intense battle royale matches.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, the event successfully created an engaging platform for students to learn, compete, interact, and collaborate, making InsightX'24 a memorable experience for everyone involved.
                </m.p>
            </div>
        </div>
    );
};

const Archive_linkedin = () => {
    const images = [ev_linkedin_gcwl1, ev_linkedin_gcwl2, ev_linkedin_gcwl3, ev_linkedin_gcwl4, ev_linkedin_gcwl5, ev_linkedin_gcwl6,
        ev_linkedin_gcwl7, ev_linkedin_gcwl8, ev_linkedin_gcwl9, ev_linkedin_gcwl10, ev_linkedin_gcwl11];
    const sliderImages = [...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* --- TITLE SECTION --- */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    Get linked with Linkedin
                </m.h1>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)} initial="hidden" animate="show"
            >
                <p className="content-text">
                    Get Linked with LinkedIn was an interactive workshop designed to help first-year students understand the importance of LinkedIn and build their professional presence online. The session guided participants in creating LinkedIn accounts, setting up profiles, and exploring key platform features. Students also learned how LinkedIn supports career development, networking, and job opportunities, making the event an informative and valuable experience for their future professional growth.
                </p>
            </m.div>

            {/* --- MARQUEE GALLERY --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`Synergy Highlight ${index}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- HIGHLIGHTS TEXT --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event began with an introductory session that familiarized first-year students with LinkedIn and its growing importance in today's professional world. Participants were introduced to the purpose of LinkedIn as a professional networking platform and learned how it helps students connect with industry professionals, explore career opportunities, and build a strong online presence. The session created awareness among students about the importance of maintaining a professional identity from the early stages of their academic journey.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Following the introduction, students were guided through the process of creating their own LinkedIn accounts and setting up professional profiles. The session included step-by-step explanations on adding profile details such as educational background, skills, achievements, certifications, and profile photographs. Participants actively followed the instructions and learned how to organize their profiles effectively to create a positive first impression for recruiters and professional connections.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    One of the major highlights of the event was the interactive guidance provided on exploring LinkedIn features and using the platform for career development. Students learned how to build professional networks, connect with peers and mentors, follow organizations, and stay updated with industry trends. The session also explained how LinkedIn can support internship opportunities, job searches, and personal branding through active engagement and content sharing. Participants showed great interest in understanding how the platform could contribute to their future academic and professional growth.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The workshop encouraged active participation and interaction throughout the session, with students clarifying doubts and exploring the platform practically during the event. The hands-on approach made the learning process engaging and easy to understand for beginners. Participants gained confidence in using LinkedIn effectively and recognized its value in developing professional communication and networking skills.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, Get Linked with LinkedIn was a highly informative and practical workshop that successfully introduced students to professional networking and career development through interactive learning and guided profile-building activities for future success.
                </m.p>
            </div>
        </div>
    );
};

const Archive_mindauction = () => {
    const images = [ev_mindauction_ma1, ev_mindauction_ma2, ev_mindauction_ma3, ev_mindauction_ma4, ev_mindauction_ma5];
    const sliderImages = [...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* --- TITLE SECTION --- */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    MIND AUCTION
                </m.h1>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)} initial="hidden" animate="show"
            >
                <p className="content-text">
                    Mind Auction was an interactive non-technical event designed to enhance students’ critical thinking, communication, and decision-making abilities through debate-based activities. Participants presented their viewpoints on assigned topics within limited time durations, encouraging thoughtful discussions and active participation. The event created an engaging platform for students to express ideas confidently, develop analytical thinking skills, and improve public speaking abilities while participating in competitive and intellectually stimulating discussions together.
                </p>
            </m.div>

            {/* --- MARQUEE GALLERY --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`Mind Auction Highlight ${index}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- HIGHLIGHTS TEXT --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event began with an introduction to the structure and objectives of Mind Auction, where participants were familiarized with the debate-based format and the rules of the activity. Students were informed about how topics would be assigned and how they would be required to present their viewpoints within a limited period of time. The session immediately created curiosity and excitement among participants, encouraging them to think critically and prepare themselves for active discussions throughout the event.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    As the event progressed, participants enthusiastically presented their opinions on a variety of assigned topics, expressing their ideas with confidence and clarity. Students actively engaged in debates, shared perspectives, defended their viewpoints, and responded thoughtfully to opposing opinions during discussions. The activity encouraged participants to analyze topics from different angles and develop logical arguments within limited time constraints. The competitive environment motivated students to think quickly, communicate effectively, and present their ideas in a structured and convincing manner.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    One of the major highlights of the event was the active participation and confidence displayed by students during the debate rounds. Participants demonstrated strong communication skills, creativity, analytical thinking, and decision-making abilities while presenting their viewpoints. The event also encouraged students to listen carefully to others' opinions, respect different perspectives, and engage in healthy intellectual discussions. The interactive nature of the activity made the session lively, engaging, and enjoyable for both participants and the audience.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The debate-based format helped students improve their public speaking skills and boosted their confidence in expressing ideas before an audience. Participants learned the importance of clarity, reasoning, and time management while presenting arguments effectively. The event successfully created an environment that promoted collaboration, discussion, and knowledge sharing among students through meaningful conversations and critical analysis.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, Mind Auction was a highly engaging and successful non-technical event that effectively enhanced students' communication, critical thinking, decision-making, and public speaking abilities through interactive debates, active participation, and intellectually stimulating discussions conducted in a competitive and enjoyable atmosphere.
                </m.p>
            </div>
        </div>
    );
};

const Archive_quicktrain = () => {
    const images = [ev_quicktrain_qt1, ev_quicktrain_qt2, ev_quicktrain_qt3, ev_quicktrain_qt4, ev_quicktrain_qt5, ev_quicktrain_qt6];
    const sliderImages = [...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* --- TITLE SECTION --- */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    THE QUICKTRAIN QUEST
                </m.h1>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)} initial="hidden" animate="show"
            >
                <p className="content-text">
                    The QuickTrain Quest was an interactive hands-on session designed to provide students with practical exposure to Artificial Intelligence and Machine Learning concepts. The event introduced participants to real-time AI model training through Teachable Machine Learning and guided them in building gesture detectors, emotion recognizers, and sound classifiers. Through teamwork, demonstrations, and experiential learning activities, students gained valuable insights into AI model development and practical machine learning workflows effectively.
                </p>
            </m.div>

            {/* --- MARQUEE GALLERY --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`Quick Train Highlight ${index}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- SPEAKERS --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                OUR <span className="highlight-blue">SPEAKER</span>
            </m.h2>

            <m.div
                className="guest-container"
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
            >
                {/* Speaker 1 */}
                <div className="guest-card">
                    <img src={'https://res.cloudinary.com/dxpglrdwn/image/upload/v1768412524/members/eg8fmcxskzb4qjlvz5vh.jpg'} alt="Ms. Anushri Rajkumar" />
                    <div className="card-overlay">
                        <div className="guest-info">
                            <h3>Ms. Anushri Rajkumar<br />
                                <span style={{ fontSize: '11px', fontWeight: '300', textTransform: 'initial', color: '#ccc' }}>
                                    3rd year CSE-AIML
                                </span>
                            </h3>
                        </div>
                    </div>
                </div>
            </m.div>

            {/* --- HIGHLIGHTS TEXT --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event began with an informative introduction to Artificial Intelligence and Machine Learning concepts conducted by <strong>Ms. Anushri Rajkumar</strong>, who guided participants through the fundamentals of Teachable Machine Learning and real-time AI model training. Students were introduced to the basic processes involved in training and testing machine learning models and gained an understanding of how artificial intelligence systems learn from data through practical demonstrations. The session created an interactive learning environment that encouraged students to actively explore AI technologies and their real-world applications.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Following the introductory explanation, participants were guided through hands-on demonstrations that showcased the process of building AI models using Teachable Machine Learning tools. Students learned how datasets are created, how machine learning models are trained, and how trained models can recognize patterns and respond to user inputs. The demonstrations simplified complex AI concepts and allowed participants to understand machine learning workflows through practical implementation rather than theoretical explanations alone.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    One of the major highlights of the event was the team-based practical activity where students collaborated to build their own AI models. Participants enthusiastically worked on projects such as gesture detectors, emotion recognizers, and sound classifiers while experimenting with different training methods and testing approaches. The activity encouraged teamwork, creativity, analytical thinking, and problem-solving while allowing students to practically apply the concepts learned during the session. Students actively interacted with peers and coordinators throughout the workshop, creating an engaging and collaborative atmosphere.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The hands-on approach of the session helped participants gain confidence in understanding AI model development and practical machine learning processes. Students explored how AI systems can be trained to identify and respond to different forms of input data in real-time applications. The event successfully created curiosity and interest among participants toward artificial intelligence and emerging technologies through interactive learning experiences and experimentation.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, The QuickTrain Quest was a successful and enriching hands-on session that combined technical learning, teamwork, creativity, and practical exposure to Artificial Intelligence and Machine Learning concepts in an engaging and experiential learning environment.
                </m.p>
            </div>
        </div>
    );
};

const Archive_resumebuilding = () => {
    const images = [ev_resumebuilding_rd1, ev_resumebuilding_rd2, ev_resumebuilding_rd3, ev_resumebuilding_rd4, ev_resumebuilding_rd5];
    const sliderImages = [...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* TITLE */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
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
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`Resume Building ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* HIGHLIGHTS */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The session began with an introduction to the importance of resume building and its role in creating a strong first impression on recruiters. Participants were guided on how a well-structured resume can significantly influence internship, placement, and higher education opportunities. The speakers explained the purpose of a resume and highlighted its importance as a professional document that effectively showcases a candidate's qualifications, skills, and achievements. Students actively engaged in the discussion and gained a clear understanding of the value of presenting information professionally.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Following the introduction, participants were introduced to <strong>Overleaf</strong> and guided through the process of creating professional resumes using structured templates. <strong>Ms. Lakshana S</strong> conducted a hands-on demonstration that familiarized students with the platform and simplified the resume-building process. Students actively followed the step-by-step instructions and learned how to organize their information effectively while maintaining a clean and professional format. The practical approach enabled participants to gain confidence in creating resumes independently.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    One of the major highlights of the session was the discussion on recruiter expectations and resume evaluation criteria. Participants learned about the key differences between a <strong>CV and a resume</strong> and gained valuable insights into the elements that organizations commonly look for in candidates. The speakers emphasized the importance of showcasing relevant skills, projects, certifications, academic achievements, and extracurricular activities in a concise and impactful manner. Students also learned about <strong>Applicant Tracking Systems (ATS)</strong> and the significance of optimizing resumes to improve visibility during recruitment processes.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The workshop further encouraged students to critically assess their own profiles and identify areas for improvement. Through hands-on practice, participants applied the concepts learned during the session and developed professional resumes tailored to future opportunities. The interactive format allowed students to clarify doubts and receive practical guidance throughout the workshop.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, <strong>Resume Building</strong> was a highly informative and engaging session that enhanced students' understanding of professional resume creation, improved their confidence in presenting qualifications effectively, and prepared them for future academic, internship, and placement opportunities with greater readiness and success.
                </m.p>
            </div>
        </div>
    );
};

const Archive_spaceday = () => {
    const sliderImages = [
        ev_spaceday_s1, ev_spaceday_s2, ev_spaceday_s3, ev_spaceday_s5, ev_spaceday_s6, ev_spaceday_s7, ev_spaceday_s8, ev_spaceday_s9, ev_spaceday_s10, ev_spaceday_s11, ev_spaceday_s12, ev_spaceday_s13, ev_spaceday_s14,
        ev_spaceday_s1, ev_spaceday_s2, ev_spaceday_s3, ev_spaceday_s5, ev_spaceday_s6, ev_spaceday_s7, ev_spaceday_s8, ev_spaceday_s9, ev_spaceday_s10, ev_spaceday_s11, ev_spaceday_s12, ev_spaceday_s13, ev_spaceday_s14
    ];
    return (
        <div className="archive-detail-content">
            {/* --- TITLE SECTION --- */}
            {/* Uses animate="show" for instant visibility on load */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    SPACE DAY
                </m.h1>

                <m.p
                    className="content-text"
                    style={{ textAlign: 'center' }}
                    variants={fadeIn("up", 0.3)}
                    initial="hidden"
                    animate="show"
                >
                    Exploring the Cosmos. August 22nd, 2024.
                </m.p>
            </div>

            {/* --- INTRO TEXT --- */}
            {/* Uses animate="show" to ensure it's visible without needing to scroll first */}
            <m.div
                variants={fadeIn("up", 0.2)} initial="hidden" animate="show"
            >
                <p className="content-text">
                    We are pleased to share that the SIST ACM SIGAI Student Chapter, in collaboration with the Centre for Remote Sensing and Informatics, conducted an event on the occasion of National Space Day on 22/08/2024 (Thursday) at Sathyabama Institute of Science and Technology, Chennai. Students from GHSS Perungudi and Evergreen School were invited to the university to participate in the event.
                </p>
            </m.div>

            {/* --- MARQUEE GALLERY --- */}
            {/* Reduced amount to 0.1 so it triggers immediately when any part is visible */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt="Space Day Highlight" />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- GUEST OF HONOUR --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                GUEST OF <span className="highlight-blue">HONOUR</span>
            </m.h2>

            <m.div
                className="guest-container"
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
            >
                <div className="guest-card">
                    <img src={ev_spaceday_guest} alt="Padma Shri Dr. Mylswamy Annadurai" />
                    <div className="card-overlay">
                        <div className="guest-info">
                            <h3>Padma Shri Dr. Mylswamy Annadurai<br />
                                <span style={{ fontSize: '11px', fontWeight: '300', textTransform: 'initial', color: '#ccc' }}>
                                    MOON MAN OF INDIA
                                </span>
                            </h3>
                        </div>
                    </div>
                </div>
            </m.div>

            {/* --- HIGHLIGHTS TEXT --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The morning session began with an orientation, during which <strong>Dr. Vigneshwari</strong>, Head of the Department of Computer Science (specializations in AI, AIML, DS), along with <strong>Dr. K Nagamani</strong>, delivered brief speeches outlining the day's events. This was followed by three competitions—painting, quiz, and ideathon—conducted simultaneously. In the painting competition, the participating students were provided with chart paper and given multiple space-related themes to illustrate in their paintings.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The afternoon session featured a workshop led by our chief ev_spaceday_guest, the esteemed <strong>Padma Shri Dr. Mylswamy Annadurai</strong>, known as the <strong>"Moon Man of India"</strong>. He graciously addressed the event, interacting with all the students. He conducted a seminar on space science and exploration for future India, which captivated the students' interest.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event concluded with a prize distribution ceremony. All the winners of the painting, quiz, and ideathon contests were awarded certificates and Decathlon vouchers worth Rs. 3000, Rs. 2000, and Rs. 1000 for first, second, and third prizes, respectively.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, the school students thoroughly enjoyed participating in the events. Transport was provided to all the students. The event was a grand success, and all the dignitaries praised it. We are grateful to all the faculty coordinators, student coordinators, and volunteers who contributed to the success of the event.
                </m.p>
            </div>
        </div>
    );
};

const Archive_spacez = () => {
    const images = [ev_spacez_s1, ev_spacez_s2, ev_spacez_s3, ev_spacez_s4, ev_spacez_s5];
    const sliderImages = [...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* TITLE */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    SpaceZ
                </m.h1>
                <m.p
                    variants={fadeIn("up", 0.2)} initial="hidden" animate="show"
                    style={{ color: '#94a3b8', fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '8px' }}
                >
                    2nd February 2026
                </m.p>
            </div>

            {/* INTRO */}
            <m.div variants={fadeIn("up", 0.3)} initial="hidden" animate="show">
                <p className="content-text">
                    SpaceZ was an engaging multi-round competition designed to test participants' knowledge, creativity, and problem-solving abilities through <strong>space-themed challenges</strong>. The event featured quizzes, model-building activities, and image identification rounds that encouraged teamwork, innovation, and quick thinking. Participants explored concepts related to <strong>astronomy, space missions, and scientific advancements</strong> while actively engaging in interactive tasks, creating an intellectually stimulating and enjoyable learning experience for all involved.
                </p>
            </m.div>

            {/* GALLERY */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`SpaceZ ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* HIGHLIGHTS */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event began with an exciting <strong>quiz round</strong> that tested participants' knowledge of space science, astronomy, planets, space missions, and scientific advancements. Students enthusiastically answered questions covering a wide range of topics related to the universe and space exploration. The round encouraged participants to recall their knowledge, think critically, and apply their understanding of scientific concepts in a competitive environment. The engaging nature of the quiz created excitement among teams and set an energetic tone for the rest of the event.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Following the quiz, participants advanced to the <strong>model-building round</strong>, which focused on creativity, innovation, and teamwork. Teams were provided with a problem statement and challenged to design and construct paper-based models that addressed the given scenario. Participants collaborated closely, exchanged ideas, and applied creative thinking to develop effective solutions within the allotted time. The activity encouraged students to combine imagination with practical problem-solving while strengthening communication and teamwork skills. The round witnessed enthusiastic participation and showcased the innovative abilities of the competing teams.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    One of the major highlights of the event was the final <strong>image identification round</strong>, where participants were required to recognize and respond to space-related visuals within a limited time. The round tested observation skills, quick thinking, and the ability to recall information accurately under pressure. Teams actively competed to identify images related to planets, spacecraft, astronomical phenomena, and other space-related subjects. The fast-paced nature of the activity kept participants engaged and added excitement to the competition.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Throughout the event, students displayed remarkable enthusiasm, teamwork, and curiosity toward space and scientific exploration. The combination of knowledge-based, creative, and rapid-response activities ensured that participants remained actively involved in every stage of the competition. The event successfully promoted learning through interaction and encouraged students to explore scientific concepts in an enjoyable manner.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, <strong>SpaceZ</strong> was a highly engaging and successful competition that combined knowledge, creativity, teamwork, and quick thinking through a variety of space-themed challenges, providing participants with an enjoyable, educational, and memorable learning experience while fostering curiosity about science and innovation.
                </m.p>
            </div>
        </div>
    );
};

const Archive_startupxcel = () => {
    const images = [ev_startupxcel_sx1, ev_startupxcel_sx2, ev_startupxcel_sx3, ev_startupxcel_sx4];
    const sliderImages = [...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* TITLE */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    Startup Xcel
                </m.h1>
            </div>

            {/* INTRO */}
            <m.div variants={fadeIn("up", 0.2)} initial="hidden" animate="show">
                <p className="content-text">
                    Startup Xcel was an engaging technical competition designed to foster <strong>creativity, innovation, branding skills, and entrepreneurial thinking</strong> among students. The event challenged participants to develop startup ideas, create unique brand identities, and pitch their business concepts through multiple interactive rounds. By combining problem-solving, teamwork, and presentation skills, the competition provided an excellent platform for students to explore entrepreneurship while showcasing their creativity, confidence, and innovative mindset.
                </p>
            </m.div>

            {/* GALLERY */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`Startup Xcel ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* HIGHLIGHTS */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event began with an exciting <strong>ideation round</strong> where participants were encouraged to identify real-world problems and develop innovative startup concepts to address them. Students worked collaboratively in teams to brainstorm ideas, analyze challenges, and propose practical solutions with potential social and commercial impact. The activity encouraged creative thinking and entrepreneurial problem-solving while allowing participants to explore how innovative ideas can be transformed into meaningful business opportunities. Teams actively discussed their concepts and demonstrated enthusiasm throughout the ideation process.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Following the initial round, participants advanced to the <strong>branding and design stage</strong>, which focused on developing unique identities for their startup concepts. Teams created logos, brand names, and visual elements that effectively represented their business ideas and objectives. This round encouraged students to think beyond technical solutions and understand the importance of branding, marketing, and visual communication in building a successful startup. Participants displayed remarkable creativity and originality while designing identities that reflected the vision and purpose of their proposed ventures.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    One of the major highlights of the event was the final <strong>pitching round</strong>, where teams presented their startup ideas before the audience and coordinators. Participants explained the problem they aimed to solve, the solutions they proposed, their target audience, and the overall business strategy behind their concepts. The presentations tested communication, confidence, and persuasion skills while providing students with valuable experience in presenting ideas in a professional setting. Teams demonstrated excellent preparation and showcased their ability to articulate innovative concepts effectively.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The competition created an energetic and collaborative atmosphere where students exchanged ideas, learned from one another, and developed a deeper appreciation for entrepreneurship and innovation. The multi-round structure encouraged participants to combine creativity, teamwork, critical thinking, and presentation skills throughout the event. Students remained actively engaged and displayed enthusiasm during every stage of the competition.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, <strong>Startup Xcel</strong> was a highly interactive and successful event that promoted innovation, entrepreneurial thinking, branding, and problem-solving through engaging activities. The competition provided students with valuable exposure to startup development while enhancing their creativity, teamwork, confidence, and business communication skills.
                </m.p>
            </div>
        </div>
    );
};

const Archive_synergy = () => {
    const images = [ev_synergy_fre1, ev_synergy_fre2, ev_synergy_fre3, ev_synergy_fre4, ev_synergy_fre5, ev_synergy_fre6,
        ev_synergy_fre7, ev_synergy_fre8, ev_synergy_fre9, ev_synergy_fre10, ev_synergy_fre11];
    const sliderImages = [...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* --- TITLE SECTION --- */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    SYNERGY TO FRESHERS
                </m.h1>

                <m.p
                    className="content-text"
                    style={{ textAlign: 'center' }}
                    variants={fadeIn("up", 0.3)}
                    initial="hidden"
                    animate="show"
                >
                    Welcoming the New Batch. September 4th, 2024.
                </m.p>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)} initial="hidden" animate="show"
            >
                <p className="content-text">
                    We are happy to share that the SIST ACM SIGAI Student Chapter successfully conducted an exciting event for the new generation, "Synergy for Freshers," on 4th September 2024 (Wednesday) at the Dental Auditorium, Sathyabama Institute of Science and Technology, Chennai. The event was designed to warmly welcome the incoming batch of students and introduce them to the vibrant academic and extracurricular opportunities available within the university.
                </p>

                <p className="content-text">
                    Synergy for Freshers served as a platform to foster interaction, collaboration, and creativity among students while helping them build meaningful connections with their peers and seniors. Through engaging activities, insightful sessions, and team-based challenges, participants gained valuable knowledge about career opportunities, higher studies, entrepreneurship, and personal development. The event created an enthusiastic and friendly atmosphere, encouraging freshers to step confidently into their academic journey and become active members of the student community.
                </p>
            </m.div>

            {/* --- MARQUEE GALLERY --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`Synergy Highlight ${index}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- HIGHLIGHTS TEXT --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event began with our core unit members, <strong>Ms. Janllyn Avantikha and Ms. Vaishnavi Battina</strong>, introducing our Student Chapter to the audience, followed by a speech from our honorable Head of the Department, <strong>Dr. Vigneshwari.</strong>
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The first round of the event was a non-technical fun activity, "Trash to Treasure." All the students were divided into teams and provided with a bunch of trash and chart paper. They were tasked with creating something innovative from the materials they were given. The students showed immense enthusiasm and worked wonders with their creations. The results were evaluated by our faculty coordinators, <strong>Dr. R. Sathyabama Krishna and Dr. Anu Barathi</strong>. Two winners were selected from the teams.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Following this was an orientation session where the members of our Student Chapter took the stage to explain the various future opportunities available to students after graduation. <strong>Ms. Sri Soundharya</strong>, Secretary of the Student Chapter, gave a detailed explanation of the current placement opportunities and how to aim for them. <strong>Ms. Sushree Sonali Patra</strong>, a core unit member, discussed entrepreneurship opportunities, highlighting its advantages and drawbacks with real-life examples. <strong>Ms. Vaishnavi Battina</strong>, another core unit member, familiarized the students with post-graduation degrees available to them, their eligibility criteria, and how to approach them. The students found this session extremely informative.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    <strong>Ms. Deekshitha</strong>, Treasurer of the Student Chapter, engaged with the students and spoke about the anxiety surrounding career decisions, offering advice on how to handle it and passionately pursue one's dreams.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, the event was a great success, and all the students thoroughly enjoyed it. We are thankful to all the dignitaries, faculty coordinators, student coordinators, and freshers who attended the event, contributing to its success. We look forward to organizing more such events in the future.
                </m.p>
            </div>
        </div>
    );
};

const Archive_techmemeathon = () => {
    const images = [ev_techmemeathon_t1, ev_techmemeathon_t2, ev_techmemeathon_t3, ev_techmemeathon_t4];
    const sliderImages = [...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* TITLE */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    Tech-Meme-A-Thon
                </m.h1>
            </div>

            {/* INTRO */}
            <m.div variants={fadeIn("up", 0.2)} initial="hidden" animate="show">
                <p className="content-text">
                    Tech-Meme-A-Thon was a creative technical competition designed to combine <strong>technology, humor, and innovation</strong> through engaging meme-based activities. Participants worked in teams to create and present technical memes inspired by programming concepts, coding experiences, emerging technologies, and student life. Through multiple interactive rounds, the event encouraged creativity, teamwork, and communication skills while fostering a fun learning environment that allowed students to express technical knowledge in an entertaining and relatable manner.
                </p>
            </m.div>

            {/* GALLERY */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`Tech-Meme-A-Thon ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* HIGHLIGHTS */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event began with an introduction to the competition format, where participants were familiarized with the rules, objectives, and different rounds of Tech-Meme-A-Thon. Students were grouped into <strong>teams of two</strong> and encouraged to combine technical knowledge with creativity to produce humorous and relatable content. The unique concept of blending technology with humor immediately generated excitement among participants and created an energetic atmosphere that encouraged active involvement throughout the event.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Following the introduction, participants took part in <strong>caption-creation activities</strong> that challenged them to develop witty and engaging captions based on programming concepts, coding experiences, and technology-related scenarios. Teams enthusiastically brainstormed ideas and used their understanding of technical subjects to create humorous content that resonated with fellow students. The activity encouraged creativity, quick thinking, and communication while allowing participants to express technical concepts in an entertaining manner.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    One of the major highlights of the event was the <strong>technical meme design round</strong>, where participants created original memes inspired by coding challenges, emerging technologies, software development experiences, and student life in the field of computing. Teams demonstrated impressive originality and creativity while transforming complex technical topics into simple and relatable visual content. The round encouraged innovation and provided students with an opportunity to showcase both their technical understanding and creative abilities through digital expression.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event also featured a <strong>gallery walk</strong> where teams presented and displayed their meme creations for evaluation and discussion. Participants explored the work of other teams, exchanged ideas, and appreciated different perspectives on technology-related humor. The interactive nature of this activity promoted collaboration, communication, and a stronger sense of community among participants. Students actively engaged with one another and enjoyed the opportunity to learn through creativity and shared experiences.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, <strong>Tech-Meme-A-Thon</strong> was a highly engaging and successful technical event that combined innovation, teamwork, humor, and technical knowledge through creative activities. The competition encouraged participants to think creatively, communicate effectively, and present relatable technology-based content while fostering a lively, enjoyable, and collaborative learning environment for all students involved throughout the program.
                </m.p>
            </div>
        </div>
    );
};

const Archive_technopoly = () => {
    const images = [ev_technopoly_t1, ev_technopoly_t2, ev_technopoly_t3, ev_technopoly_t4, ev_technopoly_t5];
    const sliderImages = [...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* --- TITLE SECTION --- */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    TECHNOPOLY
                </m.h1>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)} initial="hidden" animate="show"
            >
                <p className="content-text">
                    Technopoly was a fun and interactive technical event designed to combine learning with gameplay through a Monopoly-inspired format. Participants progressed through coding challenges, debugging tasks, technical puzzles, and surprise rounds by rolling dice and moving across different blocks. The event encouraged teamwork, logical thinking, strategic decision-making, and problem-solving skills while creating an engaging and enjoyable environment that promoted active participation and collaborative learning among students.
                </p>
            </m.div>

            {/* --- MARQUEE GALLERY --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`Technopoly Highlight ${index}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- HIGHLIGHTS TEXT --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event began with an introduction to the rules and structure of Technopoly, where participants were familiarized with the Monopoly-inspired gameplay format and the different technical challenges included throughout the event. Students were grouped into teams and guided on how they would progress across the game board by rolling dice and completing tasks placed within various blocks. The unique combination of technical activities and game-based learning immediately created excitement and enthusiasm among participants.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    As the event progressed, students actively participated in coding challenges, debugging activities, technical puzzles, and surprise rounds designed to test their logical thinking and problem-solving abilities. Each block presented a different challenge that required teamwork, analytical skills, and strategic decision-making to successfully move forward in the game. Participants collaborated effectively within their teams, discussed solutions, and approached each challenge with creativity and enthusiasm. The competitive nature of the event kept students engaged throughout the session and encouraged active involvement from all participants.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    One of the major highlights of the event was the interactive and unpredictable gameplay experience created through the surprise rounds and strategic game progression. Teams had to think quickly, adapt to unexpected situations, and make decisions carefully in order to gain advantages within the competition. The event not only strengthened technical knowledge but also improved communication, teamwork, and time-management skills among participants. Students enjoyed the balance between learning and entertainment, making the overall experience both educational and enjoyable.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event also created a collaborative atmosphere where participants exchanged ideas, solved technical problems together, and supported one another during challenges. The game-based format helped students approach technical concepts in a relaxed and engaging manner while encouraging healthy competition and active participation. Participants displayed great enthusiasm and involvement throughout the event, contributing to its energetic environment.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, Technopoly was a highly successful and interactive technical event that effectively combined technology, teamwork, creativity, and strategic thinking through an innovative game-based learning experience, leaving participants with valuable knowledge and enjoyable memories of collaborative problem-solving activities.
                </m.p>
            </div>
        </div>
    );
};

const Archive_techuno = () => {
    const images = [ev_techuno_tuno1, ev_techuno_tuno2, ev_techuno_tuno3, ev_techuno_tuno4, ev_techuno_tuno5, ev_techuno_tuno6];
    const sliderImages = [...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* TITLE */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    TechUNO
                </m.h1>
            </div>

            {/* INTRO */}
            <m.div variants={fadeIn("up", 0.2)} initial="hidden" animate="show">
                <p className="content-text">
                    TechUNO was an innovative technical event that combined coding challenges with the excitement of the popular UNO card game. Participants solved technical problems based on card selections and competed in interactive rounds that tested <strong>programming knowledge, logical thinking</strong>, and quick decision-making skills. The event provided a unique blend of learning and competition, encouraging teamwork, technical awareness, and problem-solving abilities through an engaging and enjoyable game-based format.
                </p>
            </m.div>

            {/* GALLERY */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`TechUNO ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* HIGHLIGHTS */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event began with an introduction to the rules and structure of TechUNO, where participants were familiarized with the unique game-based format that combined technical challenges with the popular UNO card game. Students were divided into teams and guided on how <strong>different card colors represented various coding and problem-solving tasks</strong>. The innovative concept immediately captured the attention of participants and created an energetic atmosphere that encouraged active involvement throughout the event.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    During the first round, participants selected UNO card colors and solved technical problem statements associated with their chosen cards. The challenges covered topics such as <strong>Data Structures and Algorithms, programming logic, looping concepts</strong>, and debugging tasks. Students worked collaboratively within their teams to analyze problems, discuss solutions, and apply their technical knowledge effectively. The round encouraged logical thinking, teamwork, and quick problem-solving while allowing participants to strengthen their understanding of important programming concepts in an engaging manner.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    One of the major highlights of the event was the second round, which featured <strong>one-on-one UNO matches combined with rapid-fire technical questions</strong>. Participants were required to make quick decisions while simultaneously answering technical questions under time constraints. This round tested not only their technical awareness but also their ability to think critically and respond accurately under pressure. The competitive nature of the activity created excitement among participants and kept the audience actively engaged throughout the session.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event successfully blended learning with entertainment by transforming technical challenges into an interactive gaming experience. Students enthusiastically participated in both rounds and demonstrated strong analytical thinking, communication, and teamwork skills. The game-based approach helped participants apply technical concepts in a practical and enjoyable environment while encouraging healthy competition among teams.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, <strong>TechUNO</strong> was a highly engaging and successful technical event that combined coding, problem-solving, and strategic gameplay in a unique format. The event enhanced students' technical knowledge, logical reasoning, and decision-making abilities while providing a fun and memorable learning experience through active participation, teamwork, and competitive challenges that fostered collaborative growth.
                </m.p>
            </div>
        </div>
    );
};

const Archive_thinktankers = () => {
    const images = [ev_thinktankers_tt1, ev_thinktankers_tt2, ev_thinktankers_tt3, ev_thinktankers_tt4, ev_thinktankers_tt5, ev_thinktankers_tt6,
        ev_thinktankers_tt7, ev_thinktankers_tt8, ev_thinktankers_tt9, ev_thinktankers_tt10, ev_thinktankers_tt11];
    const sliderImages = [...images, ...images];
    return (
        <div className="archive-detail-content">
            {/* --- TITLE SECTION --- */}
            <div className="page-header">
                <m.h1
                    className="text-gradient" variants={fadeIn("down", 0.1)} initial="hidden" animate="show"
                >
                    Think Tankers
                </m.h1>
            </div>

            {/* --- INTRO TEXT --- */}
            <m.div
                variants={fadeIn("up", 0.2)} initial="hidden" animate="show"
            >
                <p className="content-text">
                    Think Tankers was an interactive seminar-based quiz event designed to help students explore important concepts related to Environmental Science. The event introduced participants to various themes including biodiversity, sustainable development, agricultural productivity, and global food security through informative discussions and engaging quiz rounds. Students were encouraged to think critically about real-world environmental challenges and analyze meaningful solutions through active participation. The event provided an excellent platform for participants to enhance their environmental awareness, improve analytical thinking, and engage in collaborative learning in an interactive and informative atmosphere.
                </p>
            </m.div>

            {/* --- MARQUEE GALLERY --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                EVENT <span className="highlight-blue">GALLERY</span>
            </m.h2>

            <div className="marquee-container">
                <div className="marquee-track">
                    {[...sliderImages, ...sliderImages].map((img, index) => (
                        <div className="marquee-item" key={index}>
                            <img src={img} alt={`Synergy Highlight ${index}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- HIGHLIGHTS TEXT --- */}
            <m.h2 className="section-title" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
            >
                KEY <span className="highlight-blue">HIGHLIGHTS</span>
            </m.h2>

            <div>
                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    The event began with an informative seminar session that introduced students to important Environmental Science concepts and their relevance in addressing present-day global challenges. Participants actively engaged in discussions on topics such as biodiversity, sustainable development, agricultural productivity, and global food security. The session encouraged students to think beyond theoretical knowledge and understand the practical impact of environmental issues on society and future generations. The interactive nature of the seminar created an engaging learning atmosphere and motivated students to participate enthusiastically throughout the event.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Following the seminar session, multiple quiz rounds were conducted to test the participants' understanding, critical thinking, and analytical abilities. The quiz questions were designed around real-world environmental challenges and encouraged students to apply their knowledge in identifying practical and meaningful solutions. Participants displayed great enthusiasm and competitiveness while answering questions related to environmental conservation, sustainability practices, food security, and ecological balance. The rounds not only tested their awareness but also enhanced their ability to think logically under pressure.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    One of the major highlights of the event was the active involvement of students during the discussion and quiz sessions. Participants confidently shared their perspectives on environmental concerns and demonstrated a strong interest in learning about sustainable practices and global environmental developments. The event successfully created an interactive platform where students could exchange ideas, improve their awareness, and strengthen their understanding of Environmental Science concepts in an enjoyable manner.
                </m.p>

                <m.p className="content-text" variants={fadeIn("up", 0.2)} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }}
                >
                    Overall, Think Tankers was a successful and enriching seminar-based event that combined learning with interaction and critical thinking. The event helped students develop a deeper understanding of environmental issues while encouraging teamwork, participation, and knowledge sharing. The enthusiastic response from participants reflected the success of the event in creating awareness and promoting meaningful discussions on environmental sustainability and responsibility today.
                </m.p>
            </div>
        </div>
    );
};

export const archivesRegistry: Record<string, ArchiveEventConfig> = {
    "agileengineering": {
        slug: "agileengineering",
        bgImage: ev_agileengineering_aebg,
        render: () => <Archive_agileengineering />
    },
    "azure": {
        slug: "azure",
        bgImage: ev_azure_bgImage,
        render: () => <Archive_azure />
    },
    "careercompass": {
        slug: "careercompass",
        bgImage: ev_careercompass_ccbg,
        render: () => <Archive_careercompass />
    },
    "cognibot": {
        slug: "cognibot",
        bgImage: ev_cognibot_cbg,
        render: () => <Archive_cognibot />
    },
    "cybersprint": {
        slug: "cybersprint",
        bgImage: ev_cybersprint_csbg,
        render: () => <Archive_cybersprint />
    },
    "digiart": {
        slug: "digiart",
        bgImage: ev_digiart_digiBg,
        render: () => <Archive_digiart />
    },
    "genai": {
        slug: "genai",
        bgImage: ev_genai_genBg,
        render: () => <Archive_genai />
    },
    "gitready": {
        slug: "gitready",
        bgImage: ev_gitready_gibg,
        render: () => <Archive_gitready />
    },
    "harmonix": {
        slug: "harmonix",
        bgImage: ev_harmonix_hbg,
        render: () => <Archive_harmonix />
    },
    "hellojava": {
        slug: "hellojava",
        bgImage: ev_hellojava_hjbg,
        render: () => <Archive_hellojava />
    },
    "ideatolaunch": {
        slug: "ideatolaunch",
        bgImage: ev_ideatolaunch_itlbg,
        render: () => <Archive_ideatolaunch />
    },
    "inaugural": {
        slug: "inaugural",
        bgImage: ev_inaugural_bgImage,
        render: () => <Archive_inaugural />
    },
    "insightx": {
        slug: "insightx",
        bgImage: ev_insightx_insightxBg,
        render: () => <Archive_insightx />
    },
    "linkedin": {
        slug: "linkedin",
        bgImage: ev_linkedin_gcwlbg,
        render: () => <Archive_linkedin />
    },
    "mindauction": {
        slug: "mindauction",
        bgImage: ev_mindauction_mabg,
        render: () => <Archive_mindauction />
    },
    "quicktrain": {
        slug: "quicktrain",
        bgImage: ev_quicktrain_qtbg,
        render: () => <Archive_quicktrain />
    },
    "resumebuilding": {
        slug: "resumebuilding",
        bgImage: ev_resumebuilding_rdbg,
        render: () => <Archive_resumebuilding />
    },
    "spaceday": {
        slug: "spaceday",
        bgImage: ev_spaceday_spaceBg,
        render: () => <Archive_spaceday />
    },
    "spacez": {
        slug: "spacez",
        bgImage: ev_spacez_sbg,
        render: () => <Archive_spacez />
    },
    "startupxcel": {
        slug: "startupxcel",
        bgImage: ev_startupxcel_sxbg,
        render: () => <Archive_startupxcel />
    },
    "synergy": {
        slug: "synergy",
        bgImage: ev_synergy_synergyBg,
        render: () => <Archive_synergy />
    },
    "techmemeathon": {
        slug: "techmemeathon",
        bgImage: ev_techmemeathon_tbg,
        render: () => <Archive_techmemeathon />
    },
    "technopoly": {
        slug: "technopoly",
        bgImage: ev_technopoly_tbg,
        render: () => <Archive_technopoly />
    },
    "techuno": {
        slug: "techuno",
        bgImage: ev_techuno_tunobg,
        render: () => <Archive_techuno />
    },
    "thinktankers": {
        slug: "thinktankers",
        bgImage: ev_thinktankers_ttbg,
        render: () => <Archive_thinktankers />
    },
};
