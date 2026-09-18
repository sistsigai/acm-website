import axiosInstance from "../axiosInstance";

export type ApplicationStatus = 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';

export interface Applicant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedAt: string;
  notes?: string;
  answers: {
    questionId: string;
    question: string;
    answer: string | string[] | File[];
  }[];
}

export const getApplicationsByRecruitment = async (recruitmentId: string) => {
  try {
    const response = await axiosInstance.get(`/admin/applications/${recruitmentId}/get`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: string
) => {
  const response = await axiosInstance.put(
    `/admin/applications/${applicationId}/status`,
    { status }
  );
  return response.data;
};