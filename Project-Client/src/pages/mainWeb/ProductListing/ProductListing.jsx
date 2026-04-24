import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SideBar from "./Components/Sidebar";
import Catalogue from "./Components/Catalogue";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../redux/features/product/productSlice";

function ProductListing() {
  const { name } = useParams();
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.product);

  const [selectedCategory, setSelectedCategory] = useState(name ? [name] : []);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [rating, setRating] = useState([]);
  const [sortOption, setSortOption] = useState("");
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  useEffect(() => {
    if (name) {
      setSelectedCategory([name]);
    } else {
      setSelectedCategory([]);
    }
  }, [name]);
  useEffect(() => {
    if (products.length > 0) {
      const minPrice = Math.min(...products.map((p) => p.price));
      const maxPrice = Math.max(...products.map((p) => p.price));
      setPriceRange([minPrice, maxPrice]);
    }
  }, [products]);
  const filteredProducts = products
    .filter((p) =>
      selectedCategory.length ? selectedCategory.includes(p.category) : true
    )
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter((p) => (rating.length ? rating.includes(Math.floor(p.rating)) : true));
  if (sortOption === "priceLowHigh") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "priceHighLow") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === "ratingHighLow") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }
  const handleCategoryChange = (category) => {
    setSelectedCategory((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (range) => setPriceRange(range);
  const handleRatingChange = (value) => {
    setRating((prev) =>
      prev.includes(value)
        ? prev.filter((r) => r !== value)
        : [...prev, value]
    );
  };
  const handleSortChange = (value) => setSortOption(value);
  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

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
          minPrice={priceRange[0]}
          maxPrice={priceRange[1]}
        />
      </div>

      <div className="catalogue w-full md:w-[75%] py-1 md:py-6 px-2 border-r border-gray-200">
        <Catalogue products={filteredProducts} onSortChange={handleSortChange} />
      </div>
    </div>
  );
}

export default ProductListing;