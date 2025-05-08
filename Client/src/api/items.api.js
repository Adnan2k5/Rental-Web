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
  lat,
  long,
} = {}, currentLanguage) => {
  const res = await axiosClient.get(`/api/item/discover?lang=${currentLanguage || 'en'}`, {
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
      lat,
      long,
    },
  });
  return res;
};

export const fetchByUserId = async (userId) => {
  const res = await axiosClient.get(`/api/item/user/${userId}`);
  return res;
};

export const createItems = async (data) => {
  const res = await axiosClient.post('/api/item/upload', data, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteItem = async (id) => {
  const res = await axiosClient.delete(`/api/item/${id}`, {
    withCredentials: true,
  });
  return res;
};

export const updateItem = async (data) => {
  const id = data.id;
  const res = await axiosClient.put(`/api/item/${id}`, data, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res;
};

export const fetchUserBookings = async () => {
  const res = await axiosClient.get(`/api/user/bookings`, {
    withCredentials: true,
  });
  return res.data;
};

export const postItemReview = async (data) => {
  const id = data.id;
  const res = await axiosClient.post(`/api/user/reviews/${id}`, data, {
    withCredentials: true,
  });
  if (res.status === 201) {
    return true;
  } else {
    return false;
  }
};

export const fetchTopReviewedItems = async () => {
  const res = await axiosClient.get('/api/item/top-reviewed', {
    withCredentials: true,
  });
  return res.data;
};
