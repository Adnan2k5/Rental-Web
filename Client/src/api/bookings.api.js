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
    console.log('Approving booking with ID:', id);
    const cleanId = id.split(':')[0];
    console.log('Cleaned ID:', cleanId);
    const res = await axiosClient.get(`/api/booking/approve/${cleanId}`, {
      withCredentials: true,
    });
    return res;
  } catch (err) {
    throw err;
  }
};
