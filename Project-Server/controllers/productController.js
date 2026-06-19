import Product from "../models/productModels.js";
import { uploadToCloudinary } from "../utility/cloudinaryHelper.js";

export const createProduct = async (req, res) => {
  try {
    const { id, name, description, price, discountPrice, category, stock, image_url } = req.body;
    const errors = [];
    if (!name || !description || !price || !category || stock === undefined) {
      errors.push("All fields are required");
    }
    if (discountPrice && Number(discountPrice) >= Number(price)) {
      errors.push("Discount price should be less than actual price");
    }
    if (Number(stock) <= 0) {
      errors.push("Stock should be greater than 0");
    }
    if (!req.file && !image_url) {
      errors.push("Product image is required");
    }
    const productId = id || `prod-${Date.now()}`;
    const existing = await Product.findOne({ id: productId });
    if (existing) errors.push("Product ID already exists");
    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: errors.join(", ") });
    }
    let finalImageUrl = image_url;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "bazaarly/products");
      finalImageUrl = result.url;
    }
    const product = await Product.create({
      id: productId,
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      category: category.toLowerCase(),
      stock: Number(stock),
      image_url: finalImageUrl,
    });
    res.status(201).json({ success: true, data: { product } });
  } catch (err) {
    console.error("Error in Creating Product Controller : ", err.message);
    return res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    const { name, description, price, discountPrice, category, stock, image_url } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) product.discountPrice = discountPrice ? Number(discountPrice) : null;
    if (category) product.category = category.toLowerCase();
    if (stock !== undefined) product.stock = Number(stock);
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "bazaarly/products");
      product.image_url = result.url;
    } else if (image_url) {
      product.image_url = image_url;
    }
    if (product.discountPrice && product.discountPrice >= product.price) {
      return res.status(400).json({ success: false, error: "Discount price should be less than actual price" });
    }
    await product.save();
    res.json({ success: true, data: { product } });
  } catch (err) {
    console.error("Error updating product:", err.message);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    res.json({ success: true, data: { message: "Product deleted" } });
  } catch (err) {
    console.error("Error deleting product:", err.message);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, data: { products } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category });
    res.json({ success: true, data: { products } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: "reviews",
      populate: { path: "user", select: "name email" },
    });
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });
    res.json({ success: true, data: { product } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const query = req.query.q || "";
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    });
    res.json({ success: true, data: { products } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
