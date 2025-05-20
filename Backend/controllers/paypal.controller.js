import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import axios from "axios";
import { getAccessToken } from "../utils/paypal.js";

export const getSignupPage = asyncHandler(async (req, res) => {
    const accessToken = await getAccessToken();
    try {
        const response = await axios.post(
            'https://api-m.sandbox.paypal.com/v2/customer/partner-referrals',
            {
                tracking_id: "TRACKING-ID", // Generate a unique tracking ID
                partner_config_override: {
                    return_url: "https://localhost:5173/" //
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
        console.error("Error creating partner referral:", error);
        throw new ApiError(500, "Failed to create partner referral");
    }
});