import Product from "../models/productModels.js";

export const createProduct = async (req,res)=> {
  try {
    
  } catch (error) {
    
  }
}

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: "reviews",
      populate:{path:"user",select:"name email"},
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const query = req.query.q || "";
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};