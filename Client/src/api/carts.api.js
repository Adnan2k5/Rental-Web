import axiosClient from '../Middleware/AxiosClient';

export const fetchCartItemsApi = async (userId) => {
  const res = await axiosClient.get(`/api/cart`, {
    withCredentials: true,
  });
  return res;
}