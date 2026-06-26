import { Router } from 'express';
import * as mediaController from '../controllers/mediaController';
import { authMiddleware } from '../middleware/auth';
import { uploadMiddleware } from '../services/uploadService';

const router = Router();

router.use(authMiddleware);

router.post('/upload', uploadMiddleware.single('file'), mediaController.uploadMedia);
router.get('/', mediaController.getMedias);
router.get('/search', mediaController.searchMedia);
router.get('/:id', mediaController.getMedia);
router.put('/:id', mediaController.updateMedia);
router.delete('/:id', mediaController.deleteMedia);
router.get('/:id/download', mediaController.downloadMedia);

export default router;
