import express from 'express';
import controller from '../controllers/auth.controller';
import authorization from '../middleware/authorization';
import validation from '../validation/auth.validation';

const router = express.Router();

router.post('/register', validation.register, controller.register);
router.post('/login', validation.login, controller.login);
router.post('/refresh-token', authorization, controller.refreshToken);

export default router;
