import express from 'express';

import helperRoutes from './helper.route';


const router = express.Router();

router.use('/', helperRoutes);


export default router;
