import axiosClient from "../Middleware/AxiosClient";

export const fetchCategoriesApi = async (langauge) => {
  const res = await axiosClient.get(`/api/category?lang=${langauge}`, {
    withCredentials: true,
  });
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

export const addSubCategoryApi = async (categoryId, subCategory) => {
  const res = await axiosClient.post(
    `/api/category/${categoryId}/subcategories`,
    { subCategory },
    { withCredentials: true }
  );
  return res.data.data;
};

export const deleteSubCategoryApi = async (categoryId, subCategory) => {
  const res = await axiosClient.delete(
    `/api/category/${categoryId}/subcategories/${encodeURIComponent(subCategory)}`,
    { withCredentials: true }
  );
  return res.data.data;
};
