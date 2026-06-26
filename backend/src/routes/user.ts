import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';
import { uploadMiddleware } from '../services/uploadService';

const router = Router();

router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', uploadMiddleware.single('profileImage'), userController.updateProfile);
router.post('/change-password', userController.changePassword);
router.delete('/account', userController.deleteAccount);

export default router;
