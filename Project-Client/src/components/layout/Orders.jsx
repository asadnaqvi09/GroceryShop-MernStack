import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../../redux/features/order/orderSlice";
import { ShoppingBag } from "lucide-react";

function Orders() {
  const dispatch = useDispatch();
  const { myOrders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const statusColor = (status) => {
    if (status === "paid") return "text-green-600";
    if (status === "rejected") return "text-red-600";
    return "text-yellow-600";
  };

  return (
    <section className="py-16 px-6 md:pl-64 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#02B290] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!loading && myOrders.length === 0 && (
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No orders yet.</p>
            <p className="text-sm text-gray-400 mt-1">Your order history will appear here.</p>
          </div>
        )}
        <div className="space-y-4">
          {myOrders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-400">Order #{order._id.slice(-8)}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium capitalize ${statusColor(order.paymentStatus)}`}>
                    Payment: {order.paymentStatus}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">Status: {order.orderStatus}</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {item.product?.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-10 h-10 rounded object-cover border"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{item.product?.name || "Product"}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-700">${item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
                <span className="text-sm text-gray-600">{order.paymentMethod}</span>
                <span className="text-base font-semibold text-gray-900">${order.totalAmount}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{order.shippingAddress}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Orders;
