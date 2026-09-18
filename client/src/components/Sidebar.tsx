import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/acm-logo.png";

// --- CSS Styles ---
const sidebarStyles = `
  /* --- Global Variables --- */
  :root {
    --glass-bg: rgba(17, 24, 39, 0.75);
    --glass-border: rgba(255, 255, 255, 0.08);
  }

  /* --- Desktop Sidebar --- */
  .custom-sidebar {
    width: 280px;
    min-width: 280px;
    height: 100vh;
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-right: 1px solid var(--glass-border);
    position: relative;
    z-index: 1060;
    transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  /* Nav Button Styling */
  .nav-btn {
    border: none;
    background: transparent;
    color: #9ca3af;
    font-weight: 500;
    transition: all 0.3s ease;
    border-radius: 16px;
    position: relative;
    overflow: hidden;
  }

  .nav-btn:hover:not(.active) {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
  }

  .nav-btn.active {
    color: #fff;
    background: rgba(37, 99, 235, 0.15);
    border: 1px solid rgba(59, 130, 246, 0.3);
    box-shadow: 0 0 15px rgba(37, 99, 235, 0.2);
  }

  /* --- Mobile Components --- */

  /* Container allows clicks to pass through to the sides */
  .mobile-header-container {
    display: none;
    position: fixed;
    top: 15px; 
    left: 0;
    right: 0;
    z-index: 1050;
    padding: 0 15px;
    background: transparent !important;
    pointer-events: none; 
  }

  /* The visible Capsule */
  .mobile-capsule {
    pointer-events: auto;
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    padding: 8px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    margin: 0 auto;
  }

  .sidebar-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 1055;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  /* --- Mobile Breakpoint --- */
  @media (max-width: 991px) {
    .mobile-header-container {
      display: block;
    }

.custom-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      transform: translateX(-110%);
      width: 85%;
      max-width: 320px;
      height: 100%;
      background: var(--glass-bg);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-right: 1px solid var(--glass-border);
    }

    .custom-sidebar.open {
      transform: translateX(0);
      box-shadow: 20px 0 50px rgba(0,0,0,0.5);
    }

    .sidebar-overlay.show {
      display: block;
      opacity: 1;
    }
  }
`;

interface SidebarProps {
  active?: string;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ active, onLogout }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", icon: "bi-speedometer2", path: "/admin/dashboard" },
    { label: "Members", icon: "bi-people-fill", path: "/admin/members" },
    { label: "Events", icon: "bi-calendar-event-fill", path: "/admin/eventmanager" },
    { label: "Recruitment", icon: "bi-person-plus-fill", path: "/admin/recruitments" },
    { label: "Enquiry Messages", icon: "bi-envelope-fill", path: "/admin/query" },
    { label: "Settings", icon: "bi-gear-fill", path: "/admin/settings" },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const LogoBrand = () => (
    <div className="d-flex align-items-center">
      <img
        src={logo}
        alt="Logo"
        style={{ width: 28, height: 28, objectFit: 'contain' }}
        className="me-2"
      />
      <span className="fw-bold text-white" style={{ letterSpacing: "1px", fontSize: '0.9rem' }}>
        ACM <span className="text-primary">SIGAI</span>
      </span>
    </div>
  );

  return (
    <>
      <style>{sidebarStyles}</style>

      {/* --- Floating Capsule Header (Mobile) --- */}
      <div className="mobile-header-container">
        <div className="mobile-capsule">
          <button 
            className="btn btn-sm text-white border-0 p-1" 
            onClick={() => setIsOpen(true)}
          >
            <i className="bi bi-grid-fill fs-5"></i>
          </button>

          <LogoBrand />

          <div style={{ width: 24 }}></div>
        </div>
      </div>

      {/* --- Overlay --- */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`} 
        onClick={() => setIsOpen(false)}
      />

      {/* --- Sidebar --- */}
      <aside className={`custom-sidebar d-flex flex-column justify-content-between py-4 ${isOpen ? 'open' : ''}`}>
        
        <div className="px-3">
          {/* Desktop Logo */}
          <div className="d-none d-lg-block mb-5 ps-2 pt-2">
             <div className="d-flex align-items-center">
               <img src={logo} alt="Logo" style={{ width: 45 }} className="me-3" />
              <div>
                <h6 className="fw-bold text-white m-0 lh-1">ACM SIGAI</h6>
                <small className="text-white-50" style={{fontSize: '0.75rem'}}>Admin Console</small>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar Header */}
          <div className="d-lg-none d-flex align-items-center justify-content-between mb-4 px-2">
            <h6 className="text-white-50 m-0 fw-bold ls-1">MENU</h6>
            <button 
                className="btn btn-sm btn-dark rounded-circle"
                style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                onClick={() => setIsOpen(false)}
            >
                <i className="bi bi-chevron-left"></i>
            </button>
          </div>

          <ul className="nav flex-column gap-2 mt-2">
            {menuItems.map((item) => (
              <li key={item.label} className="nav-item">
                <button
                  className={`btn w-100 d-flex align-items-center nav-btn p-3 ${
                    active === item.label ? "active" : ""
                  }`}
                  onClick={() => handleNavigate(item.path)}
                >
                  <i className={`bi ${item.icon} fs-5`}></i>
                  <span className="ms-3">{item.label}</span>
                  {active === item.label && (
                    <i className="bi bi-chevron-right ms-auto" style={{ fontSize: '0.8rem', opacity: 0.7 }}></i>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout */}
        <div className="px-3">
          <div className="p-3 rounded-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
             <button
              className="btn w-100 d-flex align-items-center nav-btn text-danger p-0"
              onClick={onLogout}
            >
              <div className="bg-danger bg-opacity-10 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{width: 36, height: 36}}>
                <i className="bi bi-box-arrow-right"></i>
              </div>
              <span className="fw-semibold">Sign Out</span>
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;