import axiosClient from '../Middleware/AxiosClient';

export const fetchCartItemsApi = async (userId) => {
  const res = await axiosClient.get(`/api/cart`, {
    withCredentials: true,
  });
  return res;
}

export const addItemToCartApi = async (itemId, quantity) => {
  const res = await axiosClient.post(`/api/cart`, { itemId, quantity }, {
    withCredentials: true,
  });
  return res;
}