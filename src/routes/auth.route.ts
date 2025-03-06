import express from 'express';
import controller from '../controllers/auth.controller';
import authorization from '../middleware/authorization';
import validation from '../validation/auth.validation';

const router = express.Router();

router.post('/register', validation.register, controller.register);
router.post('/login', validation.login, controller.login);
router.post('/refresh-token', authorization, controller.refreshToken);
router.get('/me', authorization, controller.me);

export default router;
