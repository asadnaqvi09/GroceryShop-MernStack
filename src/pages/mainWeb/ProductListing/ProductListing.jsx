import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SideBar from "./Components/Sidebar";
import Catalogue from "./Components/Catalogue";
import products from "../../../data/product.json";

function ProductListing() {
  const { name } = useParams();
  const minPrice = Math.min(...products.map((p) => p.price));
  const maxPrice = Math.max(...products.map((p) => p.price));
  const [selectedCategory, setSelectedCategory] = useState(name ? [name] : []);
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [rating, setRating] = useState([]);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    if (name) {
      setSelectedCategory([name]);
    }
  }, [name]);

  const handleCategoryChange = (category) => {
    setSelectedCategory((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handlePriceChange = (range) => setPriceRange(range);

  const handleRatingChange = (value) => {
    setRating((prev) =>
      prev.includes(value) ? prev.filter((r) => r !== value) : [...prev, value]
    );
  };

  const handleSortChange = (value) => setSortOption(value);

  const filteredProducts = products
    .filter((p) => (selectedCategory.length ? selectedCategory.includes(p.category) : true))
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter((p) => (rating.length ? rating.includes(p.rating) : true));

  if (sortOption === "priceLowHigh") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "priceHighLow") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === "ratingHighLow") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="flex flex-col md:flex-row gap-2 px-4">
      <div className="sideBar w-full md:w-1/4 py-4 md:py-8 px-4">
        <SideBar
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          priceRange={priceRange}
          onPriceChange={handlePriceChange}
          rating={rating}
          onRatingChange={handleRatingChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </div>
      <div className="catalogue w-full md:w-[75%] py-1 md:py-6 px-2 border-r border-gray-200">
        <Catalogue products={filteredProducts} onSortChange={handleSortChange} />
      </div>
    </div>
  );
}

export default ProductListing;