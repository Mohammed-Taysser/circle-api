import express from 'express';
import rateLimiter from 'express-rate-limit';
import authRoutes from './auth.route';
import badgesRoutes from './badge.route';
import eventsRoutes from './event/event.route';
import groupsRoutes from './group.route';
import helperRoutes from './helper.route';
import postsRoutes from './post/posts.route';
import subscriptionRoutes from './subscription.route';
import usersRoutes from './user.route';
import templatesRoutes from './templates.route';

const router = express.Router();

router.use('/', helperRoutes);
router.use('/templates', templatesRoutes);
router.use('/subscription', subscriptionRoutes);
router.use(
  '/auth',
  rateLimiter({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
    message:
      'Too many accounts created from this IP, please try again after an 15 minutes',
  }),
  authRoutes
);
router.use('/groups', groupsRoutes);
router.use('/users', usersRoutes);
router.use('/posts', postsRoutes);
router.use('/badges', badgesRoutes);
router.use('/events', eventsRoutes);

export default router;
