import { Router } from 'express';
import MobileAuthController from '../controllers/mobileAuthController';

const router = Router();

router.post('/send-otp', MobileAuthController.sendMobileOTP);
router.post('/verify-otp', MobileAuthController.verifyMobileOTP);

export default router;