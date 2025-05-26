import express from 'express';

const router = express.Router();

import { createBooking, approveBooking } from '../controllers/booking.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';


router.route('/').post(verifyJWT, createBooking);
router.route('/approve/:id').get(verifyJWT,approveBooking);

export default router;