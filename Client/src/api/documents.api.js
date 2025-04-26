import axiosClient from '../Middleware/AxiosClient';

export const getAllDocuments = async () => {
  const res = await axiosClient.get('/api/document/', {
    withCredentials: true,
  });
  if (res.status === 200) {
    return res;
  } else if (res.status === 400) {
    return res.status;
  }
};

export const updateDocument = async (id, data) => {
  const res = await axiosClient.put(`/api/document/${id}`, data, {
    withCredentials: true,
  });
  if (res.status === 200) {
    return res;
  } else if (res.status === 400) {
    return res.status;
  }
};
