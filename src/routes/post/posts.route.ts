import express from 'express';
import controller from '../../controllers/post/post.controller';
import authorization from '../../middleware/authorization';
import validation from '../../validation/post.validation';
import commentRouter from './comment.route';
import postAssetsRouters from './post-assets.route';
import zodValidation from '@/middleware/zod-validation.middleware';

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:postId', controller.getById);
router.post(
  '/',
  authorization,
  zodValidation(validation.createPost),
  controller.create
);
router.patch(
  '/:postId',
  authorization,
  zodValidation(validation.updatePost),
  controller.update
);
router.delete('/:postId', authorization, controller.delete);

// Assets Routers
router.use('/:postId/assets', postAssetsRouters);

// Post Comments
router.use('/:postId/comments', commentRouter);

// router.post(
//   '/reactions/:postId',
//   validation.reaction,
//   authorization,
//   controller.react
// );

export default router;
