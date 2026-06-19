import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/features/auth/authSlice";
import { resetCartLocal } from "../../redux/features/cart/cartSlice";
import { LayoutDashboard, Package, ShoppingBag, LogOut } from "lucide-react";

function AdminLayout({ children, title }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/admin/products", label: "Products", icon: <Package size={18} /> },
    { to: "/admin/orders", label: "Orders", icon: <ShoppingBag size={18} /> },
  ];
  const handleLogOut = () => {
    dispatch(logoutUser());
    dispatch(resetCartLocal());
    localStorage.removeItem("user");
    localStorage.removeItem("persist:root");
    navigate("/login");
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-56 bg-white border-r border-gray-200 z-40 hidden md:flex flex-col">
        <div className="px-4 py-4 flex-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Admin Panel</p>
          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-[#02B290] text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-[#02B290]"
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="px-4 py-4 border-t border-gray-100">
          <button
            onClick={handleLogOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-red-500 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-40 flex md:hidden">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition ${
                isActive ? "text-[#02B290]" : "text-gray-500"
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
      <main className="flex-1 pt-16 px-4 pb-24 md:pb-12 md:pl-56 md:px-6">
        <div className="max-w-6xl mx-auto">
          {title && <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>}
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
