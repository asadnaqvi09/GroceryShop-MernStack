import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [], authOnly = false }) {
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error("Error parsing user data:", err);
    localStorage.removeItem("user");
  }
  if (authOnly) {
    if (user) {
      return <Navigate to="/" replace />;
    }
    return children;
  }
  if (allowedRoles.length > 0) {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }
  return children;
}

export default ProtectedRoute;