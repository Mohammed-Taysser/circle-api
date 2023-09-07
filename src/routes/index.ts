import express from 'express';
import authRoutes from './auth.route';
import helperRoutes from './helper.route';

const router = express.Router();

// api routes
router.use('/', helperRoutes);
router.use('/auth', authRoutes);

export default router;
