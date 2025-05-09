import axiosClient from '../Middleware/AxiosClient';

export const getStats = async () => {
  try {
    const res = await axiosClient.get('/api/admin/', {
      withCredentials: true,
    });
    return res.data.data;
  } catch (err) {
    if (err.response.status) {
      return err.response.status;
    }
  }
};

export const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const res = await axiosClient.get(
      `/api/admin/users?page=${page}&limit=${limit}`,
      {
        withCredentials: true,
      }
    );
    return res.data.data;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response.status;
    }
  }
};

export const changeUserStatus = async (userId, status) => {
  try {
    const res = await axiosClient.post(
      `/api/admin/users/${userId}`,
      { status },
      {
        withCredentials: true,
      }
    );
    return res.data.data;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response.status;
    }
  }
};

// Terms & Conditions API
export const getTerms = async () => {
  try {
    const res = await axiosClient.get('/api/terms', { withCredentials: true });
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const saveDraft = async (content, version) => {
  try {
    const res = await axiosClient.post(
      '/api/terms/draft',
      { content, version },
      { withCredentials: true }
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const publishTerms = async (content, version, publishedBy) => {
  try {
    const res = await axiosClient.post(
      '/api/terms/publish',
      { content, version, publishedBy },
      { withCredentials: true }
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const restoreVersion = async (version) => {
  try {
    const res = await axiosClient.post(
      `/api/terms/restore/${version}`,
      {},
      { withCredentials: true }
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const deleteVersion = async (version) => {
  try {
    const res = await axiosClient.delete(`/api/terms/${version}`, {
      withCredentials: true,
    });
    return res.data.data;
  } catch (err) {
    throw err;
  }
};
