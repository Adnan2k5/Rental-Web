import express from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/admin.controller.js';

const adminRoute = express.Router();

adminRoute.route('/category').get(getCategories).post(createCategory).delete(deleteCategory);

export default adminRoute;