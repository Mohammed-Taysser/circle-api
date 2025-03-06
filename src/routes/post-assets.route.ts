import express from 'express';
import controller from '../controllers/post-assets.controller';
import authorization from '../middleware/authorization';

const router = express.Router({ mergeParams: true });

router.get('/', controller.getAll);
router.get('/:assetId', controller.getById);
router.post('/', authorization, controller.create);
router.patch('/:assetId', authorization, controller.update);
router.delete('/:assetId', authorization, controller.delete);

export default router;
