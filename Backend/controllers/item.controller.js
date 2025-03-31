import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Item } from "../models/item.model.js";

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


