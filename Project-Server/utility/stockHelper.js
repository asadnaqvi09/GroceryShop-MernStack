import Product from "../models/productModels.js";

export const validateStock = async (items) => {
  const errors = [];
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      errors.push("A product in your cart is no longer available");
      continue;
    }
    if (product.stock < item.quantity) {
      errors.push(
        `Insufficient stock for ${product.name}. Only ${product.stock} left.`
      );
    }
  }
  if (errors.length > 0) {
    throw new Error(errors[0]);
  }
};

export const deductStockAtomic = async (items) => {
  for (const item of items) {
    const productId = item.product?._id || item.product;
    const updated = await Product.findOneAndUpdate(
      { _id: productId, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true }
    );
    if (!updated) {
      const product = await Product.findById(productId);
      throw new Error(
        `Insufficient stock for ${product?.name || "product"}. Stock may have changed.`
      );
    }
  }
};
