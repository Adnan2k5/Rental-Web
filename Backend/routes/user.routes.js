import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { 
    getUser,
    getUserById,
    getUserBookings,
    getUserReviews,
    getBookingDetailsById,
    getReviewDetailsById,
    updateReviewById
} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/me', verifyJWT, getUser);
router.get('/me/:id', verifyJWT, getUserById);

router.get('/bookings', verifyJWT, getUserBookings);
router.get('/bookings/:id', verifyJWT, getBookingDetailsById);

router.get('/reviews', verifyJWT, getUserReviews);
router.get('/reviews/:id', verifyJWT, getReviewDetailsById)
.put(verifyJWT, updateReviewById)
.delete(verifyJWT, deleteReviewById);


export default router;