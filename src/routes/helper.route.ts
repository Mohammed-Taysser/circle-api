import express from 'express';
import controller from '../controllers/helper.controller';

const router = express.Router();

router.get('/health-check', controller.healthCheck);

export default router;
