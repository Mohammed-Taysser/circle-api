import express from 'express';
import { createMulterUpload } from '../utils/multer';
import controller from '../controllers/user.controller';
import authorization from '../middleware/authorization';
import validation from '../validation/user.validation';
import zodValidation from '@/middleware/zod-validation.middleware';

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.patch(
  '/reset-password',
  authorization,
  zodValidation(validation.resetPassword),
  controller.resetPassword
);
router.patch(
  '/:id',
  authorization,
  zodValidation(validation.updateUser),
  createMulterUpload('image').fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  controller.update
);
router.delete('/:id', authorization, controller.delete);

export default router;
