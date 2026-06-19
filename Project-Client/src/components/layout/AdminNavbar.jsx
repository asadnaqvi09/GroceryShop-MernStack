import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/features/auth/authSlice";
import { resetCartLocal } from "../../redux/features/cart/cartSlice";
import { User, LogOut, Globe } from "lucide-react";

function AdminNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogOut = () => {
    dispatch(logoutUser());
    dispatch(resetCartLocal());
    localStorage.removeItem("user");
    localStorage.removeItem("persist:root");
    setIsDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4 md:px-6">
      <Link to="/admin/dashboard" className="text-lg font-bold text-[#02B290]">
        Bazaarly Admin
      </Link>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#02B290] cursor-pointer"
        >
          <User size={22} />
          <span className="hidden sm:inline text-sm font-medium truncate max-w-[160px]">
            {user?.name || user?.email}
          </span>
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg w-44 z-50">
            <button
              onClick={() => {
                navigate("/");
                setIsDropdownOpen(false);
              }}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-gray-600"
            >
              <Globe size={15} /> Visit Website
            </button>
            <button
              onClick={handleLogOut}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-gray-600"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default AdminNavbar;
