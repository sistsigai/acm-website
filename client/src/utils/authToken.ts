import axiosInstance from "../services/axiosInstance";

/* ---------------- TOKEN STORAGE ---------------- */

export const getTokenStorage = (rememberMe: boolean = false): Storage => {
  return rememberMe ? localStorage : sessionStorage;
};

/* ---------------- SET TOKEN ---------------- */

export const setAuthToken = (
  token: string,
  rememberMe: boolean = false
): void => {
  const storage = getTokenStorage(rememberMe);
  storage.setItem("adminToken", token);

  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

/* ---------------- REMOVE TOKEN ---------------- */

export const clearAuthToken = (): void => {
  localStorage.removeItem("adminToken");
  sessionStorage.removeItem("adminToken");

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
