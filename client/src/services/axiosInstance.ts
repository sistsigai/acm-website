import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

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
