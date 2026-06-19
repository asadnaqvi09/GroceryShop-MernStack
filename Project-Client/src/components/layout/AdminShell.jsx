import React from "react";
import AdminNavbar from "./AdminNavbar";

function AdminShell({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      {children}
    </div>
  );
}

export default AdminShell;
