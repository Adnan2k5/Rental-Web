import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { 
    getUser,
    getUserById,
    getUserBookings,
    getUserReviews,
    getBookingDetailsById,
    getReviewDetailsById,
    updateReviewById,
    deleteReviewById,
    updateUser,
    updateProfilePicture,
    updateProfileBanner
} from '../controllers/user.controller.js';
import { reviewItem } from '../controllers/item.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.get('/me', verifyJWT, getUser);
router.get('/me/:id', verifyJWT, getUserById);

router.get('/bookings', verifyJWT, getUserBookings);
router.get('/bookings/:id', verifyJWT, getBookingDetailsById);

router.get('/reviews', verifyJWT, getUserReviews);

router.put('/update/:id', verifyJWT, updateUser);
router.put('/update-profile-picture', verifyJWT, upload.single('profilePicture'), updateProfilePicture);
router.put('/update-profile-banner', verifyJWT, upload.single('profileBanner'), updateProfileBanner);

router.route('/reviews/:id')
    .get(verifyJWT, getReviewDetailsById)
    .put(verifyJWT, updateReviewById)
    .delete(verifyJWT, deleteReviewById)
    .post(verifyJWT, reviewItem);
export default router;