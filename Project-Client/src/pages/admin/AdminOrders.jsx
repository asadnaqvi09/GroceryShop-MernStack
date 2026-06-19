import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminOrders, verifyOrder } from "../../redux/features/order/orderSlice";
import { API_BASE } from "../../config/api";
import AdminLayout from "../../components/layout/AdminLayout";
import { toast } from "react-toastify";
import { RefreshCw } from "lucide-react";

function AdminOrders() {
  const dispatch = useDispatch();
  const { adminOrders, loading } = useSelector((state) => state.order);
  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [filters, setFilters] = useState({
    paymentMethod: "",
    orderStatus: "",
    paymentStatus: "",
  });

  const refetch = useCallback(() => {
    dispatch(fetchAdminOrders(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const interval = setInterval(refetch, 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    const onFocus = () => refetch();
    const onVisibility = () => {
      if (document.visibilityState === "visible") refetch();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refetch]);

  const handleVerify = async (orderId, action) => {
    setProcessing(true);
    try {
      await dispatch(verifyOrder({ orderId, action })).unwrap();
      const messages = {
        approve: "Payment approved",
        reject: "Payment rejected",
        deliver: "Order marked as delivered",
        cancel: "Order cancelled",
      };
      toast.success(messages[action] || "Order updated");
      setSelected(null);
      refetch();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Action failed");
    } finally {
      setProcessing(false);
    }
  };

  const screenshotUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
  };

  const statusBadge = (status, type) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      paid: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      processing: "bg-blue-100 text-blue-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-gray-100 text-gray-600",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${colors[status] || "bg-gray-100 text-gray-600"}`}>
        {type}: {status}
      </span>
    );
  };

  const canAct = (order) => order.paymentStatus === "pending";

  return (
    <AdminLayout title="Order Management">
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={filters.paymentMethod}
            onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="">All Payment Methods</option>
            <option value="COD">COD</option>
            <option value="Easypaisa">Easypaisa</option>
          </select>
          <select
            value={filters.paymentStatus}
            onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={filters.orderStatus}
            onChange={(e) => setFilters({ ...filters, orderStatus: e.target.value })}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="">All Order Status</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={refetch}
            disabled={loading}
            className="ml-auto flex items-center gap-2 text-sm border border-[#02B290] text-[#02B290] px-3 py-2 rounded-md hover:bg-[#02B290] hover:text-white transition disabled:opacity-60"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#02B290] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : adminOrders.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No orders match your filters.</p>
      ) : (
        <div className="space-y-4">
          {adminOrders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex flex-wrap justify-between gap-2 mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {order.user?.name} ({order.user?.email})
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString()} | #{order._id.slice(-8)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-gray-900">${order.totalAmount}</p>
                  <p className="text-xs text-gray-500 mt-1">{order.paymentMethod}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {statusBadge(order.paymentStatus, "Payment")}
                {statusBadge(order.orderStatus, "Order")}
              </div>
              <div className="text-sm text-gray-600 mb-3">{order.shippingAddress}</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {order.items.map((item, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {item.product?.name} x{item.quantity}
                  </span>
                ))}
              </div>
              {canAct(order) && (
                <div className="flex flex-wrap gap-3">
                  {order.paymentMethod === "Easypaisa" && order.paymentScreenshot && (
                    <button
                      onClick={() => setSelected(order)}
                      className="text-sm text-[#02B290] border border-[#02B290] px-3 py-1 rounded hover:bg-[#02B290] hover:text-white transition"
                    >
                      View Screenshot
                    </button>
                  )}
                  {order.paymentMethod === "Easypaisa" && (
                    <>
                      <button
                        disabled={processing}
                        onClick={() => handleVerify(order._id, "approve")}
                        className="text-sm bg-[#02B290] text-white px-4 py-1 rounded hover:bg-[#029a80] disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        disabled={processing}
                        onClick={() => handleVerify(order._id, "reject")}
                        className="text-sm bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {order.paymentMethod === "COD" && (
                    <>
                      <button
                        disabled={processing}
                        onClick={() => handleVerify(order._id, "deliver")}
                        className="text-sm bg-[#02B290] text-white px-4 py-1 rounded hover:bg-[#029a80] disabled:opacity-60"
                      >
                        Mark Delivered/Paid
                      </button>
                      <button
                        disabled={processing}
                        onClick={() => handleVerify(order._id, "cancel")}
                        className="text-sm bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 disabled:opacity-60"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">Payment Screenshot</h3>
            <img
              src={screenshotUrl(selected.paymentScreenshot)}
              alt="Payment screenshot"
              className="w-full rounded-lg border"
            />
            <div className="flex gap-3 mt-4">
              <button
                disabled={processing}
                onClick={() => handleVerify(selected._id, "approve")}
                className="flex-1 bg-[#02B290] text-white py-2 rounded-md hover:bg-[#029a80] disabled:opacity-60"
              >
                Approve
              </button>
              <button
                disabled={processing}
                onClick={() => handleVerify(selected._id, "reject")}
                className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 disabled:opacity-60"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminOrders;
