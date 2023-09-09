import express from 'express';
import controller from '../controllers/subscription.controller';
import validation from '../validation/subscription.validation';

const router = express.Router();

router.get('/', controller.all);
router.post('/', validation.subscription, controller.subscribe);

export default router;
