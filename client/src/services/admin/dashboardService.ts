import axiosInstance from "../axiosInstance";

export interface DashboardStats {
  totalMembers: number;
  totalEvents: number;
  ongoingEvents: number;
  upcomingEvents: number;
  todayRegistrations: number;
  registrationRate: number;
  memberGrowthRate: number;
}

export interface UpcomingEvent {
  _id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  contactPersons: { name: string; phone: string; role?: string }[];
  totalRegistrations: number;
}

export interface Activity {
  _id: string;
  type: 'member_joined' | 'event_created';
  title: string;
  subtitle: string;
  time: string;
}

export interface TopPerformers {
  topEvent: { name: string; registrations: number } | null;
  topRecruitment: null;
}

export interface SystemHealth {
  apiStatus: 'online' | 'offline' | 'degraded';
  dbStatus: 'connected' | 'disconnected';
  lastSync: string;
  uptime: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  latestEvent: UpcomingEvent | null;
  ongoingRecruitments: any[];
  recentActivity: Activity[];
  topPerformers: TopPerformers;
  systemHealth: SystemHealth;
}

export const getDashboardData = async (): Promise<DashboardResponse> => {
  try {
    const res = await axiosInstance.get("/admin/dashboard/getData");
    return res.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || "Failed to load dashboard"
    );
  }
};

export const syncDashboard = async () => {
  try {
    const res = await axiosInstance.post("/admin/dashboard/sync");
    return res.data;
  } catch (err: any) {
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message);
    }

    throw new Error("Dashboard sync failed");
  }
};