import React, { useEffect, useState } from "react";
import { motion as m, type Variants } from "framer-motion";
import AdminLayout from "../../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import {
  getDashboardData,
  syncDashboard,
  type DashboardResponse,
  type Activity,
} from "../../services/admin/dashboardService";
import DashboardStatCard from "../../components/Admin/Dashboard/DashboardStatCard";
import DashboardEngagementMetrics from "../../components/Admin/Dashboard/DashboardEngagementMetrics";
import DashboardUpcomingEvent from "../../components/Admin/Dashboard/DashboardUpcomingEvent";
import DashboardRecentActivity from "../../components/Admin/Dashboard/DashboardRecentActivity";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

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

  const { stats, latestEvent, topPerformers, systemHealth } =
    dashboardData;

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
    <AdminLayout
      active="Dashboard"
      loading={loading}
      toast={error ? { show: true, variant: "error", message: error, title: "Something went wrong" } : undefined}
      onCloseToast={() => setError(null)}
    >
      <m.div
        className="mobile-offset"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <m.div
          className="mb-4"
          variants={itemVariants}
          style={{ position: "relative", zIndex: 100 }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <h2 className="fw-bold text-white mb-1">
                Welcome Back, Admin
              </h2>
              <p className="text-secondary m-0">
                Here's what's happening with your chapter today.
              </p>
            </div>

            {/* System Health Badges */}
            <div className="d-flex align-items-center gap-2 header-actions">
              <div className="admin-header-pill">
                <span className={`status-dot ${systemHealth.apiStatus}`}></span>
                <span className="small fw-medium">API: {systemHealth.apiStatus}</span>
              </div>

              <div className="admin-header-pill">
                <span className={`status-dot ${systemHealth.dbStatus}`}></span>
                <span className="small fw-medium">DB: {systemHealth.dbStatus}</span>
              </div>
            </div>
          </div>
        </m.div>

        {/* Stats Grid */}
        <div className="admin-stats-grid">
          <m.div variants={itemVariants}>
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
          </m.div>

          <m.div variants={itemVariants}>
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
          </m.div>

          <m.div variants={itemVariants}>
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
              onClick={() => navigate("/admin/eventmanager")}
            />
          </m.div>

          <m.div variants={itemVariants}>
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
              onClick={() => navigate("/admin/eventmanager")}
            />
          </m.div>

          <m.div variants={itemVariants}>
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
              onClick={() => navigate("/admin/eventmanager")}
            />
          </m.div>
        </div>

        {/* Second Row: Engagement Metrics & Upcoming Event */}
        <div className="row g-4 mb-4">
          <m.div
            className={`col-12 ${latestEvent ? "col-lg-8" : "col-lg-12"}`}
            variants={itemVariants}
          >
            <DashboardEngagementMetrics
              stats={stats}
              topPerformers={topPerformers}
            />
          </m.div>

          {latestEvent && (
            <m.div
              className="col-12 col-lg-4"
              variants={itemVariants}
            >
              <DashboardUpcomingEvent latestEvent={latestEvent} />
            </m.div>
          )}
        </div>

        {/* Third Row: Recent Activity & System Health */}
        <div className="row g-4">
          <m.div
            className="col-12"
            variants={itemVariants}
          >
            <DashboardRecentActivity
              activities={enhancedRecentActivity}
              systemHealth={systemHealth}
              loading={loading}
              onSync={handleSync}
            />
          </m.div>
        </div>
      </m.div>
    </AdminLayout>
  );
};

export default Dashboard;