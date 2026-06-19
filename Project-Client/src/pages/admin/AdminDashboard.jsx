import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, NavLink } from "react-router-dom";
import { fetchAdminStats } from "../../redux/features/order/orderSlice";
import AdminLayout from "../../components/layout/AdminLayout";
import { Package, ShoppingBag, AlertTriangle } from "lucide-react";

function AdminDashboard() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { stats, statsLoading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch, location.pathname]);

  useEffect(() => {
    const interval = setInterval(() => dispatch(fetchAdminStats()), 60000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="text-[#02B290]" size={22} />
            <p className="text-sm text-gray-500">Total Orders</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {statsLoading ? "—" : stats?.totalOrders ?? 0}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Package className="text-yellow-500" size={22} />
            <p className="text-sm text-gray-500">Pending Payments</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {statsLoading ? "—" : stats?.pendingPayments ?? 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">COD + Easypaisa</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="text-red-500" size={22} />
            <p className="text-sm text-gray-500">Low Stock Items</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {statsLoading ? "—" : stats?.lowStockProducts?.length ?? 0}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <NavLink
          to="/admin/products"
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-[#02B290] transition"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Products</h2>
          <p className="text-sm text-gray-500">Create, edit, and delete products</p>
        </NavLink>
        <NavLink
          to="/admin/orders"
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:border-[#02B290] transition"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Orders</h2>
          <p className="text-sm text-gray-500">Manage COD and Easypaisa orders</p>
        </NavLink>
      </div>
      {stats?.lowStockProducts?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Low Stock Alert</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-gray-600">Product</th>
                <th className="text-left p-3 text-gray-600">Category</th>
                <th className="text-left p-3 text-gray-600">Stock</th>
              </tr>
            </thead>
            <tbody>
              {stats.lowStockProducts.map((p) => (
                <tr key={p._id} className="border-t border-gray-100">
                  <td className="p-3 flex items-center gap-2">
                    <img src={p.image_url} alt={p.name} className="w-8 h-8 rounded object-cover" />
                    {p.name}
                  </td>
                  <td className="p-3 capitalize">{p.category}</td>
                  <td className={`p-3 font-medium ${p.stock <= 2 ? "text-red-600" : "text-yellow-600"}`}>
                    {p.stock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;
