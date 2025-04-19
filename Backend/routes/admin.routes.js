import express from 'express';
import { getAllStats } from '../controllers/admin.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/').get(verifyJWT, getAllStats);

export default router;