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
import DashboardStatCard from "../../components/Admin/Dashboard/DashboardStatCard";
import DashboardEngagementMetrics from "../../components/Admin/Dashboard/DashboardEngagementMetrics";
import DashboardUpcomingEvent from "../../components/Admin/Dashboard/DashboardUpcomingEvent";
import DashboardOngoingRecruitments from "../../components/Admin/Dashboard/DashboardOngoingRecruitments";
import DashboardRecentActivity, { formatTimeAgo } from "../../components/Admin/Dashboard/DashboardRecentActivity";

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
      memberGrowthRate: 0,
    },
    latestEvent: null,
    ongoingRecruitments: [],
    recentActivity: [],
    topPerformers: {
      topEvent: null,
      topRecruitment: null,
    },
    systemHealth: {
      apiStatus: "online",
      dbStatus: "connected",
      lastSync: new Date().toISOString(),
      uptime: "99.9%",
    },
  });

  const [enhancedRecentActivity, setEnhancedRecentActivity] = useState<
    Array<Activity & { icon: string; color: string }>
  >([]);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { stats, latestEvent, ongoingRecruitments, topPerformers, systemHealth } =
    dashboardData;

  const contactNotifications = enhancedRecentActivity.filter(
    (a) => a.type === "contact_message"
  );

  const unreadCount = contactNotifications.filter((n) => !n.isRead).length;

  const toggleReadState = async (id: string) => {
    try {
      const res = await markContactAsRead(id);
      setEnhancedRecentActivity((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isRead: res.isRead } : item
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
      setDashboardData(data);
      setError(null);

      if (data.recentActivity) {
        const enhancedActivities = data.recentActivity.map((activity) => {
          let icon = "bi-info-circle";
          let color = "text-primary";

          switch (activity.type) {
            case "member_joined":
              icon = "bi-person-plus";
              color = "text-success";
              break;
            case "event_created":
              icon = "bi-calendar-plus";
              color = "text-info";
              break;
            case "recruitment_opened":
              icon = "bi-door-open";
              color = "text-warning";
              break;
            case "contact_message":
              icon = "bi-envelope-fill";
              color = "text-danger";
              break;
          }

          return { ...activity, icon, color };
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

  return (
    <AdminLayout active="Dashboard" loading={loading}>
      <Message
        variant="error"
        show={!!error}
        onClose={() => setError(null)}
        title="Something went wrong"
        position="top-right"
      >
        {error}
      </Message>

      <div className="p-2 mobile-offset">
        {/* Header */}
        <div
          className="mb-5 animate-up"
          style={{ animationDelay: "0ms", position: "relative", zIndex: 100 }}
        >
          <div className="d-flex justify-content-between align-items-center page-header">
            <div>
              <h1 className="fw-bold text-white mb-1 display-6">
                Welcome Back, Admin
              </h1>
              <p className="text-secondary m-0">
                Here's what's happening with your chapter today.
              </p>
            </div>

            {/* System Health Badge & Notification */}
            <div className="d-flex align-items-center gap-3 header-actions">
              {/* 🔔 Notification Bell */}
              <div className="dropdown position-relative" style={{ zIndex: 1055 }}>
                <button
                  type="button"
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
                          <li
                            key={msg._id}
                            className="custom-dropdown-item rounded-3 p-3 mb-1"
                          >
                            <div className="d-flex gap-3">
                              <div className="flex-shrink-0">
                                <div
                                  className="rounded-circle bg-danger bg-opacity-10 d-flex align-items-center justify-content-center"
                                  style={{ width: "32px", height: "32px" }}
                                >
                                  <i className="bi bi-envelope-fill text-danger small"></i>
                                </div>
                              </div>
                              <div className="flex-grow-1 overflow-hidden">
                                <div className="d-flex justify-content-between align-items-start mb-1">
                                  <div
                                    className={`text-truncate ${
                                      msg.isRead
                                        ? "fw-normal text-secondary"
                                        : "fw-bold text-white"
                                    }`}
                                    style={{ maxWidth: "140px" }}
                                  >
                                    {msg.title}
                                  </div>
                                  <small
                                    className="text-secondary"
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    {formatTimeAgo(msg.time)}
                                  </small>
                                </div>

                                <small
                                  className={`d-block text-truncate ${
                                    msg.isRead ? "text-secondary" : "text-white-50"
                                  }`}
                                >
                                  {msg.subtitle}
                                </small>

                                <div className="text-end">
                                  <button
                                    type="button"
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

                      {contactNotifications.length > 3 && (
                        <li className="text-center mt-2 pt-2 border-top border-secondary border-opacity-25">
                          <button
                            type="button"
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
                <span
                  className={`status-indicator status-${systemHealth.apiStatus}`}
                ></span>
                <small className="text-secondary d-none d-md-inline">
                  API: {systemHealth.apiStatus}
                </small>
                <small className="text-secondary d-md-none">API</small>
              </div>

              <div className="d-flex align-items-center">
                <span
                  className={`status-indicator status-${systemHealth.dbStatus}`}
                ></span>
                <small className="text-secondary d-none d-md-inline">
                  DB: {systemHealth.dbStatus}
                </small>
                <small className="text-secondary d-md-none">DB</small>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid mb-5">
          <div className="animate-up" style={{ animationDelay: "100ms" }}>
            <DashboardStatCard
              title="Total Members"
              value={stats.totalMembers}
              icon="bi-people-fill"
              iconColor="#3b82f6"
              subtitle="Active members"
              badge={{
                text: stats.memberGrowthRate
                  ? `${stats.memberGrowthRate > 0 ? "+" : ""}${stats.memberGrowthRate}%`
                  : "+0%",
                variant: stats.memberGrowthRate >= 0 ? "success" : "warning",
              }}
              onClick={() => navigate("/admin/members")}
            />
          </div>

          <div className="animate-up" style={{ animationDelay: "200ms" }}>
            <DashboardStatCard
              title="Today's Registrations"
              value={stats.todayRegistrations}
              icon="bi-pencil-square"
              iconColor="#10b981"
              subtitle="vs yesterday"
              badge={{
                text: stats.registrationRate
                  ? `${stats.registrationRate > 0 ? "+" : ""}${stats.registrationRate}%`
                  : "+0%",
                variant: stats.registrationRate >= 0 ? "success" : "warning",
              }}
            />
          </div>

          <div className="animate-up" style={{ animationDelay: "300ms" }}>
            <DashboardStatCard
              title="Ongoing Events"
              value={stats.ongoingEvents}
              icon="bi-activity"
              iconColor="#06b6d4"
              subtitle="Active right now"
              badge={{
                text: `${stats.ongoingEvents} live`,
                variant: "info",
              }}
              onClick={() => navigate("/admin/events")}
            />
          </div>

          <div className="animate-up" style={{ animationDelay: "400ms" }}>
            <DashboardStatCard
              title="Upcoming Events"
              value={stats.upcomingEvents}
              icon="bi-calendar-check-fill"
              iconColor="#f59e0b"
              subtitle="Future events"
              badge={{
                text: "Scheduled",
                variant: "warning",
              }}
              onClick={() => navigate("/admin/events")}
            />
          </div>

          <div className="animate-up" style={{ animationDelay: "500ms" }}>
            <DashboardStatCard
              title="Total Events"
              value={stats.totalEvents}
              icon="bi-calendar-event"
              iconColor="#8b5cf6"
              subtitle="Created events"
              badge={{
                text: "All time",
                variant: "primary",
              }}
              onClick={() => navigate("/admin/events")}
            />
          </div>
        </div>

        {/* Second Row: Engagement Metrics & Upcoming Event */}
        <div className="row g-4 mb-4">
          <div
            className={`col-12 ${latestEvent ? "col-lg-8" : "col-lg-12"} animate-up`}
            style={{ animationDelay: "600ms" }}
          >
            <DashboardEngagementMetrics
              stats={stats}
              topPerformers={topPerformers}
            />
          </div>

          {latestEvent && (
            <div
              className="col-12 col-lg-4 animate-up"
              style={{ animationDelay: "650ms" }}
            >
              <DashboardUpcomingEvent latestEvent={latestEvent} />
            </div>
          )}
        </div>

        {/* Third Row: Ongoing Requirements & Recent Activity */}
        <div className="row g-4">
          <div
            className="col-12 col-lg-8 animate-up"
            style={{ animationDelay: "700ms" }}
          >
            <DashboardOngoingRecruitments
              ongoingRecruitments={ongoingRecruitments}
            />
          </div>

          <div
            className="col-12 col-lg-4 animate-up"
            style={{ animationDelay: "750ms" }}
          >
            <DashboardRecentActivity
              activities={enhancedRecentActivity}
              systemHealth={systemHealth}
              loading={loading}
              onSync={handleSync}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;