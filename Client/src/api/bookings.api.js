import axiosClient from "../Middleware/AxiosClient";

export const createBookingApi = async (cartItems) => {
  try {
    const res = await axiosClient.post("/api/booking", cartItems, {
      withCredentials: true,
    });
    return res;
  }
  catch (err) {
    if (err.response.status) {
      return err.response.status;
    }
  }
}