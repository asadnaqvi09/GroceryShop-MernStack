import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addProduct } from "../../redux/features/cart/cartSlice";
import ProductList from '../layout/ProductList'
import grocery from "../../data/product.json";
import { NavLink } from 'react-router-dom'
import { Home, ShoppingCart, List } from 'lucide-react'

function ProductDetails() {
  const { name,category } = useParams();
  const product = grocery.find(
    (item) =>
      item.name.toLowerCase().replace(/\s+/g, "-") ===
      name.toLowerCase()
  );
  const relatedProducts = grocery.filter((cat)=> cat.category === category && cat.name.toLowerCase().replace(/\s+/g, "-") !== name.toLowerCase()).slice(0,3);
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const addToCart = () => {
    dispatch(addProduct({ ...product, quantity: 1 }));
    toast.success(`${product.name} added to cart`);
  };

  if (!product) {
    return (
      <p className="text-red-500 text-center mt-10 text-lg">
        Product not found.
      </p>
    );
  }

  return (
    <div className="min-h-screen px-6 md:px-16 py-10 bg-transparent text-gray-900">
      <div className="breadcrumbs flex text-md md:text-xl items-center text-center gap-2 mb-4 cursor-pointer">
        <div className="home text-gray-500 text-sm mb-2 md:mb-4">
          <NavLink to="/" className="hover:text-gray-600">
            <Home className="inline-block w-3 h-3 mr-1" />
            Home {" "} /
          </NavLink>
        </div>
        <div className="category text-gray-500 text-sm">
          <NavLink to={`/category/${category}`} className="hover:text-gray-600">
            <List className="inline-block w-3 h-3 mr-1" />
            {category} {" "} /
          </NavLink>
        </div>
        <div className="productName text-black text-sm">
          <ShoppingCart className="inline-block w-3 h-3 mr-1" />
          {name}
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-start gap-10 mb-4">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-[40%] flex flex-col gap-4"
        >
          <div className="mainImg w-[450px]">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full object-contain trasition-transform duration-300 hover:scale-105"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-[60%] flex flex-col gap-2"
        >
          <h1 className="text-xl md:text-3xl font-semiBold text-black">
            {product.name}
          </h1>

          <div className="price">
            {product.discountPrice ? (
              <div className="flex gap-3 items-center">
                <h2 className="text-3xl font-bold text-black">
                  {product.discountPrice}
                </h2>
                <h3 className="text-gray-400 line-through text-md">
                  {" "}
                  $ {product.price}{" "}
                </h3>
              </div>
            ) : (
              <h2 className="text-3xl font-bold text-black">
                {" "}
                ${product.price}{" "}
              </h2>
            )}
          </div>

          <div className="description">
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex gap-2">
            <div className="quatity flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                className="px-3 py-1 text-center rounded-full text-lg hover:border-gray-200"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-12 text-center outline-none bg-transparent"
              />
              <button
                className="px-3 py-1 text-center rounded-full text-lg hover:border-gray-200"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>

            <div className="addCart">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
                onClick={addToCart}
              >
                Add To Cart
              </motion.button>
            </div>
          </div>

          <div className="categories flex gap-2 items-center">
            <h1 className="text-xl text-medium text-gray-800">Category : </h1>{" "}
            <span className="py-1 px-3 rounded-md bg-transparent border-1 border-gray-400 text-center text-gray-600 hover:bg-[#02B290] hover:text-white cursor-pointer">
              {product.category}
            </span>
          </div>
        </motion.div>
      </div>
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-md p-8">
        <div className="flex border-b border-gray-300 mb-6 space-x-6">
          {["description", "reviews"].map((tab) => (
            <button
              key={tab}
              className={`pb-2 font-medium capitalize transition-all ${
                activeTab === tab
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-green-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === "description" && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Product Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description} Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Nulla facilisi. Integer luctus tincidunt eros,
                ut volutpat mi blandit ac.
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Customer Reviews</h3>
              <p className="text-gray-500 mb-4">
                No reviews yet — be the first to write one!
              </p>
              <textarea
                className="w-full border rounded-lg p-3 bg-white/40 focus:ring-2 focus:ring-green-400 outline-none"
                placeholder="Write your review..."
              ></textarea>
              <button className="mt-3 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-all">
                Submit Review
              </button>
            </div>
          )}
        </motion.div>
      </div>
      <div className="relatedProducts mt-8">
        <h1 className="text-xl md:text-2xl text-black mb-8">Related Products</h1>
        <ProductList products={relatedProducts} />
      </div>
    </div>
  );
}

export default ProductDetails;
