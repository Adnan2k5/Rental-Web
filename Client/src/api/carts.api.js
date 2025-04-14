import axiosClient from '../Middleware/AxiosClient';

export const fetchCartItemsApi = async (userId) => {
  const res = await axiosClient.get(`/api/cart`, {
    withCredentials: true,
  });
  return res;
}

export const addItemToCartApi = async (itemId, quantity, duration) => {
  const res = await axiosClient.post(`/api/cart`, { itemId, quantity, duration }, {
    withCredentials: true,
  });
  return res;
}

export const getCartCountApi = async () => {
  const res = await axiosClient.get(`/api/cart/count`, {
    withCredentials: true,
  });
  return res;
}