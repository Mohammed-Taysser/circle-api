import express from 'express';
import controller from '../controllers/group.controller';
import authorization from '../middleware/authorization';
import validation from '../validation/group.validation';
import { createMulterUpload } from '../utils/multer';
import zodValidation from '@/middleware/zod-validation.middleware';

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post(
  '/',
  authorization,
  zodValidation(validation.create),
  controller.create
);
router.patch(
  '/:id',
  authorization,
  createMulterUpload('image').fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  controller.update
);
router.delete('/:id', authorization, controller.delete);

export default router;
