import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/acm-logo.png";
import { useAuth, type AdminPermission } from "../context/AuthContext";

interface SidebarProps {
  active?: string;
  onLogout?: () => void;
}

interface MenuItem {
  label: string;
  icon: string;
  path: string;
  key?: AdminPermission;
  superAdminOnly?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ active, onLogout }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isSuperAdmin, hasPermission } = useAuth();

  const allMenuItems: MenuItem[] = [
    { label: "Dashboard", icon: "bi-speedometer2", path: "/admin/dashboard", key: "dashboard" },
    { label: "Members", icon: "bi-people-fill", path: "/admin/members", key: "members" },
    { label: "Events", icon: "bi-calendar-event-fill", path: "/admin/eventmanager", key: "events" },
    { label: "Admin Users", icon: "bi-person-badge-fill", path: "/admin/users", superAdminOnly: true },
    { label: "Settings", icon: "bi-sliders", path: "/admin/settings", superAdminOnly: true },
    { label: "Profile", icon: "bi-person-gear", path: "/admin/profile" },
  ];

  const menuItems = allMenuItems.filter((item) => {
    if (isSuperAdmin) return true;
    if (item.superAdminOnly) return false;
    if (item.key) return hasPermission(item.key);
    return true;
  });

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
          {/* Desktop Logo & Role Badge */}
          <div className="d-none d-lg-block mb-4 ps-2 pt-2">
            <div className="d-flex align-items-center mb-2">
              <img src={logo} alt="Logo" style={{ width: 42 }} className="me-3" />
              <div>
                <h6 className="fw-bold text-white m-0 lh-1">ACM SIGAI</h6>
                <small className="text-white-50" style={{ fontSize: '0.75rem' }}>Admin Console</small>
              </div>
            </div>

            {/* Active User Pill (Clickable to open Profile) */}
            {user && (
              <div
                className="mt-3 px-2.5 py-1.5 rounded-3 d-flex align-items-center justify-content-between cursor-pointer"
                style={{
                  background: active === "Profile" ? "rgba(56, 189, 248, 0.12)" : "rgba(255, 255, 255, 0.04)",
                  border: `1px solid ${active === "Profile" ? "#38bdf8" : "rgba(255, 255, 255, 0.07)"}`,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onClick={() => handleNavigate("/admin/profile")}
                title="View & Edit Profile Settings"
              >
                <div className="d-flex align-items-center gap-2 overflow-hidden">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 24,
                      height: 24,
                      background: isSuperAdmin ? "rgba(168, 85, 247, 0.2)" : "rgba(56, 189, 248, 0.2)",
                      color: isSuperAdmin ? "#c084fc" : "#38bdf8",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      flexShrink: 0,
                    }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-truncate text-white small" style={{ fontSize: "0.78rem" }}>
                    {user.name || user.username}
                  </span>
                </div>

                <span
                  className="badge px-2 py-0.5"
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "0.5px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    background: isSuperAdmin ? "rgba(168, 85, 247, 0.18)" : "rgba(56, 189, 248, 0.18)",
                    color: isSuperAdmin ? "#c084fc" : "#38bdf8",
                    border: `1px solid ${isSuperAdmin ? "rgba(168, 85, 247, 0.4)" : "rgba(56, 189, 248, 0.4)"}`,
                    borderRadius: "6px",
                  }}
                >
                  {isSuperAdmin ? "Superadmin" : "Admin"}
                </span>
              </div>
            )}
          </div>

          {/* Mobile Sidebar Header */}
          <div className="d-lg-none d-flex align-items-center justify-content-between mb-4 px-2">
            <div className="d-flex align-items-center gap-2">
              <h6 className="text-white-50 m-0 fw-bold ls-1">MENU</h6>
              {user && (
                <span
                  className="badge px-2 py-0.5"
                  style={{
                    fontSize: "0.62rem",
                    background: isSuperAdmin ? "rgba(168, 85, 247, 0.2)" : "rgba(56, 189, 248, 0.2)",
                    color: isSuperAdmin ? "#c084fc" : "#38bdf8",
                    borderRadius: "4px",
                  }}
                >
                  {isSuperAdmin ? "SUPERADMIN" : "ADMIN"}
                </span>
              )}
            </div>
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