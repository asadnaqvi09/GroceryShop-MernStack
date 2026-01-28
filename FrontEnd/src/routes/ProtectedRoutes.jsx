// ✅ ProtectedRoute.jsx (Simplified and Fixed)
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

  // 🟩 Case 1: Agar page sirf unauthenticated logon (Guest) ke liye ho
  // (e.g. Login ya Register pages)
  if (authOnly) {
    if (user) {
      // 👉 Agar user login hai to use home page bhej do
      return <Navigate to="/" replace />;
    }
    // 👉 Agar user login nahi to page dikhne do
    return children;
  }

  // 🟦 Case 2: Agar page sirf login users ke liye ho (Protected pages)
  if (allowedRoles.length > 0) {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  // 🟨 Case 3: Sab kuch theek hai to child component show karo
  return children;
}

export default ProtectedRoute;