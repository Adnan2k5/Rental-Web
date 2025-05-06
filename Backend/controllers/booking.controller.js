import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { Booking } from "../models/booking.model.js";
import { Item } from "../models/item.model.js";
import sendEmail from "../utils/sendOTP.js";

export const createBooking = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if(name != req.user.name) {
        throw new ApiError(403, "You are not authorized to create a booking for this user");
    }

    const userId = req.user._id;

    const cart = await Cart.findOne({user: userId})
    .populate({
      path: "items.item",
      select: "price name images owner",
      populate: { path: "owner", select: "name email" }
    });

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

            req.user.bookings.push(booking._id);
            return booking;
        }
    ));

    await req.user.save();

    // Clear the cart after booking

    const mails = cart.items;
    cart.items = [];
    await cart.save();

    sendEmail({
        from: process.env.SMTP_EMAIL,
        to: req.user.email,
        subject: "Booking Confirmation",
        text: `Your booking has been confirmed. Booking details: ${JSON.stringify(bookings)}`,
    });

    mails.forEach(async (cartItem) => {
        sendEmail({
            from: process.env.SMTP_EMAIL,
            to: cartItem.item.owner.email,
            subject: "New Booking",
            text: `You have a new booking for your item ${cartItem.item.name}. Booking details: ${JSON.stringify(bookings)}`,
        });
    });

    res.status(201).json(new ApiResponse(true, "Booking created successfully", bookings));
});