import express from "express";
import { getAddresses, createAddress, updateAddress, deleteAddress } from "../controllers/addressController.js";
import { protectedRoute } from "../middlewares/protectedRoute.js";

const router = express.Router();

router.get("/", protectedRoute, getAddresses);
router.post("/", protectedRoute, createAddress);
router.put("/:id", protectedRoute, updateAddress);
router.delete("/:id", protectedRoute, deleteAddress);

export default router;
