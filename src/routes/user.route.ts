import express from 'express';
import controller from '../controllers/users.controller';
import authorization from '../middleware/authorization';
import { userUpload } from '../utils/multer';
import validation from '../validation/user.validation';

const router = express.Router();

router.get('/', controller.allUsers);
router.get('/search', controller.search);
router.get('/:id', controller.getUser);
router.patch(
  '/:id',
  authorization,
  userUpload,
  validation.updateUser,
  controller.updateUser
);
router.delete('/:id', authorization, controller.deleteUser);

export default router;
