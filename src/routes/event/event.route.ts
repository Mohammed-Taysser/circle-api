import express from 'express';
import controller from '../../controllers/event/event.controller';
import authorization from '../../middleware/authorization';
import validation from '../../validation/event.validation';
import reviewRoute from './review.route';
import zodValidationMiddleware from '@/middleware/zod-validation.middleware';

const router = express.Router();

router.get('/', controller.getAll);
router.get('/events-nearby', controller.getEventsNearby);
router.get('/distance-to-event', controller.distanceToEventByPoint);
router.get('/:eventId', controller.getById);
router.post(
  '/',
  authorization,
  zodValidationMiddleware(validation.create),
  controller.create
);
router.patch(
  '/:eventId',
  authorization,
  zodValidationMiddleware(validation.update),
  controller.update
);
router.delete('/:eventId', authorization, controller.delete);

// Event Reviews
router.use('/:eventId/reviews', reviewRoute);

export default router;
