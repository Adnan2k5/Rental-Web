import { useNavigate } from 'react-router-dom';
import { approveBookingApi } from '../api/bookings.api';
import React, { useEffect, useState } from 'react'
import PaymentPage from './Payment';
import { toast } from 'sonner';

export const PaymentCallback = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const PayerID = queryParams.get('PayerID');
    const [loading, setloading] = useState(true);
    const [success, setSuccess] = useState(null);


    const approveBooking = async () => {
        try {
            if (token) {
                const res = await approveBookingApi(token);
                if (res.status === 200) {
                    setSuccess(true);
                }
            }
        }
        catch (error) {
            toast.error("Payment approval failed. Please try again.");
            setSuccess(false);
        }
        finally {
            setloading(false);
        }
    }

    useEffect(() => {
        if (token && PayerID) {
            approveBooking();
        }
    })
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {
                loading ? (
                    <div className="text-lg font-semibold">Processing your payment...</div>
                ) : !loading && success ? (
                    <PaymentPage paystatus='success' />
                ) : !loading && success === false ? (
                    <div className="text-lg font-semibold text-red-600">Payment approval failed. Please try again.</div>
                ) : null
            }
        </div>
    )
}
