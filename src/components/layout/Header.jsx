import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/features/auth/authSlice";
import { clearCart } from '../../redux/features/cart/cartSlice'
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  X,
  LogOut,
  CircleGauge,
  ShoppingBag
} from "lucide-react";
import webLogo from "../../assets/icons/logo.png";

function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const cartQuantity = useSelector((state) => state.cart.quantity);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };
  const handleLogOut = ()=> {
    dispatch(logoutUser());
    dispatch(clearCart());
    localStorage.removeItem('user');
    localStorage.removeItem('persist:root');
    setIsDropdownOpen(false);
  }
  return (
    <header className="border-b border-gray-300 py-4 px-4 md:px-16 flex justify-between items-center mb-2 relative">
      <NavLink to="/" className="flex items-center">
        <img
          src={webLogo}
          alt="Bazaarly Logo"
          className="h-8 md:h-12 w-auto object-contain"
        />
      </NavLink>
      <form
        onSubmit={handleSearch}
        className="hidden md:block w-[550px] h-[50px] px-6 relative rounded-md bg-transparent border border-gray-300"
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full h-full outline-none border-0"
        />
        <button
          type="submit"
          className="w-10 h-10 rounded-full absolute top-[5px] right-4 z-50 flex items-center justify-center cursor-pointer hover:bg-gray-300"
        >
          <Search size={20} />
        </button>
      </form>
      <div className="flex items-center gap-4 md:gap-6">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="text-gray-600 hover:text-[#007BFF] text-xl p-1 cursor-pointer flex items-center gap-1"
            >
              <User size={22} />
              <span className="hidden md:inline text-sm text-gray-700 font-medium">
                {user.name || user.email}
              </span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg w-44 z-50 cursor-pointer">
                <div className="userName px-4 py-2 text-gray-600 font-medium flex items-center gap-2">
                  <User size={15} /> {user.name}
                </div>
                <hr className="w-full text-gray-200" />
                <button
                  onClick={() => {
                    navigate(
                      user.role === "admin" ? "/admin/dashboard" : "/"
                    );
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-gray-600"
                >
                  <CircleGauge size={15} /> Dashboard
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
        ) : (
          <div className="hidden md:block auth text-gray-700">
            <NavLink to="/login" className="hover:text-[#02B290]">
              Login
            </NavLink>{" "}
            |{" "}
            <NavLink to="/register" className="hover:text-[#02B290]">
              Register
            </NavLink>
          </div>
        )}

        <NavLink
          to="/cart"
          className="relative flex items-center gap-2 text-gray-700 hover:text-[#02B290] transition"
        >
          <ShoppingCart size={22} />
          <span className="font-medium text-sm hidden md:inline">Cart</span>
          {cartQuantity > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
              {cartQuantity}
            </span>
          )}
        </NavLink>
        <div className="md:hidden">
          <button
            onClick={() => setShowSearch(true)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200"
          >
            <Search size={20} />
          </button>
        </div>
      </div>
      {showSearch && (
        <form
          onSubmit={handleSearch}
          className="absolute top-full left-0 w-full bg-white border-t border-gray-200 p-3 flex items-center gap-2 md:hidden z-50"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md outline-none"
          />
          <button
            type="button"
            onClick={() => setShowSearch(false)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
          <button type="submit" className="p-2 rounded-full hover:bg-gray-100">
            <Search size={20} />
          </button>
        </form>
      )}
    </header>
  );
}

export default Header;