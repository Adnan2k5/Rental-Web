import express from 'express';
import { getSignupPage } from '../controllers/paypal.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', verifyJWT, getSignupPage);

export default router;
