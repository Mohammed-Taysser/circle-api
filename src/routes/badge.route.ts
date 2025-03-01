import express from 'express';
import controller from '../controllers/badge.controller';
import authorization from '../middleware/authorization';
import badgeValidation from '../validation/badge.validation';

const router = express.Router();

router.get('/', controller.getAll);
router.post('/', authorization, badgeValidation.create, controller.create);
router.get('/:id', controller.getById);
router.patch('/:id', authorization, badgeValidation.update, controller.update);
router.delete('/:id', authorization, controller.delete);

export default router;
