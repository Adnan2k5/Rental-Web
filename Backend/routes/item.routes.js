import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getItemById, discoverItems, createItem, updateItem, deleteItem } from '../controllers/item.controller.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/discover', discoverItems);
router.get('/:id', getItemById);
router.post('/upload', verifyJWT, upload.fields([
    {
        name: 'images',
        maxCount: 5
    },
]) ,createItem);

router.put('/:id', verifyJWT, upload.fields([
    {
        name: 'images',
        maxCount: 5
    },
]), updateItem).delete(verifyJWT, deleteItem);



