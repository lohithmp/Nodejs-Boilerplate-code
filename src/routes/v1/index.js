import { Router } from 'express';
import authRoute from './authRoute.js';
import imageRoute from './imageUpload.js';
import roleRoute from './roleRoute.js';

const router = Router();
router.use('/auth', authRoute);
router.use('/images', imageRoute);
router.use('/roles', roleRoute);


export default router;
