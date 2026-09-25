import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentAdmin, adminLogin, adminLogout, type AdminLoginPayload, type AdminLoginResponse } from "../services/admin/authService";
import { clearAuthToken } from "../utils/authToken";

export interface AdminUser {
  id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  loading: boolean;
  login: (payload: AdminLoginPayload) => Promise<AdminLoginResponse>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuth = async (): Promise<boolean> => {
    try {
      const res = await getCurrentAdmin();
      if (res.success && res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
        return true;
      } else {
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (payload: AdminLoginPayload): Promise<AdminLoginResponse> => {
    const res = await adminLogin(payload);
    if (res.success) {
      if (res.user) {
        setUser(res.user);
      }
      setIsAuthenticated(true);
    }
    return res;
  };

  const logout = async (): Promise<void> => {
    try {
      await adminLogout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      clearAuthToken();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
