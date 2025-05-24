import { approveBookingApi } from '../api/bookings.api';
import React, { useEffect } from 'react'

export const PaymentCallback = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const PayerID = queryParams.get('PayerID');

    useEffect(async () => {
        if (token && PayerID) {
            const res = await approveBookingApi(token);
            console.log(res);
            if (res.status === 200) {
                // Handle successful payment approval
                console.log("Payment approved successfully");
                // You can redirect or show a success message here
            } else {
                // Handle failure
                console.error("Payment approval failed");
            }
        }
    })
    return (
        <div>Loading...</div>
    )
}
