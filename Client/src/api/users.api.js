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

export const uploadUserBanner = async (bannerFile) => {
  try {
    const formData = new FormData();
    formData.append('profileBanner', bannerFile);
    const response = await axiosClient.put(
      `/api/user/update-profile-banner`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to upload banner');
    }
  } catch (error) {
    throw error;
  }
};
