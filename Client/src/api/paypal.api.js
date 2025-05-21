import axiosClient from '../Middleware/AxiosClient';

export const getSignUp = async () => {
  const res = await axiosClient.get('/api/paypal/', { withCredentials: true });
  return res;
};

export const getSuccess = async (data) => {
  console.log(data);
  const res = await axiosClient.post('/api/paypal', data, {
    withCredentials: true,
  });
  return res;
};
