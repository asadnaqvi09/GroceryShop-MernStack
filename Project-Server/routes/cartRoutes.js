import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { protectedRoute } from "../middlewares/protectedRoute.js";

const router = express.Router();

router.get("/", protectedRoute, getCart);
router.post("/add", protectedRoute, addToCart);
router.put("/:productId", protectedRoute, updateCartItem);
router.delete("/:productId", protectedRoute, removeFromCart);
router.delete("/", protectedRoute, clearCart);

export default router;
