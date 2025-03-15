import express from 'express';
import controller from '../controllers/subscription.controller';
import validation from '../validation/subscription.validation';
import zodValidation from '@/middleware/zod-validation.middleware';

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get(
  '/check/:email',
  zodValidation(validation.emailSubscriptionVerify),
  controller.checkSubscription
);
router.post('/', zodValidation(validation.subscription), controller.create);
router.delete('/:id', controller.delete);

export default router;
