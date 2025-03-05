import express from 'express';
import controller from '../controllers/subscription.controller';
import validation from '../validation/subscription.validation';

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get(
  '/check/:email',
  validation.emailSubscriptionVerify,
  controller.checkSubscription
);
router.post('/', validation.subscription, controller.create);
router.delete('/:id', controller.delete);

export default router;
