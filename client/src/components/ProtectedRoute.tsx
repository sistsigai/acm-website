import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, type AdminPermission } from "../context/AuthContext";
import Loader from "./Loader";

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredPermission?: AdminPermission;
  superAdminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  superAdminOnly = false,
}) => {
  const { isAuthenticated, loading, isSuperAdmin, hasPermission, getDefaultAuthorizedRoute } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center vh-100"
        style={{ background: "#111827" }}
      >
        <Loader loading={true} variant="orbit" fullscreen theme="dark" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (superAdminOnly && !isSuperAdmin) {
    return <Navigate to={getDefaultAuthorizedRoute()} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to={getDefaultAuthorizedRoute()} replace />;
  }

  return children;
};

export default ProtectedRoute;

