import zodValidation from '@/middleware/zod-validation.middleware';
import express from 'express';
import controller from '../controllers/auth.controller';
import authorization from '../middleware/authorization';
import validation from '../validation/auth.validation';

const router = express.Router();

router.post(
  '/register',
  zodValidation(validation.register),
  controller.register
);
router.post('/login', zodValidation(validation.login), controller.login);
router.post('/refresh-token', authorization, controller.refreshToken);
router.get('/me', authorization, controller.me);

export default router;
