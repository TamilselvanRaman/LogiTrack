import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  const userRole = user?.role?.toLowerCase();

  if (!userRole) return <Navigate to="/login" />;
  if (role && userRole !== role.toLowerCase()) return <Navigate to="/unauthorized" />;

  return children;
};

export default ProtectedRoute;
