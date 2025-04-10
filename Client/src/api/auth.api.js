import { loginFailure, loginStart, loginSuccess } from '../Store/UserSlice';
import axiosClient from '../Middleware/AxiosClient';

export const loginUser = async (data, dispatch) => {
  try {
    dispatch(loginStart());
    const res = await axiosClient.post('/api/auth/login', data, {
      withCredentials: true,
    });
    if (res.status === 200) {
      dispatch(loginSuccess(res.data.data));
      return true;
    }
  } catch (err) {
    dispatch(loginFailure(err.response.status));
    if (err.response.status) {
      return err.response.status;
    }
  }
};

export const userRegister = async (data) => {
  try {
    const res = await axiosClient.post('/api/auth/signUp', data);
    if (res.status === 201) {
      return true;
    } else if (res.status === 409) {
      return 409;
    }
  } catch (err) {
    console.log(err);
    if (err.response.status === 409) {
      return 409;
    } else {
      return false;
    }
  }
};

export const verifyOtp = async (data) => {
  try {
    const res = await axiosClient.post('/api/auth/verifyOtp', data, {
      withCredentials: true,
    });
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

export const Otpresend = async (data) => {
  try {
    const res = await axiosClient.post('/api/auth/resendOtp', data);
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};
