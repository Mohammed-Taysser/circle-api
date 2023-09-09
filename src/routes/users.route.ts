import express from 'express';
import controller from '../controllers/users.controller';
import authorization from '../middleware/authorization';
import ownerOrAdmin from '../middleware/ownerOrAdmin';
import { cpUpload } from '../utils/multer';

const router = express.Router();

router.get('/', controller.all);
router.get('/search', controller.search);
router.get('/:id', controller.view);
router.patch('/:id', authorization, ownerOrAdmin, cpUpload, controller.update);
router.delete('/:id', authorization, ownerOrAdmin, controller.delete);

export default router;
