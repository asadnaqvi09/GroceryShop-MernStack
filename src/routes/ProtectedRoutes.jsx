import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [], authOnly = false }) {
  const user = JSON.parse(localStorage.getItem("user")); 
  // user = { role: "admin" } or { role: "user" }

  // 🔒 1. If this route is for authentication (Login/Register)
  if (authOnly && user) {
    // Redirect already logged-in user
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/"} replace />;
  }

  // 🔐 2. If route is role-protected (like /cart, /wishlist, etc.)
  if (allowedRoles.length > 0) {
    if (!user) {
      return <Navigate to="/login" replace />; // Not logged in → redirect
    }
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />; // Role not allowed → redirect home
    }
  }
  return children;
}

export default ProtectedRoute;