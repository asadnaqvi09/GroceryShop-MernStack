import React from "react";
import { useSelector } from "react-redux";
function CheckOut() {
  const dummyAddresses = [
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
  ];
  const allItems = useSelector((state)=> state.cart.products);

  return (
    <section className="py-16 pl-64 flex gap-8">
      <div className="w-full md:w-96 max-w-md bg-white border border-gray-300 rounded-lg shadow-md">
        <div className="deliveryTitle border-b border-gray-300 pb-4 p-4 flex justify-between items-center">
          <h2 className="text-sm font-medium text-gray-600">
            Select Delivery Address
          </h2>
          <div className="border border-[#02B290] w-36 text-center p-2 text-sm text-[#02B290] hover:bg-[#02B290] hover:text-white cursor-pointer">
            Add New Address
          </div>
        </div>
        <div className="deliveryAddress p-4 space-y-4">
          {dummyAddresses.map((address) => (
            <div
              key={address.id}
              className="border border-gray-200 rounded-md p-3"
            >
              <h3 className="text-sm font-medium text-gray-800">
                {address.name}
              </h3>
              <p className="text-sm text-gray-600">{address.details}</p>
              <p className="text-sm text-gray-500">{address.phone}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="checkoutItemDiv flex flex-col gap-6">
        <div className="w-full md:w-96 max-w-md bg-white border border-gray-300 rounded-lg shadow-md">
          <div className="border-b border-gray-300 pb-4 p-4">
            <h2 className="text-md font-medium text-gray-600">Your Products</h2>
          </div>
          <div className="products divide-y divide-gray-200 py-2 px-4">
            {allItems.map((product) => (
              <div
                key={product.id}
                className="productItem flex justify-between items-center p-2"
              >
                <div className="flex items-center gap-6">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-12 h-12 rounded"
                  />
                  <div>
                    <p className="text-sm text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      Quantity: {product.quantity}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-800">
                    ${(product.price * product.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            <button className="btn-primary bg-[#02B290] rounded-md w-full text-white py-2 mt-4 hover:bg-[#029a80] text-center">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CheckOut;