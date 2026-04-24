import Order from "../models/orderModel.js";
import Product from "../models/productModels.js";

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, shippingAddress } = req.body;
    const screenshot = req.file ? `/uploads/${req.file.filename}` : null;

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      paymentMethod,
      paymentScreenshot: screenshot,
      shippingAddress,
      paymentStatus: paymentMethod === "COD" ? "paid" : "pending",
    });
    // if COD — decrease stock immediately
    if (paymentMethod === "COD") {
      for (const item of items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    }
    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

export const verifyOrder = async (req, res) => {
  try {
    const { orderId, action } = req.body; // "approve" or "reject"

    const order = await Order.findById(orderId).populate("items.product");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (action === "approve") {
      order.paymentStatus = "paid";
      order.orderStatus = "processing";
      await order.save();

      // reduce stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity },
        });
      }
    } else if (action === "reject") {
      order.paymentStatus = "rejected";
      order.orderStatus = "cancelled";
      await order.save();
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

