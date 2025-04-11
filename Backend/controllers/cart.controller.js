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
    const { itemId, quantity } = req.body;
    if (!itemId) {
        throw new ApiError(400, "Item ID is required");
    }

    if (!quantity || quantity < 0) {
        throw new ApiError(400, "Quantity must be at least 1");
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    } 

    const itemIndex = cart.items.findIndex(item => item.item.toString() === itemId);

    if( itemIndex !== -1 && quantity === 0) {
        cart.items.splice(itemIndex, 1);
    }
    else if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
    } else {
        cart.items.push({ item: itemId, quantity: quantity });
    }

    await cart.save();

    return res.status(200).json(new ApiResponse(200, cart, "Item added to cart successfully"));
});

