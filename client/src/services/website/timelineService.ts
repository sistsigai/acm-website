import axiosInstance from "../axiosInstance";

export interface TimelineItem {
  _id: string;
  year: string;
  title: string;
  description: string;
  link: string;
  order: number;
  isActive: boolean;
  achievements?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TimelineResponse {
  success: boolean;
  timeline: TimelineItem[];
  message?: string;
}

/**
 * Fetch all active timeline items for the public website
 */
export const getPublicTimeline = async (): Promise<TimelineItem[]> => {
  try {
    const response = await axiosInstance.get<TimelineResponse>("/timeline");
    if (response.data && response.data.success && Array.isArray(response.data.timeline)) {
      return response.data.timeline;
    }
    return [];
  } catch (error) {
    console.error("Error fetching public timeline items:", error);
    return [];
  }
};

/**
 * Fetch all timeline items (admin)
 */
export const getAllTimelineAdmin = async (): Promise<TimelineItem[]> => {
  const response = await axiosInstance.get<TimelineResponse>("/timeline/admin/all");
  return response.data.timeline || [];
};

/**
 * Create timeline item (admin)
 */
export const createTimelineItem = async (payload: Partial<TimelineItem>): Promise<TimelineItem> => {
  const response = await axiosInstance.post<{ success: boolean; item: TimelineItem }>("/timeline/admin", payload);
  return response.data.item;
};

/**
 * Update timeline item (admin)
 */
export const updateTimelineItem = async (id: string, payload: Partial<TimelineItem>): Promise<TimelineItem> => {
  const response = await axiosInstance.put<{ success: boolean; item: TimelineItem }>(`/timeline/admin/${id}`, payload);
  return response.data.item;
};

/**
 * Delete timeline item (admin)
 */
export const deleteTimelineItem = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/timeline/admin/${id}`);
};

/**
 * Reorder timeline items (admin)
 */
export const reorderTimelineItems = async (items: Array<{ id: string; order: number }>): Promise<void> => {
  await axiosInstance.put("/timeline/admin/reorder", { items });
};
