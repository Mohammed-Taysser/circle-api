import express from 'express';
import controller from '../controllers/groups.controller';
import authorization from '../middleware/authorization';
import ownerOrAdmin from '../middleware/ownerOrAdmin';
import validation from '../validation/group.validation';

const router = express.Router();

router.get('/', controller.all);
router.get('/search', controller.search);
router.get('/:id', controller.view);
router.post('/', validation.create, controller.create);
router.patch('/:id', authorization, ownerOrAdmin, controller.update);
router.delete('/:id', authorization, ownerOrAdmin, controller.delete);

export default router;
