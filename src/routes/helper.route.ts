import express from 'express';
import swaggerUi from 'swagger-ui-express';
import controller from '../controllers/helper.controller';
import swaggerDocument from '../core/swagger.json';

const router = express.Router();

router.get('/health-check', controller.healthCheck);
router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerDocument));

export default router;
