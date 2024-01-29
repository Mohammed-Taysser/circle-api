import express from 'express';
import controller from '../controllers/groups.controller';
import authorization from '../middleware/authorization';
import validation from '../validation/group.validation';
import { groupUpload } from '../utils/multer';

const router = express.Router();

router.get('/', controller.allGroups);
router.get('/search', controller.search);
router.get('/:id', controller.getGroup);
router.post('/', groupUpload, validation.create, controller.createGroup);
router.patch('/:id', authorization, groupUpload, controller.updateGroup);
router.delete('/:id', authorization, controller.deleteGroup);

export default router;
