import express from 'express';
import { getAllStats, getAllUsers, changeUserStatus } from '../controllers/admin.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/').get(verifyJWT, getAllStats);
router.route('/users').get(verifyJWT, getAllUsers);
router.route('/users/:userId').post(verifyJWT, changeUserStatus); 

export default router;