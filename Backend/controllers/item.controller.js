import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Item } from "../models/item.model.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

export const getItemById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const item = await Item.findById(id).populate("owner", "name");

    if (!item) {
        throw new ApiError(404, "Item not found");
    }

    res.status(200).json(new ApiResponse(200, "Item fetched successfully", item));
});

export const discoverItems = asyncHandler(async (req, res) => {
    const {
        category,
        location,
        availability,
        rating,
        minPrice = 0,
        maxPrice = 99999999,
        limit = 10,
        page = 1
    } = req.query;

    // Build availability filter
    let availabilityFilter = {};
    if (availability) {
        const currentDate = new Date();
        
        if (availability === "Available Now") {
            availabilityFilter = { 
                status: "available",
                "bookings.endDate": { 
                    $lte: Date.now()
                }
            };
        } else if (availability === "Available Within 1 Week") {
            // Items that are reserved but will be available within a week
            const oneWeekLater = new Date();
            oneWeekLater.setDate(currentDate.getDate() + 7);
            
            availabilityFilter = {
                status: "available",
                // Assuming you have an endDate field in bookings
                "bookings.endDate": { 
                    $gte: currentDate,
                    $lte: oneWeekLater
                }
            };
        } else if (availability === "Coming Soon") {
            const oneWeekLater = new Date();
            oneWeekLater.setDate(currentDate.getDate() + 7);
            
            availabilityFilter = {
                $or: [
                    { 
                        status: "rented",
                        // Items that are rented but will be available after a week
                        "bookings.endDate": { $gt: oneWeekLater }
                    },
                    { 
                        status: "reserved",
                        "bookings.endDate": { $gt: oneWeekLater }
                    }
                ]
            };
        }
    }

    const items = await Item.find({
        ...(category && { category }),
        ...(location && { location }),
        ...(availability && availabilityFilter),
        ...(rating && { avgRating: { $gte: rating } }),
        price: { $gte: minPrice, $lte: maxPrice },
    })
        .populate("owner", "name")
        .populate("bookings")  // Need to populate bookings to filter by endDate
        .limit(limit * 1)
        .skip((page - 1) * limit);

    res.status(200).json(new ApiResponse(200, "Items fetched successfully", items));
});

export const createItem = asyncHandler(async (req, res) => {
    const { name, description, price, category, images, availableQuantity, location } = req.body;

    if (!name || !description || !price || !category || !images || !availableQuantity || !location) {
        throw new ApiError(400, "All fields are required");
    }

    if(!req.files || !req.files.images || req.files.images.length === 0) {
        throw new ApiError(400, "Image is required");
    }
    
    const mediasUrl = await Promise.all(req.files.images.map(async (image) => {
        const link = await uploadOnCloudinary(image.path);
        return link.url;
    }));

    const item = await Item.create({
        name,
        description,
        price,
        category,
        images: mediasUrl,
        status: "available",
        bookings: [],
        availableQuantity,
        location,
        owner: req.user._id
    });

    res.status(201).json(new ApiResponse(201, "Item created successfully", item));
});

export const updateItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, images, availableQuantity, location } = req.body;

    if (!id) {
        throw new ApiError(400, "Item ID is required");
    }

    const itemExists = await Item.findById(id);
    if (!itemExists) { 
        throw new ApiError(404, "Item not found");
    }

    if (itemExists.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this item");
    }

    const updatedFields = {};

    if (name !== undefined) updatedFields.name = name;
    if (description !== undefined) updatedFields.description = description;
    if (price !== undefined) updatedFields.price = price;
    if (category !== undefined) updatedFields.category = category;
    if (images !== undefined) {
        await Promise.all(itemExists.images.map(async (image) => {
            const link = await deleteFromCloudinary(image.path);
        }));

        const mediasUrl = await Promise.all(req.files.images.map(async (image) => {
            const link = await uploadOnCloudinary(image.path);
            return link.url;
        }));
        updatedFields.images = mediasUrl;
    }
    if (availableQuantity !== undefined) updatedFields.availableQuantity = availableQuantity;
    if (location !== undefined) updatedFields.location = location;

    const item = await Item.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!item) {
        throw new ApiError(404, "Item not found");
    }

    res.status(200).json(new ApiResponse(200, "Item updated successfully", item));
});

export const deleteItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if(!id) {
        throw new ApiError(400, "Item ID is required");
    }

    const item = await Item.findByIdAndDelete(id);
    if (!item) {
        throw new ApiError(404, "Item not found");
    }

    if(item.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this item");
    }

    await Promise.all(item.images.map(async (image) => {
        const link = await deleteFromCloudinary(image.path);
    }));

    res.status(200).json(new ApiResponse(200, "Item deleted successfully", item));
});

export const reviewItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating) {
        throw new ApiError(400, "Rating is required");
    }

    const item = await Item.findById(id);
    if (!item) {
        throw new ApiError(404, "Item not found");
    }

    const reviewExists = item.reviews.find((review) => review.user.toString() === req.user._id.toString());
    if (reviewExists) {
        throw new ApiError(400, "You have already reviewed this item");
    }

    item.reviews.push({ user: req.user._id, rating, comment });
    item.numReviews = item.reviews.length;
    
    item.avgRating = item.reviews.reduce((acc, review) => acc + review.rating, 0) / item.numReviews;

    await item.save();

    res.status(201).json(new ApiResponse(201, "Review added successfully", item));
});