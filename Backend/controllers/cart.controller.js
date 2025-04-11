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
    const { itemId } = req.body;
    if (!itemId) {
        throw new ApiError(400, "Item ID is required");
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    } 

    const itemIndex = cart.items.findIndex(item => item.item.toString() === itemId);

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
    } else {
        cart.items.push({ item: itemId, quantity: 1 });
    }

    return res.status(200).json(new ApiResponse(200, user.cart, "Item added to cart successfully"));
});

export const removeItemFromCart = asyncHandler(async (req, res) => {
    const { itemId, del } = req.body;

    if (!itemId) {
        throw new ApiError(400, "Item ID is required");
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const itemIndex = cart.items.findIndex(item => item.item.toString() === itemId);

    if (itemIndex > -1) {

        if(del === "true") {
            cart.items.splice(itemIndex, 1);
            return res.status(200).json(new ApiResponse(200, user.cart, "Item removed from cart successfully"));
        }

        cart.items[itemIndex].quantity -= 1;

        if (cart.items[itemIndex].quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        }
        
    } else {
        throw new ApiError(404, "Item not found in cart");
    }

    await cart.save();

    return res.status(200).json(new ApiResponse(200, user.cart, "Item removed from cart successfully"));
});