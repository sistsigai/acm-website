import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_API_BASE_URL || (API_URL ? `${API_URL}/api` : "http://localhost:5000/api");

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  withCredentials: true,
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
axiosInstance.interceptors.request.use(
  (config) => {
    // If a bearer token exists in memory/fallback storage, include it
    const token =
      sessionStorage.getItem("adminToken") ||
      localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------------- RESPONSE INTERCEPTOR ---------------- */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
