import { getSignUp } from '../../api/paypal.api'
import React, { useEffect } from 'react'

export const LinkPaypal = () => {

    const fetchSignUp = async () => {
        const res = await getSignUp();
        window.location.href = res.data.data.redirectUrl;
    }
    useEffect(() => {
        fetchSignUp();
    }, [])
    return (
        <div>
            Redirecting to Paypal...
        </div>
    )
}
