import axiosInstance from "../services/axiosInstance";

/* ---------------- TOKEN STORAGE ---------------- */

export const getTokenStorage = (rememberMe: boolean = false): Storage => {
  return rememberMe ? localStorage : sessionStorage;
};

/* ---------------- SET TOKEN ---------------- */

export const setAuthToken = (
  token: string,
  rememberMe: boolean = true
): void => {
  if (rememberMe) {
    localStorage.setItem("adminToken", token);
  }
  sessionStorage.setItem("adminToken", token);

  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

/* ---------------- REMOVE TOKEN ---------------- */

export const clearAuthToken = (): void => {
  try {
    localStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminToken");
    
    // Clear any additional auth or admin state from storage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("admin") || key.startsWith("auth")) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("admin") || key.startsWith("auth")) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.error("Error clearing auth storage:", e);
  }

  delete axiosInstance.defaults.headers.common["Authorization"];
};

/* ---------------- GET TOKEN ---------------- */

export const getAuthToken = (): string | null => {
  return (
    sessionStorage.getItem("adminToken") ||
    localStorage.getItem("adminToken")
  );
};

/* ---------------- AUTH CHECK ---------------- */

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch {
    return false;
  }
};
