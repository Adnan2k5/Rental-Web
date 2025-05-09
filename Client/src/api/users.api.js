import axiosClient from '../Middleware/AxiosClient';

export const getUserById = async (userId) => {
  try {
    const response = await axiosClient.get(`/api/user/me/${userId}`, {
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch user data');
    }
  } catch (error) {
    throw error;
  }
};
