import express from 'express';
import controller from '../controllers/badge.controller';
import authorization from '../middleware/authorization';
import badgeValidation from '../validation/badge.validation';
import { createMulterUpload } from '../utils/multer';
import zodValidationMiddleware from '@/middleware/zod-validation.middleware';

const router = express.Router();

router.get('/', controller.getAll);
router.post(
  '/',
  authorization,
  zodValidationMiddleware(badgeValidation.create),
  controller.create
);
router.get('/:id', controller.getById);
router.patch(
  '/:id',
  authorization,
  zodValidationMiddleware(badgeValidation.update),
  createMulterUpload('image').single('logo'),
  controller.update
);
router.delete('/:id', authorization, controller.delete);

export default router;
