import axiosClient from '../Middleware/AxiosClient';
export const fetchAllItems = async ({
  priceRange,
  categories,
  brands,
  availability,
  rating,
  query,
  page,
  limit,
} = {}) => {
  const res = await axiosClient.get('/api/item/discover', {
    withCredentials: true,
    params: {
      minPrice: priceRange?.[0] ?? 0,
      maxPrice: priceRange?.[1] ?? 9999999,
      category: categories,
      brands,
      availability,
      rating,
      query,
      page,
      limit,
    },
  });
  return res;
};

export const fetchByUserId = async (userId) => {
  const res = await axiosClient.get(`/api/item/user/${userId}`);
  return res;
};

export const createItems = async (data) => {
  console.log('data', data);
  const res = await axiosClient.post('/api/item/upload', data, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  console.log(res);
};

export const deleteItem = async (id) => {
  const res = await axiosClient.delete(`/api/item/${id}`, {
    withCredentials: true,
  });
  return res;
};

export const updateItem = async (data) => {
  console.log(data);
};
