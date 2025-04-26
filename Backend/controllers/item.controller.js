import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Item } from "../models/item.model.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Review } from "../models/review.model.js";
import { getLatLongFromAddress } from "../utils/geoencoding.js";


export const getItemById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if(!id) {
        throw new ApiError(400, "Item ID is required");
    }

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
        query,
        minPrice = 0,
        maxPrice = 99999999,
        limit = 10,
        page = 1,
        lat,
        long
    } = req.query;


    const categories = category
        ? (Array.isArray(category) ? category : [category])
        : [];

    const availableList = availability
        ? (Array.isArray(availability) ? availability : [availability])
        : [];

    const availableListMap = {
        "Available Now": "available",
        "Available Within 1 Week": "rented",
        "Coming Soon": "reserved",
    };

    const availableFilter = availableList.map((a) => availableListMap[a] || a);

    // Build the main filter
    const filter = {
        ...(categories.length > 0 && { category: { $in: categories } }),
        ...(availableFilter.length > 0 && { status: { $in: availableFilter } }),
        ...(location && { location }),
        ...(rating && { avgRating: { $gte: rating } }),
        ...(query && { name: { $regex: query, $options: "i" } }),
        price: { $gte: minPrice, $lte: maxPrice },
    };

    let itemsQuery = Item.find(filter).populate("owner", "name");

    // If lat/long provided, use geospatial query to sort by distance
    if (lat && long) {
        itemsQuery = Item.aggregate([
            { $geoNear: {
                near: { type: "Point", coordinates: [parseFloat(long), parseFloat(lat)] },
                distanceField: "distance",
                spherical: true,
                query: filter
            }},
            { $sort: { distance: 1 } },
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit) },
        ]);
        // Populate owner after aggregation
        itemsQuery = itemsQuery.exec();
        // Need to manually populate owner field after aggregation
        const items = await itemsQuery;
        // Populate owner for each item
        const populatedItems = await Item.populate(items, { path: "owner", select: "name" });
        const totalItems = await Item.countDocuments(filter);
        return res.status(200).json(new ApiResponse(200, "Items fetched successfully", { items: populatedItems, totalItems }));
    }

    const items = await itemsQuery.limit(limit * 1).skip((page - 1) * limit);
    const totalItems = await Item.countDocuments(filter);
    res.status(200).json(new ApiResponse(200, "Items fetched successfully", { items, totalItems }));
});


export const createItem = asyncHandler(async (req, res) => {
    const { name, description, price, category, availableQuantity, location } = req.body;

    if (!name || !description || !price || !category || !availableQuantity || !location) {
        throw new ApiError(400, "All fields are required");
    }

    if (!req.files || !req.files.images || req.files.images.length === 0) {
        throw new ApiError(400, "Image is required");
    }

    const mediasUrl = await Promise.all(req.files.images.map(async (image) => {
        const link = await uploadOnCloudinary(image.path);
        return link.url;
    }));

    const { lat, lng } = await getLatLongFromAddress(location);

    if (!lat || !lng) {
        throw new ApiError(400, "Invalid location provided");
    }

    const item = await Item.create({
        name,
        description,
        price,
        category,
        images: mediasUrl,
        status: "available",
        bookings: [],
        availableQuantity,
        location: {
            type: "Point",
            coordinates: [lng, lat]
        },
        owner: req.user._id
    });

    res.status(201).json(new ApiResponse(201, "Item created successfully", item));
});

export const updateItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, availableQuantity, location } = req.body;

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
    if (req.files.images !== undefined) {
        await Promise.all(itemExists.images.map(async (image) => {
            const link = await deleteFromCloudinary(image);
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
    if (!id) {
        throw new ApiError(400, "Item ID is required");
    }

    const item = await Item.findByIdAndDelete(id);
    if (!item) {
        throw new ApiError(404, "Item not found");
    }

    if (item.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this item");
    }

    await Promise.all(item.images.map(async (image) => {
        const link = await deleteFromCloudinary(image);
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
    console.log(item)
    const reviewExists = await Review.findOne({
        item: id,
        user: req.user._id
    }).lean();
    if (reviewExists) {
        throw new ApiError(400, "You have already reviewed this item");
    }

    item.totalReviews += 1;

    item.avgRating =  (item.avgRating * (item.totalReviews - 1) + rating) / item.totalReviews;

    const review = await Review.create({
        user: req.user._id,
        item: id,
        rating,
        comment
    });

    await item.save();
    await review.save();

    res.status(201).json(new ApiResponse(201, "Review added successfully", item));
});

export const getItemByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if(!user) {
        throw new ApiError(404, "User not found");
    }

    const items = await Item.find({owner: userId});
    res.status(201).json(new ApiResponse(200, "Items fetched successfully", items));
});

export const getTopReviewedItems = asyncHandler(async (req, res) => {
    const items = await Item.find({})
        .sort({ totalReviews: -1 })
        .limit(5)
        .populate("owner", "name");
    res.status(200).json(new ApiResponse(200, "Top 5 items with highest review count fetched successfully", items));
});