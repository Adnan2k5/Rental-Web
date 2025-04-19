import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { Booking } from "../models/booking.model.js";
import { Item } from "../models/item.model.js";

export const createBooking = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({user: userId}).populate("items.item", "price name images");

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    if (cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    const bookings = await Promise.all(
        cart.items.map(async (cartItem) => {
            const item = await Item.findById(cartItem.item._id);
            if (!item) {
                throw new ApiError(404, `Item with ID ${cartItem.item._id} not found`);
            }

            const booking = await Booking.create({
                user: req.user._id,
                item: item._id,
                price: item.price,
                quantity: cartItem.quantity,
                startDate: cartItem.startDate,
                endDate: cartItem.endDate,
                duration: cartItem.duration,
                status: "confirmed",
            });
            return booking;
        }
    ));

    // Clear the cart after booking
    cart.items = [];
    await cart.save();

    res.status(201).json(new ApiResponse(true, "Booking created successfully", bookings));
});