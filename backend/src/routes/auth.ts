import { Router } from 'express';
import * as authController from '../controllers/authController';
import { registerValidation, loginValidation, resetPasswordValidation, handleValidationErrors } from '../middleware/validation';

const router = Router();

router.post('/register', registerValidation, handleValidationErrors, authController.register);
router.post('/login', loginValidation, handleValidationErrors, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, handleValidationErrors, authController.resetPassword);
router.post('/logout', authController.logout);

export default router;
