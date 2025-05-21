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
        if (user?.paymentDetails) {
            setLinked(true);
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
                    <p className='text-lg'>Link your Paypal account</p>
                    <button onClick={fetchSignUp} className='bg-blue-500 text-white px-4 py-2 rounded mt-4'>
                        Link Paypal
                    </button>
                </div>
            )}
        </div>
    )
}
