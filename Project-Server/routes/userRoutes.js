import express from 'express';
import { loginUser, registerUser, logoutUser, verifyOTP, forgotPassword, resetPassword, resendOTP, verifyResetOTP, resendResetOTP } from '../controllers/userController.js';
import { protectReset } from '../utility/resetToken.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/resend-reset-otp', resendResetOTP);
router.post('/reset-password', protectReset, resetPassword);
router.post('/logout', logoutUser);

export default router;
