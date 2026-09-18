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
  contactPersons: { name: string; phone: string }[];
  totalRegistrations: number;
}

export interface OngoingRecruitment {
  _id: string;
  title: string;
  role: string;
  createdAt: string;
  applicantCount: number;
  deadline?: string;
}

export interface Activity {
  _id: string;
  type:
  | 'member_joined'
  | 'event_created'
  | 'recruitment_opened'
  | 'contact_message';
  title: string;
  subtitle: string;
  time: string;
  isRead?: boolean;
}

export interface TopPerformers {
  topEvent: { name: string; registrations: number; } | null;
  topRecruitment: { title: string; applicants: number; } | null;
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
  ongoingRecruitments: OngoingRecruitment[];
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

export const markContactAsRead = async (id: string) => {
  try {
    const res = await axiosInstance.patch(
      `/admin/dashboard/contact/${id}/read`
    );
    return res.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || "Failed to update message"
    );
  }
};