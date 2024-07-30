import { Router } from 'express';
import catchAsync from '../../utils/catchAsync.js';
import validate from '../../middlewares/validate.js';
import authValidation from '../../validations/authValidations.js';
import authController from '../../controllers/authController.js';

const router = Router();
router.post('/signup', authController.signup);
router.post('/signin', validate(authValidation.signin), catchAsync(authController.signin));

export default router;
