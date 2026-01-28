import express from 'express';
import { createOrder, verifyOrder } from '../controllers/orderController.js';
import upload from '../middlewares/multer.js';
import {protectedRoute} from '../middlewares/protectedRoute.js';
const router = express.Router();

router.post('/create', protectedRoute ,upload.single('screenshot') ,createOrder);
router.post('/verify', verifyOrder);

export default router;