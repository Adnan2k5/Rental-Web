import axiosClient from "../Middleware/AxiosClient";

export const createBookingApi = async () => {
  const res = await axiosClient.post("/api/booking", data, {
    withCredentials: true,
  });
  return res;
}