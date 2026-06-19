import Cart from "../models/cartModel.js";
import Product from "../models/productModels.js";

const formatCartItems = (cart) => {
  if (!cart?.items?.length) return [];
  return cart.items
    .filter((item) => item.product)
    .map((item) => ({
      ...item.product.toObject(),
      quantity: item.quantity,
    }));
};

const getPopulatedCart = async (userId) => {
  return Cart.findOne({ user: userId }).populate(
    "items.product",
    "name price discountPrice image_url stock category rating"
  );
};

export const getCart = async (req, res) => {
  try {
    const cart = await getPopulatedCart(req.user._id);
    res.json({ success: true, data: { items: formatCartItems(cart) } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, error: "Product ID required" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const existing = cart.items.find(
        (item) => item.product.toString() === productId
      );
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }
    const populated = await getPopulatedCart(req.user._id);
    res.json({ success: true, data: { items: formatCartItems(populated) } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, error: "Invalid quantity" });
    }
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, error: "Cart not found" });
    }
    const item = cart.items.find(
      (entry) => entry.product.toString() === productId
    );
    if (!item) {
      return res.status(404).json({ success: false, error: "Item not found in cart" });
    }
    item.quantity = quantity;
    await cart.save();
    const populated = await getPopulatedCart(req.user._id);
    res.json({ success: true, data: { items: formatCartItems(populated) } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, error: "Cart not found" });
    }
    cart.items = cart.items.filter(
      (entry) => entry.product.toString() !== productId
    );
    await cart.save();
    const populated = await getPopulatedCart(req.user._id);
    res.json({ success: true, data: { items: formatCartItems(populated) } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { upsert: true }
    );
    res.json({ success: true, data: { items: [] } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
