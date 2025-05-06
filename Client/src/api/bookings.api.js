import axiosClient from "../Middleware/AxiosClient";

export const createBookingApi = async (fullName) => {
  try {
    const res = await axiosClient.post("/api/booking", {name: fullName}, {
      withCredentials: true,
    });
    return true;
  }
  catch (err) {
    if (err.response.status) {
      return false;
    }
    return false;
  }
}