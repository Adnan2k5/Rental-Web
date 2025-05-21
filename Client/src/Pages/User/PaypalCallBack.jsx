import React, { useEffect } from 'react'
import { Loader } from '../../Components/loader';
import { getSuccess } from '../../api/paypal.api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosClient from '../../Middleware/AxiosClient';
import { setUser } from '../../Store/UserSlice';

export const CallBack = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const refetchUser = async () => {
        try {
            const res = await axiosClient.get('/api/user/me', { withCredentials: true });
            console.log("User data refetched:", res.data.data); 
            dispatch(setUser(res.data.data));
        } catch (err) {
            console.error('Failed to refetch user data:', err);
        }
    };
    
    const postPayment = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        console.log(queryParams);
        const data = {
            merchantId: queryParams.get('merchantId'),
            merchantIdInPayPal: queryParams.get('merchantIdInPayPal'),
            permissionsGranted: queryParams.get('permissionsGranted'),
            consentStatus: queryParams.get('consentStatus'),
            productIntentId: queryParams.get('productIntentId') || queryParams.get('productIntentID'),
            isEmailConfirmed: queryParams.get('isEmailConfirmed'),
        };
        if (data.merchantId && data.merchantIdInPayPal) {
            const res = await getSuccess(data);
            console.log(res);
            if (res.status === 200) {
                // Refetch user data after successful payment
                await refetchUser();
                navigate('/dashboard/paypal');
            }
        }
    }
    
    useEffect(() => {
        postPayment();
    }, [navigate, dispatch]);
    
    return (
        <div>
            <Loader />
            <div className='flex flex-col items-center justify-center h-screen'>
                <p className='text-lg'>Redirecting...</p>
            </div>
        </div>
    )
}