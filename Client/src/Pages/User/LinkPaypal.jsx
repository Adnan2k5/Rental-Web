import { getSignUp } from '../../api/paypal.api'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Middleware/AuthProvider';

export const LinkPaypal = () => {
    const [linked, setLinked] = useState(false);
    const { user } = useAuth();


    const fetchSignUp = async () => {
        const res = await getSignUp();
        window.location.href = res.data.data.redirectUrl;
    }

    const checkStatus = async () => {
        console.log("User at the time of redirect", user)
        if (Array.isArray(user.paymentDetails) && user.paymentDetails.length > 0) {
            setLinked(true);
        }
        else {
            fetchSignUp();
        }
    }

    useEffect(() => {
        checkStatus();
    }, [linked])
    return (
        <div>
            {linked ? (
                <div className='flex flex-col items-center justify-center h-screen'>
                    <p className='text-lg'>Your Paypal account is linked</p>
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center h-screen'>
                    <p className='text-lg'>Redirecting to Paypal...</p>
                </div>
            )}
        </div>
    )
}
