import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import Message from "../../components/Message";
import {
  getDashboardData,
  syncDashboard,
  type DashboardResponse,
  type Activity,
  markContactAsRead,
} from "../../services/admin/dashboardService";

/* ---------------- COMPONENT ---------------- */
const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardResponse>({
    stats: {
      totalMembers: 0,
      totalEvents: 0,
      ongoingEvents: 0,
      upcomingEvents: 0,
      todayRegistrations: 0,
      registrationRate: 0,
      memberGrowthRate: 0
    },
    latestEvent: null,
    ongoingRecruitments: [],
    recentActivity: [],
    topPerformers: {
      topEvent: null,
      topRecruitment: null
    },
    systemHealth: {
      apiStatus: 'online',
      dbStatus: 'connected',
      lastSync: new Date().toISOString(),
      uptime: '99.9%'
    }
  });

  const [enhancedRecentActivity, setEnhancedRecentActivity] = useState<Array<Activity & { icon: string; color: string }>>([]);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // Extract data for easier access
  const { stats, latestEvent, ongoingRecruitments, topPerformers, systemHealth } = dashboardData;

  const contactNotifications = enhancedRecentActivity.filter(
    (a) => a.type === "contact_message"
  );

  const unreadCount = contactNotifications.filter(
    (n) => !n.isRead
  ).length;

  const toggleReadState = async (id: string) => {
    try {
      const res = await markContactAsRead(id);

      // ✅ Update UI using backend truth
      setEnhancedRecentActivity(prev =>
        prev.map(item =>
          item._id === id
            ? { ...item, isRead: res.isRead }
            : item
        )
      );

      setError(null);
    } catch (err: any) {
      console.error("Failed to toggle read state", err);
      setError(err.message || "Failed to update message status");
    }
  };

  /* ---------------- FETCH DATA ---------------- */
  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await getDashboardData();

      // Set the complete dashboard data
      setDashboardData(data);
      setError(null);

      // Enhanced recent activity with icons
      if (data.recentActivity) {
        const enhancedActivities = data.recentActivity.map((activity) => {
          let icon = 'bi-info-circle';
          let color = 'text-primary';

          switch (activity.type) {
            case 'member_joined':
              icon = 'bi-person-plus';
              color = 'text-success';
              break;

            case 'event_created':
              icon = 'bi-calendar-plus';
              color = 'text-info';
              break;

            case 'recruitment_opened':
              icon = 'bi-door-open';
              color = 'text-warning';
              break;

            case 'contact_message':
              icon = 'bi-envelope-fill';
              color = 'text-danger';
              break;
          }

          return {
            ...activity,
            icon,
            color
          };
        });
        setEnhancedRecentActivity(enhancedActivities);
      }
    } catch (err: any) {
      console.error("Failed to load dashboard:", err);
      setError(err.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleSync = async () => {
    try {
      setLoading(true);
      await syncDashboard();
      await loadDashboard();
    } catch (err: any) {
      console.error("Sync failed", err);
      setError(err.message || "Dashboard sync failed");
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  /* ---------------- STYLES ---------------- */
  const styles = `
    /* --- Animations --- */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes pulseGlow {
      0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
      100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    }

    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .animate-up {
      animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
    }

    .animate-slide {
      animation: slideInRight 0.5s ease-out forwards;
      opacity: 0;
    }

    /* --- Notification Bell Styling --- */
    .notification-btn {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      color: rgba(255, 255, 255, 0.7);
    }

    .notification-btn:hover, .notification-btn.show {
      background: rgba(59, 130, 246, 0.2);
      border-color: rgba(59, 130, 246, 0.5);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }

    .notification-badge {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(25%, -25%);
      box-shadow: 0 0 0 2px #111827; /* Matches dark bg to create cut-out effect */
    }

    /* --- Custom Dropdown Items --- */
    .custom-dropdown-item {
      color: #e5e7eb;
      transition: all 0.2s ease;
      background: transparent;
      border: 1px solid transparent;
      cursor: pointer;
    }

    .custom-dropdown-item:hover {
      background: rgba(255, 255, 255, 0.08) !important; /* Overrides Bootstrap white */
      color: white !important;
      border-color: rgba(255, 255, 255, 0.1);
      transform: translateX(5px);
    }

    /* Remove default bootstrap dropdown background on hover */
    .dropdown-item:focus, .dropdown-item:hover {
      background-color: transparent;
    }

    /* --- Cards --- */
    .stat-card {
      background: linear-gradient(145deg, rgba(31, 41, 55, 0.6) 0%, rgba(17, 24, 39, 0.8) 100%);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%);
      transform: translateX(-100%);
      transition: 0.5s;
    }

    .stat-card:hover::before {
      transform: translateX(100%);
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.5);
      border-color: rgba(59,130,246,0.4);
    }

    .icon-wrapper {
      width: 48px; height: 48px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 12px;
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      transition: all 0.3s ease;
    }

    .stat-card:hover .icon-wrapper {
      background: #3b82f6;
      color: white;
      transform: scale(1.1) rotate(5deg);
    }

    /* --- Glass Panels --- */
    .glass-panel {
      background: rgba(31, 41, 55, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .list-item-hover:hover {
      background: rgba(255,255,255,0.03);
      padding-left: 10px;
    }
    
    .list-item-hover {
      transition: all 0.2s ease;
    }

    /* --- Progress Bar --- */
    .progress-gradient {
      background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
      border-radius: 10px;
      height: 8px;
    }

    .progress-container {
      background: rgba(255,255,255,0.05);
      border-radius: 10px;
      overflow: hidden;
      height: 8px;
    }

    /* --- Badge Styles --- */
    .badge-high {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border: none;
    }

    .badge-medium {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: white;
      border: none;
    }

    .badge-low {
      background: linear-gradient(135deg, #64748b 0%, #475569 100%);
      color: white;
      border: none;
    }

    .badge-success-gradient {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
    }

    .badge-danger-gradient {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      border: none;
    }

    .badge-category {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    /* --- Button Styles --- */
    .btn-gradient {
      background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
      color: white;
      border: none;
      transition: all 0.3s ease;
    }

    .btn-gradient:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
    }

    .btn-outline-gradient {
      background: transparent;
      border: 1px solid #3b82f6;
      color: #3b82f6;
      transition: all 0.3s ease;
    }

    .btn-outline-gradient:hover {
      background: rgba(59, 130, 246, 0.1);
      border-color: #06b6d4;
      color: #06b6d4;
    }

    /* --- System Status Indicators --- */
    .status-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 8px;
    }

    .status-online { background-color: #10b981; }
    .status-offline { background-color: #ef4444; }
    .status-degraded { background-color: #f59e0b; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1.5rem;
    }

    /* --- DEFAULT DROPDOWN STYLES --- */
    .custom-dropdown-menu {
      width: 320px;
      background: rgba(17,24,39,0.95);
      backdrop-filter: blur(10px);
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.08);
      position: fixed; /* Fixed by default for better z-indexing */
      top: 70px;
      right: 20px;
      z-index: 9999;
    }

    /* --- MOBILE RESPONSIVENESS --- */
    @media (max-width: 1400px) {
      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 992px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    /* --- MOBILE BREAKPOINT (< 768px) --- */
    @media (max-width: 768px) {
      /* 1. Add offset for floating navbar */
      .mobile-offset {
        padding-top: 85px !important;
      }

      /* 2. Stack grid items vertically */
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      /* 3. Header adjustments */
      .page-header {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 1.5rem;
      }

      .header-actions {
        width: 100%;
        justify-content: space-between;
      }

      /* 4. Fix Dropdown position on Mobile */
      .custom-dropdown-menu {
        top: 90px;
        right: 5%;
        left: 5%;
        width: 90%; /* Full width minus margins */
      }
      
      /* 5. Smaller fonts for mobile */
      .display-6 {
        font-size: 1.5rem;
      }
      .display-5 {
        font-size: 2rem;
      }

      /* 6. Compact Padding for Cards */
      .stat-card, .glass-panel {
        padding: 1.25rem !important;
      }
    }
  `;

  /* ---------------- RENDER ---------------- */
  return (
    <AdminLayout active="Dashboard" loading={loading}>
      <style>{styles}</style>

      <Message
        variant="error"
        show={!!error}
        onClose={() => setError(null)}
        title="Something went wrong"
        position="top-right"
      >
        {error}
      </Message>

      {/* Added 'mobile-offset' class for floating navbar handling */}
      <div className="p-2 mobile-offset">
        {/* Header */}
        <div className="mb-5 animate-up" style={{ animationDelay: '0ms', position: 'relative', zIndex: 100 }}>
          {/* Changed d-flex to flex-column on mobile, row on desktop via CSS classes */}
          <div className="d-flex justify-content-between align-items-center page-header">
            <div>
              <h1 className="fw-bold text-white mb-1 display-6">Welcome Back, Admin</h1>
              <p className="text-secondary m-0">
                Here's what's happening with your chapter today.
              </p>
            </div>
            {/* System Health Badge & Notification */}
            <div className="d-flex align-items-center gap-3 header-actions">

              {/* 🔔 Notification Bell */}
              <div className="dropdown position-relative" style={{ zIndex: 1055 }}>
                <button
                  className="btn position-relative notification-btn"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-bell fs-5"></i>

                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger notification-badge">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown - Uses custom class .custom-dropdown-menu defined in styles */}
                <ul className="dropdown-menu dropdown-menu-end p-2 border-0 shadow-lg custom-dropdown-menu">
                  {contactNotifications.length === 0 ? (
                    <li className="text-secondary text-center small py-3">
                      <i className="bi bi-inbox fs-4 d-block mb-2 opacity-50"></i>
                      No new messages
                    </li>
                  ) : (
                    <>
                      {contactNotifications
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(a.time).getTime() - new Date(b.time).getTime()
                        )
                        .slice(0, 3)
                        .map((msg) => (
                          <li key={msg._id} className="custom-dropdown-item rounded-3 p-3 mb-1">
                            <div className="d-flex gap-3">
                              <div className="flex-shrink-0">
                                <div className="rounded-circle bg-danger bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                  <i className="bi bi-envelope-fill text-danger small"></i>
                                </div>
                              </div>
                              <div className="flex-grow-1 overflow-hidden">
                                <div className="d-flex justify-content-between align-items-start mb-1">
                                  <div
                                    className={`text-truncate ${msg.isRead ? "fw-normal text-secondary" : "fw-bold text-white"
                                      }`}
                                    style={{ maxWidth: '140px' }}
                                  >
                                    {msg.title}
                                  </div>
                                  <small className="text-secondary" style={{ fontSize: '0.7rem' }}>
                                    {formatTimeAgo(msg.time)}
                                  </small>
                                </div>

                                <small
                                  className={`d-block text-truncate ${msg.isRead ? "text-secondary" : "text-white-50"
                                    }`}
                                >
                                  {msg.subtitle}
                                </small>

                                {/* Mark as read (UI only) */}
                                <div className="text-end">
                                  <button
                                    className="btn btn-sm btn-link text-decoration-none p-0"
                                    style={{ fontSize: "0.75rem" }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleReadState(msg._id);
                                    }}
                                  >
                                    {msg.isRead ? "Mark unread" : "Mark read"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}

                      {/* More messages */}
                      {contactNotifications.length > 3 && (
                        <li className="text-center mt-2 pt-2 border-top border-secondary border-opacity-25">
                          <button
                            className="btn btn-sm btn-link text-decoration-none text-white opacity-75 hover-opacity-100"
                            onClick={() => navigate("/admin/messages")}
                          >
                            View all messages
                          </button>
                        </li>
                      )}
                    </>
                  )}
                </ul>
              </div>

              {/* System Health */}
              <div className="d-flex align-items-center">
                <span className={`status-indicator status-${systemHealth.apiStatus}`}></span>
                <small className="text-secondary d-none d-md-inline">API: {systemHealth.apiStatus}</small>
                <small className="text-secondary d-md-none">API</small>
              </div>

              <div className="d-flex align-items-center">
                <span className={`status-indicator status-${systemHealth.dbStatus}`}></span>
                <small className="text-secondary d-none d-md-inline">DB: {systemHealth.dbStatus}</small>
                <small className="text-secondary d-md-none">DB</small>
              </div>
            </div>

          </div>
        </div>

        {/* Stats Grid - Using Real Data Only */}
        <div className="stats-grid mb-5">
          {[
            {
              label: "Total Members",
              value: stats.totalMembers,
              icon: "bi-people-fill",
              delay: '100ms',
              trend: stats.memberGrowthRate ? `${stats.memberGrowthRate > 0 ? '+' : ''}${stats.memberGrowthRate}%` : "+0%",
              description: "Active members",
              badgeColor: stats.memberGrowthRate > 0 ? "badge-high" : stats.memberGrowthRate < 0 ? "badge-low" : "badge-medium"
            },
            {
              label: "Today's Registrations",
              value: stats.todayRegistrations,
              icon: "bi-pencil-square",
              delay: '200ms',
              trend: stats.registrationRate ? `${stats.registrationRate > 0 ? '+' : ''}${stats.registrationRate}%` : "+0%",
              description: "vs yesterday",
              badgeColor: stats.registrationRate > 0 ? "badge-success-gradient" : stats.registrationRate < 0 ? "badge-danger-gradient" : "badge-medium"
            },
            {
              label: "Ongoing Events",
              value: stats.ongoingEvents,
              icon: "bi-activity",
              delay: '300ms',
              trend: `${stats.ongoingEvents} live`,
              description: "Active right now"
            },
            {
              label: "Upcoming Events",
              value: stats.upcomingEvents,
              icon: "bi-calendar-check-fill",
              delay: '400ms',
              trend: "Scheduled",
              description: "Future events"
            },
            {
              label: "Total Events",
              value: stats.totalEvents,
              icon: "bi-calendar-event",
              delay: '500ms',
              trend: "All time",
              description: "Created events"
            },
          ].map((item, i) => (
            <div
              key={i}
              className="animate-up"
              style={{ animationDelay: item.delay }}
            >
              <div className="stat-card p-4 h-100 d-flex flex-column justify-content-between">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span className="text-secondary text-uppercase small fw-bold tracking-wider" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                      {item.label}
                    </span>
                    <h2 className="fw-bold text-white m-0 mt-2 display-5">{item.value}</h2>
                  </div>
                  <div className="icon-wrapper shadow-sm">
                    <i className={`bi ${item.icon} fs-4`}></i>
                  </div>
                </div>

                {/* Visual Indicator */}
                <div className="d-flex align-items-center gap-2 mt-auto pt-2 border-top border-white border-opacity-10">
                  <span className={`badge rounded-pill ${item.badgeColor || 'badge-medium'}`}>
                    <i className={`bi ${item.trend.includes('+') ? 'bi-arrow-up-short' : item.trend.includes('-') ? 'bi-arrow-down-short' : 'bi-dash'}`}></i> {item.trend}
                  </span>
                  <span className="text-secondary small">{item.description}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Second Row: Engagement Metrics & Upcoming Event */}
        <div className="row g-4 mb-4">
          {/* Engagement Metrics */}
          <div className="col-12 col-lg-8 animate-up" style={{ animationDelay: '600ms' }}>
            <div className="glass-panel p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-white m-0">
                  <i className="bi bi-graph-up-arrow text-success me-2"></i>
                  Engagement Metrics
                </h5>
              </div>

              <div className="row g-4">
                {/* Registration Progress */}
                <div className="col-12 col-md-6">
                  <div className="border border-secondary border-opacity-25 rounded-3 p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="text-white m-0">Event Registrations Today</h6>
                      <span className={`badge ${stats.registrationRate > 0 ? 'badge-success-gradient' : stats.registrationRate < 0 ? 'badge-danger-gradient' : 'badge-medium'}`}>
                        {stats.registrationRate > 0 ? '+' : ''}{stats.registrationRate}%
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <h2 className="fw-bold text-white m-0">{stats.todayRegistrations}</h2>
                      <div className="flex-grow-1">
                        <div className="progress-container">
                          <div
                            className="progress-gradient"
                            style={{
                              width: `${Math.min(100, (stats.todayRegistrations / Math.max(stats.totalMembers, 1)) * 100)}%`,
                              background: stats.registrationRate >= 0
                                ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                                : 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
                            }}
                          ></div>
                        </div>
                        <small className="text-secondary">Today's registrations</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Most Popular Event */}
                <div className="col-12 col-md-6">
                  <div className="border border-secondary border-opacity-25 rounded-3 p-3">
                    <h6 className="text-white mb-2">Most Popular Event</h6>
                    {topPerformers.topEvent ? (
                      <>
                        <h5 className="text-white fw-bold">{topPerformers.topEvent.name}</h5>
                        <div className="d-flex align-items-center gap-3">
                          <span className="badge bg-primary">
                            {topPerformers.topEvent.registrations} registrations
                          </span>
                          <small className="text-secondary">All time best</small>
                        </div>
                      </>
                    ) : (
                      <p className="text-secondary m-0">No event data available</p>
                    )}
                  </div>
                </div>

                {/* Member Growth Rate */}
                <div className="col-12 col-md-6">
                  <div className="border border-secondary border-opacity-25 rounded-3 p-3">
                    <h6 className="text-white mb-2">Member Growth Rate</h6>
                    <div className="d-flex align-items-center gap-3">
                      <h2 className="fw-bold text-white m-0">
                        {stats.memberGrowthRate > 0 ? '+' : ''}{stats.memberGrowthRate}%
                      </h2>
                      <div>
                        <div className="progress-container">
                          <div
                            className="progress-gradient"
                            style={{
                              width: `${Math.min(100, Math.abs(stats.memberGrowthRate))}%`,
                              background: stats.memberGrowthRate >= 0
                                ? 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
                                : 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
                            }}
                          ></div>
                        </div>
                        <small className="text-secondary">vs yesterday</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Recruitment */}
                <div className="col-12 col-md-6">
                  <div className="border border-secondary border-opacity-25 rounded-3 p-3">
                    <h6 className="text-white mb-2">Top Recruitment</h6>
                    {topPerformers.topRecruitment ? (
                      <>
                        <h5 className="text-white fw-bold">{topPerformers.topRecruitment.title}</h5>
                        <div className="d-flex align-items-center gap-3">
                          <span className="badge bg-warning text-dark">
                            {topPerformers.topRecruitment.applicants} applicants
                          </span>
                          <small className="text-secondary">Most applied</small>
                        </div>
                      </>
                    ) : (
                      <p className="text-secondary m-0">No recruitment data</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Event (Expanded) */}
          <div className="col-12 col-lg-4 animate-up" style={{ animationDelay: '650ms' }}>
            {latestEvent && (
              <div className="glass-panel p-4 h-100 d-flex flex-column">
                <h5 className="fw-bold text-white mb-3">
                  <i className="bi bi-calendar-event text-primary me-2"></i>
                  Next Upcoming Event
                </h5>

                <div className="border border-secondary border-opacity-25 rounded-3 p-3 flex-grow-1">
                  <div className="row">
                    <div className="col-12">
                      <h6 className="text-white mb-2 fs-5">{latestEvent.name}</h6>

                      {/* Registration Status Badge */}
                      <div className="mb-3">
                        <span className="badge bg-success">
                          {latestEvent.totalRegistrations} Registered
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="bi bi-calendar3 text-primary"></i>
                        <small className="text-secondary">{latestEvent.date}</small>
                      </div>

                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="bi bi-clock text-primary"></i>
                        <small className="text-secondary">{latestEvent.time}</small>
                      </div>

                      <div className="d-flex align-items-center gap-2 mb-3">
                        <i className="bi bi-geo-alt text-primary"></i>
                        <small className="text-secondary">{latestEvent.venue}</small>
                      </div>
                    </div>

                    {/* Contact Persons */}
                    <div className="col-12">
                      {latestEvent.contactPersons && latestEvent.contactPersons.length > 0 && (
                        <div className="mt-3">
                          <h6 className="text-white mb-2">
                            <i className="bi bi-telephone-fill text-primary me-2"></i>
                            Contact Persons
                          </h6>

                          <div className="d-flex flex-column gap-2">
                            {latestEvent.contactPersons.map((cp, idx) => (
                              <div
                                key={idx}
                                className="d-flex justify-content-between align-items-center px-3 py-2 rounded-3"
                                style={{ background: "rgba(255,255,255,0.05)" }}
                              >
                                <span className="text-white fw-semibold">{cp.name}</span>
                                <span className="text-primary small">{cp.phone}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Third Row: Ongoing Requirements & Recent Activity */}
        <div className="row g-4">
          {/* Ongoing Recruitments Section */}
          <div className="col-12 col-lg-8 animate-up" style={{ animationDelay: '700ms' }}>
            <div className="glass-panel p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-white m-0">
                  <i className="bi bi-list-task text-primary me-2"></i>
                  Ongoing Recruitments
                </h5>
                <button
                  className="btn btn-sm btn-link text-decoration-none text-secondary"
                  onClick={() => navigate("/admin/recruitments")}
                >
                  Manage All <i className="bi bi-arrow-right ms-1"></i>
                </button>
              </div>

              <div className="row g-3">
                {ongoingRecruitments.length === 0 ? (
                  <p className="text-secondary text-center">No open recruitments</p>
                ) : (
                  ongoingRecruitments.map((rec) => (
                    <div key={rec._id} className="col-12 col-md-6 col-lg-4">
                      <div className="border border-secondary border-opacity-25 rounded-3 p-3 h-100 d-flex flex-column">
                        <h6 className="text-white mb-1">{rec.title}</h6>

                        <span className="badge bg-primary text-white mb-2 align-self-start">
                          {rec.role}
                        </span>

                        {/* Applicant Count */}
                        <div className="mb-2">
                          <span className="badge bg-success">
                            {rec.applicantCount} applicants
                          </span>
                        </div>

                        <div className="text-secondary small mt-auto">
                          Opened on{" "}
                          {new Date(rec.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>

                        {/* Deadline Warning */}
                        {rec.deadline && new Date(rec.deadline).getTime() - Date.now() < 86400000 * 3 && (
                          <div className="mt-2">
                            <small className="text-warning">
                              <i className="bi bi-clock me-1"></i>
                              Deadline approaching
                            </small>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity & System Info */}
          <div className="col-12 col-lg-4 animate-up" style={{ animationDelay: '750ms' }}>
            <div className="glass-panel p-4 h-100 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-white m-0">
                  <i className="bi bi-clock-history text-warning me-2"></i>
                  Recent Activity
                </h5>
              </div>

              <ul className="list-unstyled m-0 d-flex flex-column gap-3 flex-grow-1">
                {enhancedRecentActivity
                  .filter(a => a.type !== "contact_message")
                  .slice(0, 4)
                  .map((a, i) => (
                    <li key={i} className="list-item-hover p-2 rounded-3">
                      <div className="d-flex align-items-start gap-2">
                        <i className={`bi ${a.icon} ${a.color} mt-1`}></i>
                        <div className="flex-grow-1">
                          <h6 className="text-white m-0">{a.title}</h6>
                          <span className="text-secondary small">{a.subtitle}</span>
                          <div className="text-secondary small">
                            {formatTimeAgo(a.time)}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>

              {/* System Health Panel */}
              <div className="mt-4 pt-3 border-top border-white border-opacity-10">
                <h6 className="text-white mb-3">
                  <i className="bi bi-heart-pulse text-danger me-2"></i>
                  System Health
                </h6>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="d-flex align-items-center gap-2">
                      <span className={`status-indicator status-${systemHealth.apiStatus}`}></span>
                      <small className="text-secondary">API</small>
                    </div>
                    <small className="text-white">{systemHealth.apiStatus.toUpperCase()}</small>
                  </div>

                  <div className="col-6">
                    <div className="d-flex align-items-center gap-2">
                      <span className={`status-indicator status-${systemHealth.dbStatus}`}></span>
                      <small className="text-secondary">Database</small>
                    </div>
                    <small className="text-white">{systemHealth.dbStatus.toUpperCase()}</small>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">Last Sync</small>
                    <small className="text-white d-block">
                      {new Date(systemHealth.lastSync).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </small>
                  </div>

                  <div className="col-6">
                    <small className="text-secondary">Uptime</small>
                    <small className="text-white d-block">{systemHealth.uptime}</small>
                  </div>
                </div>

                <button
                  className="btn btn-outline-light btn-sm w-100 rounded-pill"
                  onClick={handleSync}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      Syncing... <i className="bi bi-arrow-repeat ms-1"></i>
                    </>
                  ) : (
                    <>
                      Sync Now <i className="bi bi-arrow-repeat ms-1"></i>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;