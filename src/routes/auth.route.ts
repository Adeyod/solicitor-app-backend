import express from 'express';
import {
  emailVerification,
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/email-verification', emailVerification);
router.get('/logout', logoutUser);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
