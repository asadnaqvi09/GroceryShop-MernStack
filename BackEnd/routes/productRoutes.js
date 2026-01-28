import express from "express";
import {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  searchProducts,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProductById);

export default router;