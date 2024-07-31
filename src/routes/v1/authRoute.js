import { Router } from 'express';
import catchAsync from '../../utils/catchAsync.js';
import validate from '../../middlewares/validate.js';
import authValidation from '../../validations/authValidations.js';
import authController from '../../controllers/authController.js';
import authenticate from '../../middlewares/authenticate.js';

const router = Router();
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/signout', validate(authValidation.signout), catchAsync(authController.signout));
router.post('/refresh-tokens', authController.refreshTokens);
router.get('/getUser', authenticate(), catchAsync(authController.getMe));


export default router;
