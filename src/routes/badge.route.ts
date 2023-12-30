import express from 'express';
import controller from '../controllers/badge.controller';
import authorization from '../middleware/authorization';
import multer from '../utils/multer';
import badgeValidation from '../validation/badge.validation';

const router = express.Router();

router.get('/', controller.all);
router.post(
  '/',
  authorization,
  multer.single('picture'),
  badgeValidation.create,
  controller.create
);
router.get('/search', controller.search);
router.get('/:id', controller.view);
router.patch(
  '/:id',
  authorization,
  multer.single('picture'),
  controller.update
);
router.delete('/:id', authorization, controller.delete);

export default router;
