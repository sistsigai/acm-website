/* ---------------- AUTH TOKEN UTILITIES ---------------- */
/* Auth is now handled entirely via httpOnly cookies.           */
/* This module only provides a cleanup function for logout.    */

/* ---------------- CLEAR LEGACY STORAGE ---------------- */

export const clearAuthToken = (): void => {
  try {
    // Remove any legacy token entries from previous versions
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
};
