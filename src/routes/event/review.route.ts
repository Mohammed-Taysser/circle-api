import express from 'express';
import controller from '../../controllers/event/review.controller';
import authorization from '../../middleware/authorization';

const router = express.Router({ mergeParams: true });

router.get('/', controller.getAll);
router.get('/:reviewId', controller.getById);
router.post('/', authorization, controller.create);
router.patch('/:reviewId', authorization, controller.update);
router.delete('/:reviewId', authorization, controller.delete);

export default router;
