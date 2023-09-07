import express from 'express';
import controller from '../controllers/auth.controller';
import loginValidation from '../validation/login.validate';
import registerValidation from '../validation/register.validate';

const router = express.Router();

router.post('/register', registerValidation, controller.register);
router.post('/login', loginValidation, controller.login);

export default router;
