import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { apiRequest } from "../../config/apiHelper";
import { clearCart } from "../../redux/features/cart/cartSlice";
import { fetchAddresses, createAddress } from "../../redux/features/address/addressSlice";

function CheckOut() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const addresses = useSelector((state) => state.address.addresses);
  const addressLoading = useSelector((state) => state.address.loading);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({ label: "", fullAddress: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [message, setMessage] = useState("");

  const allItems = useSelector((state) => state.cart.products);

  const shippingCost = 10;
  const subTotal = allItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalAmount = subTotal + shippingCost;

  useEffect(() => {
    dispatch(fetchAddresses()).then((res) => {
      if (res.payload?.length) {
        const defaultAddr = res.payload.find((a) => a.isDefault) || res.payload[0];
        setSelectedAddress(defaultAddr);
      }
    });
  }, [dispatch]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.label || !newAddress.fullAddress || !newAddress.phone) return;
    setSavingAddress(true);
    const result = await dispatch(createAddress(newAddress));
    setSavingAddress(false);
    if (createAddress.fulfilled.match(result)) {
      setSelectedAddress(result.payload);
      setShowModal(false);
      setNewAddress({ label: "", fullAddress: "", phone: "" });
      toast.success("Address saved");
    } else {
      toast.error(result.payload || "Failed to save address");
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }
    if (allItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (paymentMethod === "Easypaisa" && !screenshot) {
      toast.error("Please upload your Easypaisa payment screenshot.");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      const shippingText = `${selectedAddress.label}: ${selectedAddress.fullAddress} | ${selectedAddress.phone}`;
      const formData = new FormData();
      formData.append("shippingAddress", shippingText);
      formData.append("paymentMethod", paymentMethod);
      formData.append("totalAmount", totalAmount);
      const items = allItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
      }));
      formData.append("items", JSON.stringify(items));
      if (screenshot) formData.append("screenshot", screenshot);
      await apiRequest("/api/orders/create", { method: "POST", body: formData });
      await dispatch(clearCart()).unwrap();
      const successMsg =
        paymentMethod === "COD"
          ? "Order placed successfully! It will be delivered soon."
          : "Your payment is under review. We'll notify you once approved.";
      setMessage(successMsg);
      toast.success(successMsg);
    } catch (error) {
      const errMsg = error.message || "Failed to place order. Please try again.";
      setMessage(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-6 md:pl-64 flex flex-col md:flex-row gap-8 bg-gray-50 min-h-screen">
      <div className="w-full md:w-96 max-w-md bg-white border border-gray-200 rounded-xl shadow-lg">
        <div className="border-b border-gray-200 pb-4 p-4 flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-700">
            Select Delivery Address
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="border border-[#02B290] text-[#02B290] text-sm px-3 py-1.5 rounded-md hover:bg-[#02B290] hover:text-white transition"
          >
            + Add New
          </button>
        </div>
        <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
          {addressLoading && (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-[#02B290] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!addressLoading && addresses.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No saved addresses. Add one to continue.</p>
          )}
          {addresses.map((address) => (
            <div
              key={address._id}
              onClick={() => setSelectedAddress(address)}
              className={`border rounded-lg p-3 cursor-pointer transition ${
                selectedAddress?._id === address._id
                  ? "border-[#02B290] bg-[#e8f9f4]"
                  : "border-gray-200 hover:border-[#02B290]"
              }`}
            >
              <h3 className="text-sm font-semibold text-gray-800">
                {address.label}
                {address.isDefault && (
                  <span className="ml-2 text-xs text-[#02B290]">Default</span>
                )}
              </h3>
              <p className="text-sm text-gray-600">{address.fullAddress}</p>
              <p className="text-sm text-gray-500">{address.phone}</p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200 mt-2">
          <h2 className="text-base font-semibold text-gray-700 mb-2">
            Payment Method
          </h2>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="text-sm text-gray-700">Cash on Delivery (COD)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="Easypaisa"
                checked={paymentMethod === "Easypaisa"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="text-sm text-gray-700">Easypaisa Payment</span>
            </label>
            {paymentMethod === "Easypaisa" && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Payment Screenshot
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setScreenshot(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="checkoutItemDiv flex flex-col gap-6">
        <div className="w-full md:w-96 max-w-md bg-white border border-gray-200 rounded-xl shadow-lg">
          <div className="border-b border-gray-200 pb-4 p-4">
            <h2 className="text-md font-semibold text-gray-700">
              Your Products
            </h2>
          </div>
          <div className="products divide-y divide-gray-100 py-2 px-4">
            {allItems.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-6">Your cart is empty.</p>
            )}
            {allItems.map((product) => (
              <div key={product._id} className="flex justify-between items-center py-3">
                <div className="flex items-center gap-4">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-12 h-12 rounded-md object-cover border"
                  />
                  <div>
                    <p className="text-sm text-gray-800 text-ellipsis whitespace-nowrap overflow-hidden max-w-[160px]">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Quantity: {product.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-800">
                  $ {(product.price * product.quantity).toFixed(0)}
                </p>
              </div>
            ))}
            <div className="border-t border-gray-200 mt-3 pt-3 space-y-1 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>$ {subTotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>$ {shippingCost.toFixed(0)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 py-2">
                <span>Total:</span>
                <span>$ {totalAmount.toFixed(0)}</span>
              </div>
            </div>
            <button
              disabled={loading || allItems.length === 0}
              onClick={handleCheckout}
              className="bg-[#02B290] rounded-md w-full text-white py-2 mt-4 hover:bg-[#029a80] text-center transition disabled:opacity-60"
            >
              {loading ? "Placing Order..." : "Checkout"}
            </button>
            {message && (
              <p className={`text-center text-sm mt-3 ${message.includes("success") || message.includes("review") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Add New Address
            </h3>
            <form className="space-y-4" onSubmit={handleAddAddress}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Name (e.g., Home, Office)
                </label>
                <input
                  type="text"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#02B290] outline-none"
                  placeholder="Enter name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Address
                </label>
                <textarea
                  value={newAddress.fullAddress}
                  onChange={(e) => setNewAddress({ ...newAddress, fullAddress: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#02B290] outline-none"
                  placeholder="Enter address details"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#02B290] outline-none"
                  placeholder="+92 XXX XXXXXXX"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={savingAddress}
                className="w-full bg-[#02B290] text-white py-2 rounded-md hover:bg-[#029a80] transition disabled:opacity-60"
              >
                {savingAddress ? "Saving..." : "Save Address"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default CheckOut;
