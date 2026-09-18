import axiosInstance from "../axiosInstance";
import { setAuthToken } from "../../utils/authToken";

export interface AdminLoginPayload {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  token?: string;
  code?: string;
  field?: string;
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, "").replace(/javascript:/gi, "").trim();
};

export const adminLogin = async (
  payload: AdminLoginPayload
): Promise<AdminLoginResponse> => {
  try {
    const sanitizedPayload = {
      username: sanitizeInput(payload.username),
      password: payload.password
    };

    const res = await axiosInstance.post(
      "/admin/auth/login",
      sanitizedPayload,
      {
        timeout: 15000,
        headers: { "Content-Type": "application/json" }
      }
    );

    const response = res.data;

    if (response.success && response.token) {
      setAuthToken(response.token, payload.rememberMe);
    }

    return response;

  } catch (error: any) {
    if (error.response) {
      const serverError = error.response.data;
      return {
        success: false,
        message: serverError.message || "Login failed",
        code: serverError.code || "SERVER_ERROR",
        field: serverError.field
      };
    } else if (error.request) {
      return {
        success: false,
        message: "Network error. Please check your internet connection.",
        code: "NETWORK_ERROR"
      };
    } else {
      return {
        success: false,
        message: error.message || "Login failed",
        code: "UNKNOWN_ERROR"
      };
    }
  }
};
