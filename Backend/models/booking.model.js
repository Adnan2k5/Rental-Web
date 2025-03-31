import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
        bookingDate: {
            type: Date,
            default: Date.now,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        duration: {
            //In Months
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "canceled"],
            default: "pending",
        },
        paymentDetails: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Payment",
        },
    },
    { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);