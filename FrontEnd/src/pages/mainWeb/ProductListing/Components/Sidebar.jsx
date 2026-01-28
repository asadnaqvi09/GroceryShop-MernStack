import React from "react";

function Sidebar({
  selectedCategory,
  onCategoryChange,
  onPriceChange,
  rating,
  onRatingChange,
  minPrice,
  maxPrice,
  priceRange,
}) {
  const categories = [
    { name: "Fruits & Vegetables", to: "fruit" },
    { name: "Meats & Seafood", to: "meats" },
    { name: "Breakfast & Dairy", to: "dairy" },
    { name: "Breads & Bakery", to: "bakery" },
    { name: "Beverages", to: "beverages" },
    { name: "Frozen Foods", to: "seafood" },
    { name: "Biscuits & Snacks", to: "snacks" },
    { name: "Grocery & Staples", to: "grocery&staples" },
  ];

  const ratings = [5, 4, 3, 2, 1];

  return (
    <>
      <div className="desktop hidden md:block w-64 p-6 border-r border-gray-300">
        <h2 className="font-semibold mb-3 text-[#02B290]">Shop by Category</h2>
        <div className="space-y-2 mb-6">
          {categories.map((cat) => (
            <label key={cat.to} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategory.includes(cat.to)}
                onChange={() => onCategoryChange(cat.to)}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>

        <div className="filterPrice mb-4">
          <h2 className="font-semibold mb-3 text-[#02B290]">Filter By Price</h2>
          <p className="font-bold text-gray-600 mb-2">
            Price Range{" "}
            <span className="text-gray-800 text-sm">
              ({`${minPrice} - ${maxPrice}`})
            </span>
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange[0]}
              onChange={(e) =>
                onPriceChange([Number(e.target.value), priceRange[1]])
              }
              className="w-3/4 border border-1 border-gray-100 p-2 rounded-md"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceRange[1]}
              onChange={(e) =>
                onPriceChange([priceRange[0], Number(e.target.value)])
              }
              className="w-3/4 border border-1 border-gray-100 p-2 rounded-md"
            />
          </div>
        </div>

        <h2 className="font-semibold mb-3 text-[#02B290]">Filter By Rating</h2>
        <div className="space-y-2">
          {ratings.map((r) => (
            <label key={r} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={rating.includes(r)}
                onChange={() => onRatingChange(r)}
              />
              <span>{"⭐".repeat(r)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mobile block md:hidden w-full py-2">
        <h2 className="font-semibold mb-3 text-[#02B290]">Shop by Category</h2>
        <select
          className="w-full border border-gray-300 p-2 rounded-md text-gray-700"
          value={selectedCategory[0] || ""}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.to} value={cat.to} >
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default Sidebar;
