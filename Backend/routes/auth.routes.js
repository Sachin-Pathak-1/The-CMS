import express from 'express';
import { register, login, logout, refreshSession, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
// import { getUserData } from '../services/user.service.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshSession);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
