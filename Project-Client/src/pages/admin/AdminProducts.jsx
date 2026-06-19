import React, { useEffect, useState } from "react";
import { apiRequest } from "../../config/apiHelper";
import AdminLayout from "../../components/layout/AdminLayout";
import { toast } from "react-toastify";
import { X } from "lucide-react";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    stock: "",
    image: null,
  });

  const fetchProducts = async () => {
    try {
      const data = await apiRequest("/api/products");
      setProducts(data.products);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", discountPrice: "", category: "", stock: "", image: null });
    setPreview(null);
    setEditing(null);
    setShowForm(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!showForm) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") resetForm();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showForm]);

  const handleEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || "",
      category: product.category,
      stock: product.stock,
      image: null,
    });
    setPreview(product.image_url);
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing && !form.image) {
      toast.error("Product image is required");
      return;
    }
    setSaving(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    if (form.discountPrice) formData.append("discountPrice", form.discountPrice);
    formData.append("category", form.category);
    formData.append("stock", form.stock);
    if (form.image) formData.append("image", form.image);
    try {
      if (editing) {
        await apiRequest(`/api/products/${editing._id}`, { method: "PUT", body: formData });
        toast.success("Product updated");
      } else {
        await apiRequest("/api/products", { method: "POST", body: formData });
        toast.success("Product created");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await apiRequest(`/api/products/${id}`, { method: "DELETE" });
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  return (
    <AdminLayout title="Manage Products">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-[#02B290] text-white px-4 py-2 rounded-md text-sm hover:bg-[#029a80]"
        >
          + Add Product
        </button>
      </div>
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) resetForm();
          }}
        >
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={resetForm}
              aria-label="Close"
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {editing ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#02B290] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#02B290] outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#02B290] outline-none"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price ($)</label>
                  <input
                    type="number"
                    value={form.discountPrice}
                    onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#02B290] outline-none"
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-gray-400 mt-1">Must be less than price</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#02B290] outline-none"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
                {preview && (
                  <img src={preview} alt="Preview" className="w-24 h-24 rounded-lg object-cover border mt-2" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#02B290] outline-none"
                  required
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#02B290] text-white px-6 py-2 rounded-md text-sm hover:bg-[#029a80] disabled:opacity-60"
                >
                  {saving ? "Saving..." : editing ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-gray-300 px-6 py-2 rounded-md text-sm text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#02B290] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No products yet. Add your first product.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 text-gray-600">Product</th>
                <th className="text-left p-3 text-gray-600">Category</th>
                <th className="text-left p-3 text-gray-600">Price</th>
                <th className="text-left p-3 text-gray-600">Stock</th>
                <th className="text-left p-3 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-gray-100">
                  <td className="p-3 flex items-center gap-2">
                    <img src={p.image_url} alt={p.name} className="w-8 h-8 rounded object-cover" />
                    {p.name}
                  </td>
                  <td className="p-3 capitalize">{p.category}</td>
                  <td className="p-3">${p.price}</td>
                  <td className={`p-3 ${p.stock <= 5 ? "text-red-600 font-medium" : ""}`}>{p.stock}</td>
                  <td className="p-3">
                    <button onClick={() => handleEdit(p)} className="text-[#02B290] mr-3 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:underline">Delete</button>
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

export default AdminProducts;
