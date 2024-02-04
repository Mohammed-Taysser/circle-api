import express from 'express';

import authRoutes from './auth.route';
import badgesRoutes from './badge.route';
import groupsRoutes from './groups.route';
import helperRoutes from './helper.route';
import postsRoutes from './posts.route';
import subscriptionRoutes from './subscription.route';
import usersRoutes from './user.route';

const router = express.Router();

router.use('/', helperRoutes);
router.use('/subscribe', subscriptionRoutes);
router.use('/auth', authRoutes);
router.use('/groups', groupsRoutes);
router.use('/users', usersRoutes);
router.use('/posts', postsRoutes);
router.use('/badges', badgesRoutes);

export default router;
