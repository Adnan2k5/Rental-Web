import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getItemById, discoverItems, createItem, updateItem, deleteItem, getItemByUserId, getTopReviewedItems } from '../controllers/item.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.get('/discover', discoverItems);
router.get('/top-reviewed', getTopReviewedItems);
router.post('/upload', verifyJWT, upload.fields([
    {
        name: 'images',
        maxCount: 5
    },
]), createItem);
router.get('/user/:userId', getItemByUserId);

router.route('/:id')
    .get(getItemById)
    .put(verifyJWT, upload.fields([
        {
            name: 'images',
            maxCount: 5
        },
    ]), updateItem)
    .delete(verifyJWT, deleteItem);
    
export default router;



