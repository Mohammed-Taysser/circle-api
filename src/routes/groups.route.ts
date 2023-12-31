import express from 'express';
import controller from '../controllers/groups.controller';
import authorization from '../middleware/authorization';
import validation from '../validation/group.validation';
import { groupUpload } from '../utils/multer';

const router = express.Router();

router.get('/', controller.all);
router.get('/search', controller.search);
router.get('/:id', controller.view);
router.post('/', validation.create, controller.create);
router.patch('/:id', authorization, groupUpload, controller.update);
router.delete('/:id', authorization, controller.delete);

export default router;
