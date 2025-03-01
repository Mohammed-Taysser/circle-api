import express from 'express';
import controller from '../controllers/post.controller';
import authorization from '../middleware/authorization';
import validation from '../validation/post.validation';

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authorization, validation.createPost, controller.create);
router.patch('/:id', authorization, controller.update);
router.delete('/:id', authorization, controller.delete);

// router.get('/comments/:postId', controller.getPostComments);
// router.post('/comments/:postId', authorization, controller.addComment);
// router.delete('/comments/:commentId', authorization, controller.deleteComment);

// router.post(
//   '/reactions/:postId',
//   validation.reaction,
//   authorization,
//   controller.react
// );

export default router;
