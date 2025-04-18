import axiosClient from "../Middleware/AxiosClient";

export const fetchCategoriesApi = async () => {
  const res = await axiosClient.get(`/api/category`, {
    withCredentials: true,
  });
  console.log(res);
  return res.data.message;
}

export const createCategoryApi = async (name) => {
  const res = await axiosClient.post(`/api/category`, { name }, {
    withCredentials: true,
  });
  return res.data.data;
}

export const deleteCategoryApi = async (id) => {
  const res = await axiosClient.delete(`/api/category/${id}`, {
    withCredentials: true,
  });
  return res.data.data;
}
