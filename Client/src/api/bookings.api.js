import axiosClient from "../Middleware/AxiosClient";

export const createBookingApi = async (fullName) => {
  try {
    const res = await axiosClient.post("/api/booking", {name: fullName}, {
      withCredentials: true,
    });
    return res;
  }
  catch (err) {
    throw err;
  }
}