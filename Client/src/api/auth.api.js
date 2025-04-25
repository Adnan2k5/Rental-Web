import { loginStart, loginSuccess } from '../Store/UserSlice';
import axiosClient from '../Middleware/AxiosClient';
import { id } from 'date-fns/locale';

export const loginUser = async (data, dispatch) => {
  try {
    dispatch(loginStart());
    const res = await axiosClient.post('/api/auth/login', data, {
      withCredentials: true,
    });
    console.log('res', res);
    if (res.status === 200) {
      dispatch(loginSuccess(res.data.data));
      return 200;
    }
  } catch (err) {
    // dispatch(loginFailure(err.response.status));
    if (err.response.status) {
      return err.response.status;
    }
  }
};

export const userRegister = async (data) => {
  try {
    const res = await axiosClient.post('/api/auth/signUp', data, {
      withCredentials: true,
    });
    if (res.status === 201) {
      return true;
    } else if (res.status === 409) {
      return 409;
    }
  } catch (err) {
    if (err.response.status === 409) {
      return 409;
    } else {
      return false;
    }
  }
};

export const verifyOtp = async (data, dispatch) => {
  try {
    const res = await axiosClient.post('/api/auth/verifyOtp', data, {
      withCredentials: true,
    });
    if (res.status === 200) {
      dispatch(loginSuccess(res.data.data));
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
    const res = await axiosClient.post('/api/auth/resendOtp', { email: data });
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const Otpsend = async (data) => {
  try {
    console.log('data', data);
    const res = await axiosClient.post('/api/auth/sendOtp', data);
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const resetPassword = async (data) => {
  console.log('data', data);
  try {
    const res = await axiosClient.post('/api/auth/forgotPassword', data);
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return err.response.status;
  }
};

export const updatePassword = async (data) => {
  try {
    const otpdata = { email: data.email, otp: data.otp };
    const verify = await axiosClient.post('/api/auth/verifyOtp', otpdata);
    if (verify.status === 200) {
      const res = await axiosClient.post('/api/auth/updatePassword', data);
      if (res.status === 200) {
        return true;
      } else {
        return false;
      }
    }
  } catch (err) {
    return err.response.status;
  }
};

export const VerifyEmail = async (data, dispatch) => {
  try {
    const otpdata = { email: data.email, otp: data.otp, id: data.id };
    const res = await axiosClient.put('/api/auth/updateEmail', otpdata, {
      withCredentials: true,
    });
    if (res.status === 200) {
      console.log('res', res);
      dispatch(loginSuccess(res.data.data));
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const UserUpdate = async (data, dispatch) => {
  try {
    const res = await axiosClient.put(`/api/user/update/${data._id}`, data, {
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

export const logoutUser = async () => {
  try {
    const res = await axiosClient.get('/api/auth/logoutUser', {
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
}