import express from 'express';

const router = express.Router();

import controller from '../controllers/helper.controller';

router.get('/health-check', controller.healthCheck);

export default router;
