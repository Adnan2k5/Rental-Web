import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Category from "../models/category.model.js";

export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});

    const lang = req.query.lang || "en";

    if (!categories) {
        throw new ApiError(404, "Categories not found");
    }

    const transformed = categories.map(cat => ({
        name: lang === 'lt' ? cat.name_li : cat.name,
        subCategories: lang === 'lt' ? cat.subCategories_li : cat.subCategories
      }));

    res.status(200).json(new ApiResponse(200, "Categories fetched successfully", transformed));
});

export const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        throw new ApiError(400, "Category name is required");
    }

    const category = await Category.create({ name });

    res.status(201).json(new ApiResponse(201, "Category created successfully", category));
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Category ID is required");
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    res.status(200).json(new ApiResponse(200, "Category deleted successfully", category));
});

export const addSubCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const { subCategory } = req.body;

    if (!categoryId || !subCategory) {
        throw new ApiError(400, "Category ID and subCategory are required");
    }

    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    if (category.subCategories.includes(subCategory)) {
        throw new ApiError(400, "Subcategory already exists");
    }

    category.subCategories.push(subCategory);
    await category.save();

    res.status(200).json({
        success: true,
        message: "Subcategory added successfully",
        data: category
    });
});

export const deleteSubCategory = asyncHandler(async (req, res) => {
    const { categoryId, subCategory } = req.params;

    if (!categoryId || !subCategory) {
        throw new ApiError(400, "Category ID and subCategory are required");
    }

    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    const index = category.subCategories.indexOf(subCategory);
    if (index === -1) {
        throw new ApiError(404, "Subcategory not found");
    }

    category.subCategories.splice(index, 1);
    await category.save();

    res.status(200).json({
        success: true,
        message: "Subcategory deleted successfully",
        data: category
    });
});