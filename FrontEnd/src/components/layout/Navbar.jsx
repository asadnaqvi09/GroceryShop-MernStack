import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const navLinks = [
    { id: 1, name: "Fruit & Vegetables", to: "fruit" },
    { id: 2, name: "Meats & Seafood", to: "meats" },
    { id: 3, name: "Breakfast & Dairy", to: "dairy" },
    { id: 4, name: "Breads & Bakery", to: "bakery" },
    { id: 5, name: "Beverages", to: "beverages" },
    { id: 6, name: "Frozen Foods", to: "seafood" },
    { id: 7, name: "Biscuits & Snacks", to: "snacks" },
    { id: 8, name: "Grocery & Staples", to: "grocery&staples" },
  ];

  return (
    <>
      <div className="hidden md:flex items-center gap-4.5 py-2 px-16 border-b border-gray-200">
        {navLinks.map((link) => (
          <div key={link.id}>
            <NavLink
              to={`/category/${link.to}`}
              className={({ isActive }) =>
                `no-underline h-full flex items-center py-2 transition-all duration-300 ease-in-out ${
                  isActive
                    ? "text-[#02B290] font-normal text-md"
                    : "text-gray-600 font-normal hover:text-[#02B290] text-md "
                }`
              }
            >
              {link.name}
            </NavLink>
          </div>
        ))}
      </div>
      <div className="md:hidden border-b border-gray-200 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-4 px-4 py-2 whitespace-nowrap">
          {navLinks.map((link) => (
            <NavLink
              key={link.id}
              to={`/category/${link.to}`}
              className={({ isActive }) =>
                `no-underline px-2 py-1 transition-all duration-300 ease-in-out ${
                  isActive
                    ? "text-[#02B290] font-normal"
                    : "text-gray-600 font-normal"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}
export default Navbar;