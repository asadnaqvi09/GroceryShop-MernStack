import React, { useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchProducts } from "../../redux/features/product/productSlice";
import ProductList from "../layout/ProductList";

function SearchPage() {
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search") || "";
  const { searchResults, searchLoading } = useSelector((state) => state.product);

  useEffect(() => {
    if (searchTerm.trim()) {
      dispatch(searchProducts(searchTerm));
    }
  }, [dispatch, searchTerm]);

  return (
    <>
      <section className="py-8 px-16">
        <div className="breadCrumb text-md text-gray-400 mb-6">
          <NavLink to="/" className="hover:text-gray-800">Home</NavLink> /{" "}
          <span className="text-gray-700">{searchTerm}</span>
        </div>

        {searchLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#02B290] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : searchResults.length > 0 ? (
          <ProductList products={searchResults} />
        ) : searchTerm.trim() ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No results found for "{searchTerm}"</p>
            <p className="text-sm text-gray-400 mt-2">Try a different search term.</p>
          </div>
        ) : (
          <p className="text-gray-500 text-lg text-center">Enter a search term to find products.</p>
        )}
      </section>
    </>
  );
}

export default SearchPage;
