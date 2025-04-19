import { Cart } from "../models/cart.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.item", "name price images");
    if (!cart) {
        return res.status(200).json(new ApiResponse(200, [], "Cart is empty"));
    }

    return res.status(200).json(new ApiResponse(200, cart.items, "Cart retrieved successfully"));
});

export const addItemToCart = asyncHandler(async (req, res) => {
    const { itemId, quantity, startDate, endDate, all } = req.body;

    if (!itemId && all === undefined) {
        throw new ApiError(400, "Item ID is required");
    }

    if (quantity === undefined && startDate === undefined && endDate === undefined && all === undefined) {
        throw new ApiError(400, "Quantity or Duration are required");
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    if (all) {
        cart.items = [];
        await cart.save();
        return res.status(200).json(new ApiResponse(200, cart, "Items removed from cart successfully"));
    }

    const itemIndex = cart.items.findIndex(item => item.item.toString() === itemId);
    if (itemIndex !== -1 && ((quantity !== undefined && quantity <= 0))) {
        cart.items.splice(itemIndex, 1);
    }
    else if (itemIndex > -1) {
        if (quantity !== null && quantity !== undefined) {
            cart.items[itemIndex].quantity = quantity;
        }
        if (startDate !== null && startDate !== undefined) {
            cart.items[itemIndex].startDate = startDate;
        }
        if (endDate !== null && endDate !== undefined) {
            cart.items[itemIndex].endDate = endDate;
        }
    } else if(startDate && endDate) {
        cart.items.push({ item: itemId, quantity: quantity, startDate: startDate, endDate: endDate });
    }
    else {
        cart.items.push({ item: itemId, quantity: quantity });
    }
``
    await cart.save();

    return res.status(200).json(new ApiResponse(200, cart, "Item added to cart successfully"));
});

export const getCartCount = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return res.status(200).json(new ApiResponse(200, [], "Cart is empty"));
    }

    const itemCount = cart.items.reduce((total, item) => total + (item.quantity || 0), 0);
    return res.status(200).json(new ApiResponse(200, { count: itemCount }, "Cart count retrieved successfully"));
});

