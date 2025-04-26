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

export const submitDocument = async (data) => {
  const res = await axiosClient.post('/api/document/', data, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  if (res.status === 201) {
    return res;
  }
};

export const getDocumentByUserId = async (id) => {
  const res = await axiosClient.get(`/api/document/user/${id}`, {
    withCredentials: true,
  });
  if (res.status === 200) {
    return res;
  }
};
