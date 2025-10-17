import React from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {X,Trash2} from 'lucide-react'
import {
  removeProduct,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../../redux/features/cart/cartSlice";

function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.products);
  const totalPrice = useSelector((state) => state.cart.total);
  const shippingCost = 10;
  const totalWithShipping = totalPrice + shippingCost;

  const removeFromCart = (product) => {
    dispatch(removeProduct(product));
    toast.success(`${product.name} removed from cart`);
  };

  const handleIncreaseQuantity = (product) => {
    dispatch(increaseQuantity(product));
    toast.success(`${product.name} quantity increased`);
  };

  const handleDecreaseQuantity = (product) => {
    dispatch(decreaseQuantity(product));
    toast.info(`${product.name} quantity decreased`);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.warn("Cart cleared");
  };

  return (
    <section className="py-16 px-10 md:pl-64 flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-96 max-w-md bg-white border border-gray-300 rounded-lg shadow-md">
        <div className="cartTitle border-b border-gray-300 pb-4 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-md font-medium text-gray-600">Your Cart</h2>
            <p className="text-sm text-gray-600">
              There are {cartItems.length} products in your cart
            </p>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="bg-red-500 text-white text-xs px-1 py-1 rounded-full hover:bg-red-600 transition cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="productsDisplay max-h-[400px] overflow-y-auto">
          {cartItems.length > 0 ? (
            cartItems.map((product) => (
              <div
                key={product.id}
                className="productItem flex items-center justify-between p-4 border-b border-gray-100"
              >
                <div className="flex items-center">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-12 h-12 rounded-md"
                  />
                  <p className="text-sm text-gray-600">{product.name}</p>
                </div>

                <div className="flex items-center">
                  <button
                    className="bg-gray-200 text-gray-600 px-2 rounded-full justify-center cursor-pointer"
                    onClick={() => handleDecreaseQuantity(product)}
                  >
                    -
                  </button>

                  <p className="text-sm text-gray-600 mx-2">
                    {product.quantity}
                  </p>

                  <button
                    className="bg-gray-200 text-gray-600 px-2 rounded-full justify-center cursor-pointer"
                    onClick={() => handleIncreaseQuantity(product)}
                  >
                    +
                  </button>

                  <p className="text-sm text-gray-600 ml-4">
                    ${product.price * product.quantity}
                  </p>

                  <button
                    className="bg-gray-400 hover:bg-gray-600 text-white px-2 py-2 rounded-md ml-2 cursor-pointer"
                    onClick={() => removeFromCart(product)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-6">
              Your cart is empty.
            </p>
          )}
        </div>
      </div>
      <div className="totalDiv">
        <div className="w-full md:w-64 max-w-md bg-white border border-gray-300 rounded-lg shadow-md">
          <div className="totalTitle border-b border-gray-300 pb-4 p-4">
            <h2 className="text-sm font-medium text-gray-600">Cart Totals</h2>
          </div>
          <div className="totalContent p-4 mb-2 gap-2 flex flex-col">
            <div className="total flex justify-between">
              <p className="text-sm text-gray-600">Total:</p>
              <p className="text-sm text-red-600">${totalPrice.toFixed(2)}</p>
            </div>
            <div className="shipping flex justify-between">
              <p className="text-sm text-gray-600">Shipping:</p>
              <p className="text-sm text-black">${shippingCost.toFixed(2)}</p>
            </div>
            <div className="subTotal flex justify-between">
              <p className="text-sm text-gray-600">Subtotal:</p>
              <p className="text-sm text-red-600">
                ${totalWithShipping.toFixed(2)}
              </p>
            </div>
            <div className="btn-primary rounded-md w-full text-white mt-2 text-center">
              {" "}
              <NavLink to="/checkout"> Proceed to Checkout </NavLink>{" "}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;
