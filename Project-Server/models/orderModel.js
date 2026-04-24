import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["COD", "Easypaisa"], required: true },
    paymentScreenshot: { type: String }, // Cloudinary URL
    paymentStatus: { type: String, enum: ["pending", "paid", "rejected"], default: "pending" },
    orderStatus: { type: String, enum: ["processing", "shipped", "delivered", "cancelled"], default: "processing" },
    shippingAddress: { type: String, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;