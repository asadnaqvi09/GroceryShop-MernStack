import React from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/features/cart/cartSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navUrl = product.name
    ? product.name.toLowerCase().replace(/\s+/g, "-")
    : "product";
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add to cart");
      return;
    }
    dispatch(addProduct({ ...product, quantity: 1 }));
    toast.success(`${product.name} added to cart`);
  };
  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
      <NavLink to={`/${product.category}/${navUrl}`} className="relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-40 md:h-56 object-contain md:object-cover  transition-transform duration-300 hover:scale-105"
        />
      </NavLink>

      <div className="p-2 sm:p-3 md:p-4">
        <div className="flex flex-col gap-2">
          <h2
            className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1 hover:text-green-600 transition-all duration-300"
          >
            {product.name}
          </h2>
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            <span className="text-yellow-500">⭐</span>
            <span className="text-black">{product.rating}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm sm:text-md font-bold text-green-600">
              {product.price} $
            </span>
            {product.discountPrice && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                {product.discountPrice} $
              </span>
            )}
          </div>
          <button
            className="mt-2 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md bg-transparent border border-green-500 text-green-600 hover:text-white font-medium hover:bg-green-600 transition cursor-pointer text-sm sm:text-base"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} className="sm:w-5 sm:h-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
