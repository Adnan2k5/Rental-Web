import express from 'express';

const router = express.Router();

import { createBooking } from '../controllers/booking.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';


router.route('/').post(verifyJWT, createBooking);

export default router;