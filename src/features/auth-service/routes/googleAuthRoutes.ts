import { Router } from 'express';
import GoogleAuthController from '../controllers/googleAuthController';

const router = Router();

router.get('/login', GoogleAuthController.googleLogin);
router.get('/callback', GoogleAuthController.googleCallback);

export default router;