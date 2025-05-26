import mongoose from "mongoose";

const PaymentDetails = new mongoose.Schema(
    {
        merchantId: {
            type: String,
            required: true,
        },
        merchantIdInPayPal: {
            type: String,
            required: true,
        },
        permissionsGranted: {
            type: Boolean,
            default: false,
            required: true,
        },
        productIntentId: {
            type: String,
            required: true,
        },
        consentStatus: {
            type: Boolean,
            required: true,
        },
        isEmailConfirmed: {
            type: Boolean,
            default: false,
        }
    }
)

export const PaymentDetailsModel = mongoose.model("paymentDetails", PaymentDetails);