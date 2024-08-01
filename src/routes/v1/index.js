import { Router } from 'express';
import authRoute from './authRoute.js';
import imageRoute from './imageUpload.js';

const router = Router();
router.use('/auth', authRoute);
router.use('/images', imageRoute);

export default router;
