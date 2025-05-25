import { loginStart, loginSuccess } from '../Store/UserSlice';
import axiosClient from '../Middleware/AxiosClient';

export const loginUser = async (data, dispatch) => {
  try {
    dispatch(loginStart());
    const res = await axiosClient.post('/api/auth/login', data, {
      withCredentials: true,
    });
    if (res.status === 200) {
      dispatch(loginSuccess(res.data.data));
      return 200;
    } else {
      return 400;
    }
  } catch (err) {
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
    if (err.response.status) {
      return err.response.status;
    }
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
    const res = await axiosClient.post('/api/auth/sendOtp', data);
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const resetPassword = async (data) => {
  try {
    const res = await axiosClient.post('/api/auth/forgotPassword', data);
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
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
      dispatch(loginSuccess(res.data.data));
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const UserUpdate = async (data, dispatch) => {
  try {
    const res = await axiosClient.put(`/api/user/update/${data._id}`, data, {
      withCredentials: true,
    });
    if (res.status === 200) {
      dispatch(loginSuccess(res.data.data));
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export const updateProfilePicture = async (formData, dispatch) => {
  try {
    const res = await axiosClient.put(
      '/api/user/update-profile-picture',
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('Error updating profile picture:', err);
    return false;
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
    return false;
  }
};
