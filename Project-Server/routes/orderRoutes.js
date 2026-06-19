import express from 'express';
import { createOrder, verifyOrder, getMyOrders, getAdminOrders, getAdminStats } from '../controllers/orderController.js';
import upload from '../middlewares/multer.js';
import { protectedRoute, isAdmin } from '../middlewares/protectedRoute.js';

const router = express.Router();

router.post('/create', protectedRoute, upload.single('screenshot'), createOrder);
router.get('/my-orders', protectedRoute, getMyOrders);
router.get('/admin/all', protectedRoute, isAdmin, getAdminOrders);
router.get('/admin/stats', protectedRoute, isAdmin, getAdminStats);
router.post('/verify', protectedRoute, isAdmin, verifyOrder);

export default router;
