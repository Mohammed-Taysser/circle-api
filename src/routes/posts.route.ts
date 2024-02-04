import express from 'express';
import controller from '../controllers/post.controller';
import authorization from '../middleware/authorization';
import { postUpload } from '../utils/multer';
import validation from '../validation/post.validation';

const router = express.Router();

router.get('/', controller.allPosts);
router.get('/search', controller.search);
router.get('/:id', controller.getPost);
router.post(
  '/',
  authorization,
  postUpload,
  validation.createPost,
  controller.createPost
);
router.patch('/:id', authorization, postUpload, controller.updatePost);
router.delete('/:id', authorization, controller.deletePost);

router.get('/comments/:postId', controller.getPostComments);
router.post('/comments/:postId', authorization, controller.addComment);
router.delete('/comments/:commentId', authorization, controller.deleteComment);

router.post(
  '/reactions/:postId',
  validation.reaction,
  authorization,
  controller.react
);

export default router;
