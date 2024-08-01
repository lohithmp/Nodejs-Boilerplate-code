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
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.put('/update', authenticate(), validate(authValidation.updateMe), catchAsync(authController.updateMe));
router.delete('/delete', authenticate(), catchAsync(authController.deleteMe));



export default router;
