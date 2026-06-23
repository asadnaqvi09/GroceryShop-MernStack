import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/features/cart/cartSlice";
import { fetchProducts } from "../../redux/features/product/productSlice";
import ProductList from "../layout/ProductList";
import Review from "./Review";
import { Home, ShoppingCart, List } from "lucide-react";

function ProductDetails() {
  const { name, category } = useParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!products.length) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  const product = products.find(
    (item) => item.name.toLowerCase().replace(/\s+/g, "-") === name.toLowerCase()
  );

  const handleAddToCart = async () => {
    if (!product) return;
    if (!user) {
      toast.error("Please login to add to cart");
      return;
    }
    try {
      await dispatch(addProduct({ ...product, quantity })).unwrap();
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  if (loading)
    return <p className="text-center text-gray-600 py-10">Loading product...</p>;
  if (error)
    return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!product)
    return (
      <p className="text-center text-red-500 py-10 text-lg">
        Product not found.
      </p>
    );

  const relatedProducts = products
    .filter(
      (p) =>
        p.category === category &&
        p.name.toLowerCase().replace(/\s+/g, "-") !== name.toLowerCase()
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen px-6 md:px-16 py-10 text-gray-900">
      <div className="breadcrumbs flex text-md md:text-xl items-center text-center gap-2 mb-4 cursor-pointer">
        <div className="home text-gray-500 text-sm ">
          <NavLink to="/" className="hover:text-gray-600">
            <Home className="inline-block w-3 h-3 mr-1" />
            Home {" /"}
          </NavLink>
        </div>
        <div className="category text-gray-500 text-sm">
          <NavLink to={`/category/${category}`} className="hover:text-gray-600">
            <List className="inline-block w-3 h-3 mr-1" />
            {category} {" /"}
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
<<<<<<< HEAD
          <div className="mainImg md:w-[450px] w-[250px]">
=======
          <div className="mainImg  w-full md:w-[450px]">
>>>>>>> bfa6cde652ec6d8a5fe3280384a80bdb1401eccf
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-[60%] flex flex-col gap-2"
        >
          <h1 className="text-xl md:text-3xl font-semibold text-black">
            {product.name}
          </h1>
          <div className="price">
            {product.discountPrice ? (
              <div className="flex gap-3 items-center">
                <h2 className="text-3xl font-bold text-black">
                  ${product.discountPrice}
                </h2>
                <h3 className="text-gray-400 line-through text-md">
                  ${product.price}
                </h3>
              </div>
            ) : (
              <h2 className="text-3xl font-bold text-black">${product.price}</h2>
            )}
          </div>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
          <div className="flex gap-2 mt-3">
            <div className="quantity flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                className="px-3 py-1 text-center text-lg"
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
                className="px-3 py-1 text-center text-lg"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-all"
              onClick={handleAddToCart}
            >
              Add To Cart
            </motion.button>
          </div>
          <div className="categories flex gap-2 items-center mt-4">
            <h1 className="text-xl text-gray-800">Category: </h1>
            <span className="py-1 px-3 rounded-md border border-gray-400 text-gray-600 hover:bg-green-500 hover:text-white cursor-pointer">
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
              className={`pb-2 font-medium capitalize transition-all ${activeTab === tab
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
              <h3 className="text-lg font-semibold mb-3">Product Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
          {activeTab === "reviews" && (
            <Review productId={product._id} />
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
