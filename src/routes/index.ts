import express from 'express';
import authRoutes from './auth.route';
import helperRoutes from './helper.route';
import usersRoutes from './users.route';

const router = express.Router();

router.use('/', helperRoutes);
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);

export default router;
