import express from 'express';
import { getCategories, createCategory, deleteCategory, addSubCategory, deleteSubCategory } from '../controllers/category.controller.js';

const categoryRoute = express.Router();

categoryRoute.route('/').get(getCategories).post(createCategory).delete(deleteCategory);

// Add subcategory to a category
categoryRoute.post('/:categoryId/subcategories', addSubCategory);

// Delete subcategory from a category
categoryRoute.delete('/:categoryId/subcategories/:subCategory', deleteSubCategory);

export default categoryRoute;