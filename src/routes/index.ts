import express from 'express';
import authRoutes from './auth.route';
import groupsRoutes from './groups.route';
import helperRoutes from './helper.route';
import subscriptionRoutes from './subscription.route';
import usersRoutes from './users.route';

const router = express.Router();

router.use('/', helperRoutes);
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/groups', groupsRoutes);
router.use('/subscribe', subscriptionRoutes);

export default router;
