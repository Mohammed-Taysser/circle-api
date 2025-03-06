import express from 'express';
import controller from '../controllers/post.controller';
import authorization from '../middleware/authorization';
import validation from '../validation/post.validation';

import postAssetsRouters from './post-assets.route';

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:postId', controller.getById);
router.post('/', authorization, validation.createPost, controller.create);
router.patch('/:postId', authorization, controller.update);
router.delete('/:postId', authorization, controller.delete);

// Assets Routers
router.use('/:postId/assets', postAssetsRouters);

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
