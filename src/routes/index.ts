import express from 'express';

import helperRoutes from './helper.route';
import authRoutes from './auth.route';


const router = express.Router();

router.use('/', helperRoutes);
router.use('/auth', authRoutes);


export default router;
