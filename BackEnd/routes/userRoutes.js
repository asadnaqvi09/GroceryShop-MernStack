import express from 'express';
import { loginUser,registerUser, logoutUser, verifyOTP,forgotPassword,resetPassword, resendOTP, verifyResetOTP} from '../controllers/userController.js';
const router = express.Router();


router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password',resetPassword);
router.post('/logout', logoutUser)

export default router;