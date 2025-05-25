import axiosClient from '../Middleware/AxiosClient';

export const createBookingApi = async (fullName) => {
  try {
    const res = await axiosClient.post(
      '/api/booking',
      { name: fullName },
      {
        withCredentials: true,
      }
    );
    return res;
  } catch (err) {
    throw err;
  }
};

export const approveBookingApi = async (id) => {
  try {
    const res = await axiosClient.get(`/api/booking/approve/${id}`, {
      withCredentials: true,
    });
    return res;
  } catch (err) {
    throw err;
  }
};
