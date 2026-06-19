import Order from "../models/orderModel.js";
import Product from "../models/productModels.js";
import User from "../models/userModel.js";
import { validateStock, deductStockAtomic } from "../utility/stockHelper.js";
import {
  sendOrderConfirmationEmail,
  sendPaymentApprovedEmail,
  sendPaymentRejectedEmail,
  sendCodDeliveredEmail,
} from "../utility/orderEmails.js";

const parseItems = (items) => {
  let parsed = items;
  if (typeof items === "string") {
    try {
      parsed = JSON.parse(items);
    } catch {
      throw new Error("Invalid items array");
    }
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Invalid items array");
  }
  for (const item of parsed) {
    if (!item.product || !item.quantity || item.price === undefined) {
      throw new Error("Invalid item shape");
    }
  }
  return parsed;
};

export const createOrder = async (req, res) => {
  try {
    const { totalAmount, paymentMethod, shippingAddress } = req.body;
    const items = parseItems(req.body.items);
    const screenshot = req.file ? `/uploads/${req.file.filename}` : null;
    if (paymentMethod === "Easypaisa" && !screenshot) {
      return res.status(400).json({ success: false, error: "Payment screenshot required" });
    }
    await validateStock(items);
    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount: Number(totalAmount),
      paymentMethod,
      paymentScreenshot: screenshot,
      shippingAddress,
      paymentStatus: "pending",
      orderStatus: "processing",
    });
    sendOrderConfirmationEmail(req.user, order).catch((err) =>
      console.error("Order confirmation email failed:", err)
    );
    res.status(201).json({ success: true, data: { order } });
  } catch (error) {
    console.error(error);
    const clientErrors = [
      "Invalid items array",
      "Invalid item shape",
      "Insufficient stock",
      "no longer available",
    ];
    const isClient =
      clientErrors.some((m) => error.message.includes(m)) ||
      error.message.startsWith("Insufficient stock");
    res.status(isClient ? 400 : 500).json({
      success: false,
      error: isClient ? error.message : "Order creation failed",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name image_url category")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: { orders } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    const { paymentMethod, orderStatus, paymentStatus } = req.query;
    const filter = {};
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (orderStatus) filter.orderStatus = orderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("items.product", "name image_url")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: { orders } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const [totalOrders, pendingPayments, lowStockProducts] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ paymentStatus: "pending" }),
      Product.find({ stock: { $lte: 5 } })
        .select("name stock image_url category")
        .sort({ stock: 1 })
        .limit(10),
    ]);
    res.json({
      success: true,
      data: { totalOrders, pendingPayments, lowStockProducts },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const verifyOrder = async (req, res) => {
  try {
    const { orderId, action } = req.body;
    const order = await Order.findById(orderId).populate("items.product");
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    const user = await User.findById(order.user);
    if (action === "approve") {
      if (order.paymentMethod !== "Easypaisa") {
        return res.status(400).json({ success: false, error: "Invalid action for this order" });
      }
      if (order.paymentStatus !== "pending") {
        return res.status(400).json({ success: false, error: "Order already processed" });
      }
      await deductStockAtomic(order.items);
      order.paymentStatus = "paid";
      order.orderStatus = "processing";
      await order.save();
      if (user) {
        sendPaymentApprovedEmail(user, order).catch((err) =>
          console.error("Approve email failed:", err)
        );
      }
    } else if (action === "reject") {
      if (order.paymentMethod !== "Easypaisa") {
        return res.status(400).json({ success: false, error: "Invalid action for this order" });
      }
      if (order.paymentStatus !== "pending") {
        return res.status(400).json({ success: false, error: "Order already processed" });
      }
      order.paymentStatus = "rejected";
      order.orderStatus = "cancelled";
      await order.save();
      if (user) {
        sendPaymentRejectedEmail(user, order).catch((err) =>
          console.error("Reject email failed:", err)
        );
      }
    } else if (action === "deliver") {
      if (order.paymentMethod !== "COD") {
        return res.status(400).json({ success: false, error: "Invalid action for this order" });
      }
      if (order.paymentStatus !== "pending") {
        return res.status(400).json({ success: false, error: "Order already processed" });
      }
      await deductStockAtomic(order.items);
      order.paymentStatus = "paid";
      order.orderStatus = "delivered";
      await order.save();
      if (user) {
        sendCodDeliveredEmail(user, order).catch((err) =>
          console.error("COD delivered email failed:", err)
        );
      }
    } else if (action === "cancel") {
      if (order.paymentMethod !== "COD") {
        return res.status(400).json({ success: false, error: "Invalid action for this order" });
      }
      if (order.paymentStatus !== "pending") {
        return res.status(400).json({ success: false, error: "Order already processed" });
      }
      order.orderStatus = "cancelled";
      await order.save();
    } else {
      return res.status(400).json({ success: false, error: "Invalid action" });
    }
    const populated = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product", "name image_url");
    res.json({ success: true, data: { order: populated } });
  } catch (error) {
    console.error(error);
    const isStock = error.message.includes("Insufficient stock");
    res.status(isStock ? 400 : 500).json({
      success: false,
      error: isStock ? error.message : "Verification failed",
    });
  }
};
