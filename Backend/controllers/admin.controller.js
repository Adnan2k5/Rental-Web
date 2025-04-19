import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Category from "../models/category.model.js";
import { User } from "../models/user.model.js";
import { Item } from "../models/item.model.js";

export const getAllStats = asyncHandler(async (req, res) => {
    // Run independent queries concurrently
    const [totalUsers, totalItems, activeItems, recentUsers, categories] = await Promise.all([
        User.countDocuments({}),
        Item.countDocuments({}),
        Item.countDocuments({ status: "available" }),
        User.find({}).sort({ createdAt: -1 }).limit(3).select("-password -refreshToken -reviews -bookings -role -cart"),
        Category.find({}).sort({ createdAt: -1 }).select("name")
    ]);

    const now = new Date();
    const last7Months = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setMonth(now.getMonth() - i);
        return date.toISOString().substring(0, 7); // Format: YYYY-MM
    }).reverse();

    // Run user growth aggregation in parallel with other queries
    const startDate = new Date(last7Months[0] + "-01");
    const endDate = new Date(); // current date

    const userGrowthPromise = User.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                count: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);

    // Get items by category data
    const itemsByCategoryPromise = Promise.all(
        categories.map(async (category) => {
            const itemCount = await Item.countDocuments({ category: category.name });

            return {
                categoryName: category.name,
                categoryId: category._id,
                itemCount
            };
        })
    );

    // Get item growth data for the last 4 months
    const last4Months = last7Months.slice(-4);
    const itemStartDate = new Date(last4Months[0] + "-01");

    const itemGrowthPromise = Item.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: itemStartDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                count: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);

    // Await the remaining promises
    const [userGrowth, itemsByCategory, itemGrowth] = await Promise.all([
        userGrowthPromise,
        itemsByCategoryPromise,
        itemGrowthPromise
    ]);

    // Fill in any missing months with zero count for itemGrowth
    const formattedItemGrowth = last4Months.map(month => {
        const found = itemGrowth.find(item => item._id === month);
        return { month, count: found ? found.count : 0 };
    });

    // Fill in any missing months with zero count
    const formattedUserGrowth = last7Months.map(month => {
        const found = userGrowth.find(item => item._id === month);
        return { month, count: found ? found.count : 0 };
    });


    return res.status(200).json(
        new ApiResponse(200, {
            stats: {
                totalUsers,
                totalItems,
                activeItems,
            },
            itemGrowth: formattedItemGrowth,
            recentUsers,
            userGrowth: formattedUserGrowth,
            categories,
            itemsByCategory
        }, "Stats fetched successfully")
    );
});


export const getAllUsers = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    const totalUsers = await User.countDocuments({});
    const users = await User.find({}).skip(skip).limit(limitNumber).select("-password -refreshToken -reviews -bookings -role -cart").sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalUsers / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPreviousPage = pageNumber > 1;
    const nextPage = hasNextPage ? pageNumber + 1 : null;
    const previousPage = hasPreviousPage ? pageNumber - 1 : null;
    const pagination = {
        totalUsers,
        totalPages,
        currentPage: pageNumber,
        hasNextPage,
        hasPreviousPage,
        nextPage,
        previousPage
    };
    return res.status(200).json(
        new ApiResponse(200, {
            users,
            pagination
        }, "Users fetched successfully")
    );
});