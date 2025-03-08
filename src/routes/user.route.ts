import express from 'express';
import { multerUpload } from '../utils/multer';
import controller from '../controllers/user.controller';
import authorization from '../middleware/authorization';
import validation from '../validation/user.validation';

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.patch(
  '/reset-password',
  authorization,
  validation.resetPassword,
  controller.resetPassword
);
router.patch(
  '/:id',
  authorization,
  validation.updateUser,
  multerUpload('users').single('avatar'),
  controller.update
);
router.delete('/:id', authorization, controller.delete);

export default router;
