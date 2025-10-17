import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import grocery from "../../data/product.json";
import ProductList from "../layout/ProductList";

function SearchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search")?.toLowerCase() || "";

  const results = grocery.filter((groc) =>
    groc.name.toLowerCase().includes(searchTerm)
  );
  return (
    <>
      <section className="py-8 px-16">
        <div className="breadCrumb text-md text-gray-400 mb-6">
          <NavLink to="/" className="hover:text-gray-800">Home</NavLink> /{" "}
          <span className="text-gray-700">{searchTerm}</span>
        </div>

        {results.length > 0 ? (
          <ProductList products={results} />
        ) : (
          <p className="text-gray-500 text-lg text-start md:text-center">
            ❌ Sorry Your search did not found anything for "{searchTerm}"
          </p>
        )}
      </section>
    </>
  );
}

export default SearchPage;
