import express from "express";
import {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protectedRoute, isAdmin } from "../middlewares/protectedRoute.js";
import memoryUpload from "../middlewares/memoryMulter.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/category/:category", getProductsByCategory);
router.post("/", protectedRoute, isAdmin, memoryUpload.single("image"), createProduct);
router.put("/:id", protectedRoute, isAdmin, memoryUpload.single("image"), updateProduct);
router.delete("/:id", protectedRoute, isAdmin, deleteProduct);
router.get("/:id", getProductById);

export default router;
