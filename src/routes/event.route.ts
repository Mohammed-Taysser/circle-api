import express from 'express';
import controller from '../controllers/event.controller';
import authorization from '../middleware/authorization';
import validation from '../validation/event.validation';

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authorization, validation.create, controller.create);
router.patch('/:id', authorization, validation.update, controller.update);
router.delete('/:id', authorization, controller.delete);

export default router;
