import axiosClient from '../Middleware/AxiosClient';

export const getSignUp = async () => {
  const res = await axiosClient.get('/api/paypal/', { withCredentials: true });
  return res;
};
