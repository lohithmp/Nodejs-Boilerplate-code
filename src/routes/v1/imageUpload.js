import { Router } from 'express';
import imageController from '../../controllers/imageController.js';
import catchAsync from '../../utils/catchAsync.js';
import authenticate from '../../middlewares/authenticate.js';
import uploadImage from '../../middlewares/imageUpload.js';

const router = Router();

router.post('/upload', authenticate(), uploadImage, catchAsync(imageController.uploadImage));

export default router;
