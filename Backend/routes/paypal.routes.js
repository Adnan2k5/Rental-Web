import express from 'express';
import { getSignupPage, getSuccessPage } from '../controllers/paypal.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', verifyJWT, getSignupPage);
router.post("/", verifyJWT, getSuccessPage);

export default router;
