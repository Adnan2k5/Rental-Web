import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { Booking } from "../models/booking.model.js";
import { getAccessToken } from "../utils/paypal.js";
import axios from "axios";

export const createBooking = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (req.user.documentVerified !== "verified") {
        throw new ApiError(403, "Please verify your document before creating a booking");
    }

    if (name.toLowerCase() !== req.user.name.toLowerCase()) {
        throw new ApiError(403, "You are not authorized to create a booking for this user");
    }

    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId })
        .populate({
            path: "items.item",
            select: "price name images owner",
            populate: {
                path: "owner",
                select: "name email paymentDetails",
                populate: {
                    path: "paymentDetails",
                    select: "merchantIdInPayPal"
                }
            }
        });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    if (cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    const totalPrice = cart.items.reduce((acc, cartItem) => acc + cartItem.item.price, 0);

    const bookings = await Booking.create({
        user: userId,
        item: cart.items.map((cartItem) => ({
            _id: cartItem.item._id,
            startDate: cartItem.startDate,
            endDate: cartItem.endDate,
        })),
        price: totalPrice,
        quantity: cart.items.length,
    });

    // Group items by owner (merchant)
    const ownerMap = new Map();
    cart.items.forEach(cartItem => {
        const owner = cartItem.item.owner;
        const payeeId = owner?.paymentDetails?.merchantIdInPayPal;
        if (!payeeId) {
            throw new ApiError(400, `Owner of item ${cartItem.item.name} has not linked their PayPal account.`);
        }
        if (!ownerMap.has(payeeId)) {
            ownerMap.set(payeeId, {
                owner,
                payeeId,
                items: [],
                total: 0,
                platformFee: 0
            });
        }
        ownerMap.get(payeeId).items.push(cartItem);
        ownerMap.get(payeeId).total += cartItem.item.price;
        ownerMap.get(payeeId).platformFee += cartItem.item.price * 0.18;
    });


    // Create one purchase_unit per owner
    const purchase_units = Array.from(ownerMap.values()).map(ownerEntry => {
        console.log(ownerEntry.payeeId);
        return {
            amount: {
                currency_code: "EUR",
                value: ownerEntry.total.toFixed(2),
            },
            payee: {
                merchant_id: ownerEntry.payeeId,
            },
            payment_instruction: {
                disbursement_mode: "INSTANT",
                platform_fees: [
                    {
                        amount: {
                            currency_code: "EUR",
                            value: ownerEntry.platformFee.toFixed(2),
                        },
                        payee: {
                            merchant_id: "7B8A6WUFFHA6U", // Set in your .env
                        }
                    }
                ]
            },
            description: ownerEntry.items.map(i => i.item.name).join(", ")
        };
    });

    // Build the PayPal order payload
    const payload = {
        intent: "CAPTURE",
        purchase_units
    };

    // Generate PayPal access token and auth assertion
    const accessToken = await getAccessToken();
    // You must implement generatePayPalAuthAssertion for your platform and each seller
    // For demo, using the first owner's merchantIdInPayPal (payeeId)
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const sellerPayeeId = cart.items[0].item.owner?.paymentDetails?.merchantIdInPayPal;
    function encodeObjectToBase64(object) {
        return Buffer.from(JSON.stringify(object)).toString("base64");
    }
    const header = { alg: "none" };
    const encodedHeader = encodeObjectToBase64(header);
    const payloadAssertion = { iss: clientId, payer_id: sellerPayeeId };
    const encodedPayload = encodeObjectToBase64(payloadAssertion);
    const paypalAuthAssertion = `${encodedHeader}.${encodedPayload}.`;

    const url = `https://api-m.sandbox.paypal.com/v2/checkout/orders`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "PayPal-Partner-Attribution-Id": process.env.PAYPAL_PARTNER_ATTRIBUTION_ID, // Set in your .env
            "PayPal-Auth-Assertion": paypalAuthAssertion,
        },
        body: JSON.stringify(payload),
    });

    const paypalData = await response.json();

    if (!response.ok) {
        console.error("PayPal API error:", paypalData);

        throw new ApiError(response.status, paypalData.message || "Failed to create PayPal order");
    }

    const orderId = paypalData.id;
    await req.user.save();

    const merchantIds = Array.from(ownerMap.keys());

    res.status(201).json(new ApiResponse(true, "Booking created successfully", {
        orderId,
        totalPrice,
        bookings,
        merchantIds,
    }));
});

export const approveBooking = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id })
        .populate({
            path: "items.item",
            select: "price name images owner",
            populate: {
                path: "owner",
                select: "name email paymentDetails",
                populate: {
                    path: "paymentDetails",
                    select: "merchantIdInPayPal"
                }
            }
        });

    const accessToken = await getAccessToken();
    console.log(accessToken)
    console.log(req.params.id)
    const response = await axios.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${req.params.id}/capture`, {}, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "PayPal-Partner-Attribution-Id": process.env.PAYPAL_PARTNER_ATTRIBUTION_ID,
        }
    });

    if (response.status === 201) {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status: "confirmed" }, { new: true });
        // Clear the cart after booking 
        const mails = cart.items;
        cart.items = [];
        await cart.save();

        sendEmail({
            from: process.env.SMTP_EMAIL,
            to: req.user.email,
            subject: "Booking Confirmation",
            text: `Your booking has been confirmed. Booking details: ${JSON.stringify(booking)}`,
        });

        mails.forEach(async (cartItem) => {
            sendEmail({
                from: process.env.SMTP_EMAIL,
                to: cartItem.item.owner.email,
                subject: "New Booking",
                text: `You have a new booking for your item ${cartItem.item.name}. Booking details: ${JSON.stringify(booking)}`,
            });
        });

        res.status(200).json(new ApiResponse(true, "Booking approved successfully", booking));
    } else {
        throw new ApiError(response.status, response.data.message || "Failed to approve booking");
    }
});
