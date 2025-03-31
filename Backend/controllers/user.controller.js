import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Booking } from "../models/booking.model.js";
import { Item } from "../models/item.model.js";
import { Review } from "../models/review.model.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
});

export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select("-password -refreshToken -reviews -bookings");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

export const getUserBookings = asyncHandler(async (req, res) => {
    await req.user.select("-password -refreshToken -reviews").populate("bookings");
    return res.status(200).json(new ApiResponse(200, req.user.bookings, "User fetched successfully"));
});

export const getUserReviews = asyncHandler(async (req, res) => {
    await req.user.select("-password -refreshToken -bookings").populate("reviews");
    return res.status(200).json(new ApiResponse(200, req.user.reviews, "User fetched successfully"));
});

export const getBookingDetailsById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("user").populate("item").populate("paymentDetails");
    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    return res.status(200).json(new ApiResponse(200, booking, "Booking fetched successfully"));
});

export const getReviewDetailsById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const review = await Item.findById(id).populate("item").populate("paymentDetails");
    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    return res.status(200).json(new ApiResponse(200, review, "Review fetched successfully"));
});

export const updateReviewById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);
    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    if (review.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this review");
    }
    if (rating) {
        review.rating = rating;
    }
    if (comment) {
        review.comment = comment;
    }
    const updatedReview = await review.save();

    if (!updatedReview) {
        throw new ApiError(500, "Unable to update review");
    }

    return res.status(200).json(new ApiResponse(200, updatedReview, "Review updated successfully"));
});

export const deleteReviewById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    if (review.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this review");
    }
    await review.remove();

    return res.status(200).json(new ApiResponse(200, {}, "Review deleted successfully")); 
});