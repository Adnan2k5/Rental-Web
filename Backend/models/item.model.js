import mongoose from "mongoose";
import Category from "./category.model.js";
import translateText from "../middlewares/translate.middleware.js";

const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        name_it: { type: String }, // Italian translation

        description: {
            type: String,
            required: true,
            trim: true,
        },
        description_it: { type: String }, // Italian translation

        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
            validate: {
                validator: async function (value) {
                    const exists = await Category.exists({ name: value });
                    return !!exists;
                },
                message: props => `${props.value} is not a valid category`
            }
        },
        subCategory: {
            type: String,
            required: false,
            validate: {
                validator: async function (value) {
                    if (!value) return true; // Allow empty subCategory
                    const category = await Category.findOne({ name: this.category });
                    if (!category) return false;
                    return category.subCategories.includes(value);
                },
                message: props => `${props.value} is not a valid subcategory for the selected category`
            }
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
            type: { type: String, enum: ['Point'], required: true },
            coordinates: { type: [Number], required: true }
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

itemSchema.index({ location: "2dsphere" });

itemSchema.pre('save', async function (next) {
    if (!this.name_it) {
        this.name_it = await translateText(this.name, 'it');
    }
    if (!this.description_it) {
        this.description_it = await translateText(this.description, 'it');
    }
    next();
});

export const Item = mongoose.model("Item", itemSchema);