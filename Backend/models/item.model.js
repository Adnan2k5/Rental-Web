import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: ["electronics", "furniture", "clothing", "books", "toys"],
        },
        images: [
            {
                type: String,
                required: true,
            },
        ],
        availableQuantity: {
            type: Number,
            required: true,
            default: 0,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["available", "rented", "reserved"],
            default: "available",
        },
        bookings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking",
            },
        ],
        avgRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export const Item = mongoose.model("Item", itemSchema);