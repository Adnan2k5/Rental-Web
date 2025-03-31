import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getItemById, discoverItems } from '../controllers/item.controller.js';

const router = express.Router();

router.get('/discover', discoverItems);
router.get('/:id', getItemById);



