import express from 'express';
import controller from '../controllers/badge.controller';
import authorization from '../middleware/authorization';
import multer from '../utils/multer';
import badgeValidation from '../validation/badge.validation';

const router = express.Router();

router.get('/', controller.allBadges);
router.post(
  '/',
  authorization,
  multer.single('picture'),
  badgeValidation.create,
  controller.createBadge
);
router.get('/search', controller.search);
router.get('/:id', controller.getBadge);
router.patch(
  '/:id',
  authorization,
  multer.single('picture'),
  controller.updateBadge
);
router.delete('/:id', authorization, controller.deleteBadge);

export default router;
