import "dotenv/config";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { Booking } from "../models/booking.model.js";
import { getAccessToken } from "../utils/paypal.js";
import axios from "axios";
import sendEmail from "../utils/sendOTP.js";

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


    if (!cart) throw new ApiError(404, "Cart not found");
    if (cart.items.length === 0) throw new ApiError(400, "Cart is empty");

    const totalPrice = cart.items.reduce((acc, cartItem) => acc + cartItem.item.price, 0);

    const booking = await Booking.create({
        user: userId,
        item: cart.items.map((cartItem) => ({
            _id: cartItem.item._id,
            startDate: cartItem.startDate,
            endDate: cartItem.endDate,
        })),
        price: totalPrice,
        quantity: cart.items.length,
    });



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


    const purchase_units = Array.from(ownerMap.values()).map(ownerEntry => ({
        amount: {
            currency_code: "EUR",
            value: ownerEntry.total.toFixed(2),
        },
        payee: {
            merchant_id: ownerEntry.payeeId,
        },
        payment_instruction: {
            disbursement_mode: "INSTANT",
            platform_fees: [{
                amount: {
                    currency_code: "EUR",
                    value: ownerEntry.platformFee.toFixed(2),
                },
                payee: {
                    merchant_id: process.env.PAYPAL_PLATFORM_MERCHANT_ID,
                }
            }]
        },
        description: ownerEntry.items.map(i => i.item.name).join(", ")
    }));

    const payload = {
        intent: "CAPTURE",
        purchase_units,
        application_context: {
            return_url: `${process.env.CLIENT_URL}/payment/approve`,
            cancel_url: `${process.env.CLIENT_URL}/payment/cancel`
        }
    };

    const accessToken = await getAccessToken();
    console.log("Access Token", accessToken);
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const sellerPayeeId = cart.items[0].item.owner?.paymentDetails?.merchantIdInPayPal;


    const encodeObjectToBase64 = (object) => Buffer.from(JSON.stringify(object)).toString("base64");
    const header = { alg: "none" };
    const encodedHeader = encodeObjectToBase64(header);
    const payloadAssertion = { iss: clientId, payer_id: sellerPayeeId };
    const encodedPayload = encodeObjectToBase64(payloadAssertion);
    const paypalAuthAssertion = `${encodedHeader}.${encodedPayload}.`;

    const response = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "PayPal-Partner-Attribution-Id": process.env.PAYPAL_PARTNER_ATTRIBUTION_ID,
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
    booking.paypalOrderId = orderId;
    await booking.save();

    await req.user.save();

    const merchantIds = Array.from(ownerMap.keys());

    res.status(201).json(new ApiResponse(true, "Booking created successfully", {
        orderId,
        totalPrice,
        booking,
        merchantIds,
        redirectURL :paypalData.links[1].href // This is the approval URL for the PayPal order
    }));
});

export const approveBooking = asyncHandler(async (req, res) => {
    const paypalOrderId = req.params.id;
    
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

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const sellerPayeeId = cart.items[0].item.owner?.paymentDetails?.merchantIdInPayPal;

    const encodeObjectToBase64 = (object) => Buffer.from(JSON.stringify(object)).toString("base64");
    const header = { alg: "none" };
    const encodedHeader = encodeObjectToBase64(header);
    const payloadAssertion = { iss: clientId, payer_id: sellerPayeeId };
    const encodedPayload = encodeObjectToBase64(payloadAssertion);
    const paypalAuthAssertion = `${encodedHeader}.${encodedPayload}.`;
    
    const response = await axios.get(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "PayPal-Partner-Attribution-Id": process.env.PAYPAL_PARTNER_ATTRIBUTION_ID,
            "PayPal-Auth-Assertion": paypalAuthAssertion,
        }
    });

    console.log("On Approve",response.data);

    // const payment_source = response.data.payment_source;

    // const approvecall = await axios.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}/confirm-payment-source`, {payment_source}, {
    //     headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${accessToken}`,
    //         "PayPal-Partner-Attribution-Id": process.env.PAYPAL_PARTNER_ATTRIBUTION_ID,
    //         "PayPal-Auth-Assertion": paypalAuthAssertion,
    //     }
    // })

    // console.log("Approve Call Response:", approvecall.data);

    if (response.status === 201 || response.status === 200) {
        try{
            const captureResponse = await axios.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}/capture`,{},{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "PayPal-Partner-Attribution-Id": process.env.PAYPAL_PARTNER_ATTRIBUTION_ID,
                "PayPal-Auth-Assertion": paypalAuthAssertion,
            }
        });
        }catch (error) {
            if(error.response === 422){
                return;
            }
        }

        const booking = await Booking.findOneAndUpdate(
            { paypalOrderId },
            { status: "confirmed" },
            { new: true }
        );

        if (!booking) {
            throw new ApiError(404, "Booking not found for this PayPal order ID");
        }

        const mails = cart.items;
        console.log("Mails", mails)
        // cart.items = [];
        // await cart.save();

        // sendEmail({
        //     from: process.env.SMTP_EMAIL,
        //     to: req.user.email,
        //     subject: "Booking Confirmation",
        //     text: `Your booking has been confirmed. Booking details: ${JSON.stringify(booking)}`
        // });

        // mails.forEach(async (cartItem) => {
        //     sendEmail({
        //         from: process.env.SMTP_EMAIL,
        //         to: cartItem.item.owner.email,
        //         subject: "New Booking",
        //         text: `You have a new booking for your item ${cartItem.item.name}. Booking details: ${JSON.stringify(booking)}`
        //     });
        // });

        res.status(200).json(new ApiResponse(true, "Booking approved successfully"));
    } else {
        console.log(response.data);
        throw new ApiError(response.status, response.data.message || "Failed to approve booking");
    }
});
