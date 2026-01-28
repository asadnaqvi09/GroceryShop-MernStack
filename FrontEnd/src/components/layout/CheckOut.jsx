import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function CheckOut() {
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Home",
      details: "123 Main Street, Karachi, Pakistan",
      phone: "+92 300 1234567",
    },
    {
      id: 2,
      name: "Office",
      details: "45 Business Avenue, Lahore, Pakistan",
      phone: "+92 311 9876543",
    },
  ]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({ name: "", details: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const allItems = useSelector((state) => state.cart.products);

  // 👇 Shipping + Total Calculation
  const shippingCost = 10; // 10$ fixed
  const subTotal = allItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalAmount = subTotal + shippingCost;

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.details || !newAddress.phone) return;

    const updatedAddresses = [...addresses, { id: addresses.length + 1, ...newAddress }];
    setAddresses(updatedAddresses);
    setShowModal(false);
    setNewAddress({ name: "", details: "", phone: "" });
  };

  const API_URL = 'http://localhost:4000/api/orders'
  const handleCheckout = async () => {
    if (!selectedAddress) return alert("Please select a delivery address.");
    if (allItems.length === 0) return alert("Your cart is empty.");
    if (paymentMethod === "Easypaisa" && !screenshot)
      return alert("Please upload your Easypaisa payment screenshot.");

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("shippingAddress", selectedAddress.details);
      formData.append("paymentMethod", paymentMethod);
      formData.append("totalAmount", totalAmount); // 👈 include total amount

      const items = allItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
      }));
      formData.append("items", JSON.stringify(items));

      if (screenshot) formData.append("screenshot", screenshot);

      const { data } = await axios.post(`${API_URL}/create`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        setMessage(
          paymentMethod === "COD"
            ? "✅ Order placed successfully! It will be delivered soon."
            : "🕓 Your payment is under review. We’ll notify you once approved."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-6 md:pl-64 flex flex-col md:flex-row gap-8 bg-gray-50 min-h-screen">
      {/* --- Address + Payment Section --- */}
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
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => setSelectedAddress(address)}
              className={`border rounded-lg p-3 cursor-pointer transition ${
                selectedAddress?.id === address.id
                  ? "border-[#02B290] bg-[#e8f9f4]"
                  : "border-gray-200 hover:border-[#02B290]"
              }`}
            >
              <h3 className="text-sm font-semibold text-gray-800">
                {address.name}
              </h3>
              <p className="text-sm text-gray-600">{address.details}</p>
              <p className="text-sm text-gray-500">{address.phone}</p>
            </div>
          ))}
        </div>

        {/* --- Payment --- */}
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

      {/* --- Order Summary --- */}
      <div className="checkoutItemDiv flex flex-col gap-6">
        <div className="w-full md:w-96 max-w-md bg-white border border-gray-200 rounded-xl shadow-lg">
          <div className="border-b border-gray-200 pb-4 p-4">
            <h2 className="text-md font-semibold text-gray-700">
              Your Products
            </h2>
          </div>
          <div className="products divide-y divide-gray-100 py-2 px-4">
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

            {/* --- Total Section --- */}
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
              disabled={loading}
              onClick={handleCheckout}
              className="bg-[#02B290] rounded-md w-full text-white py-2 mt-4 hover:bg-[#029a80] text-center transition disabled:opacity-60"
            >
              {loading ? "Placing Order..." : "Checkout"}
            </button>

            {message && (
              <p className="text-center text-sm mt-3 text-gray-700">{message}</p>
            )}
          </div>
        </div>
      </div>

      {/* --- Add Address Modal --- */}
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
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
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
                  value={newAddress.details}
                  onChange={(e) => setNewAddress({ ...newAddress, details: e.target.value })}
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
                className="w-full bg-[#02B290] text-white py-2 rounded-md hover:bg-[#029a80] transition"
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default CheckOut;