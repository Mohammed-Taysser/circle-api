import express from 'express';
import controller from '../../controllers/post/comment.controller';
import authorization from '../../middleware/authorization';

const router = express.Router({ mergeParams: true });

router.get('/', controller.getAll);
router.get('/:commentId', controller.getById);
router.post('/', authorization, controller.create);
router.patch('/:commentId', authorization, controller.update);
router.delete('/:commentId', authorization, controller.delete);

export default router;
