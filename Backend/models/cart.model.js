import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                item: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Item",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                    min: 1,
                },
                startDate: {
                    type: Date,
                    Default: Date.now,
                },
                endDate: {
                    type: Date,
                    Default: Date.now + 7 * 24 * 60 * 60 * 1000, // Default to one week from now
                },
            },
        ],
    },
    { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
