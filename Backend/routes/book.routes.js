import express from 'express';

const router = express.Router();

import {createBooking} from '../controllers/booking.controller.js';
import {verifyJwt} from '../middlewares/auth.middleware.js';


router.route('/').post(verifyJwt, createBooking);