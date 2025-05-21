import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import axios from "axios";
import { getAccessToken } from "../utils/paypal.js";
import { PaymentDetailsModel } from "../models/paymentdetails.model.js";
import { v4 as uuidv4 } from 'uuid';


export const getSignupPage = asyncHandler(async (req, res) => {
    const accessToken = await getAccessToken();
    try {
        const trackingId = uuidv4();

        const response = await axios.post(
            'https://api-m.sandbox.paypal.com/v2/customer/partner-referrals',
            {
                tracking_id: trackingId, 
                partner_config_override: {
                    return_url: "http://localhost:5173/paypal/success"
                },
                operations: [{
                    operation: "API_INTEGRATION",
                    api_integration_preference: {
                        rest_api_integration: {
                            integration_method: "PAYPAL",
                            integration_type: "THIRD_PARTY",
                            third_party_details: {
                                features: [
                                    "PAYMENT",
                                    "REFUND"
                                ]
                            }
                        }
                    }
                }],
                products: [
                    "EXPRESS_CHECKOUT"
                ],
                legal_consents: [{
                    type: "SHARE_DATA_CONSENT",
                    granted: true
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        try {
            return res.status(200).json(
                new ApiResponse(200, { redirectUrl: response.data.links[1].href }, "Success")
            );
        } catch (err) {
            throw new ApiError(500, "Failed to get PayPal signup URL");
        }
    }

    catch (error) {
        console.error("Error creating partner referral:");
        throw new ApiError(500, "Failed to create partner referral", error);
    }
});

export const getSuccessPage = asyncHandler(async (req, res) => {
    const {
        merchantId,
        merchantIdInPayPal,
        permissionsGranted,
        productIntentId,
        consentStatus,
        isEmailConfirmed
    } = req.body; 


    if (!consentStatus || !isEmailConfirmed || !merchantId || !merchantIdInPayPal || !permissionsGranted || !productIntentId) {
        throw new ApiError(400, "Missing required query parameters");
    }
    const userId = req.user?._id; 

    if(userId.paymentDetails) {
        throw new ApiError(400, "Payment details already exist");
    }

    const paymentDetail = await PaymentDetailsModel.create({
        merchantId,
        merchantIdInPayPal,
        permissionsGranted,
        productIntentId,
        consentStatus,
        isEmailConfirmed
    });

    req.user.paymentDetails = paymentDetail._id;

    await req.user.save();

    return res.status(200).json(
        new ApiResponse(200, paymentDetail, "Payment details saved successfully")
    );
});
