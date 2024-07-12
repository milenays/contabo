import axios from 'axios';

const API_URL = 'http://localhost:5000/api/categories';

export const getCategories = async (page = 1, limit = 20) => {
  const response = await axios.get(`${API_URL}/list`, { params: { page, limit } });
  return response.data;
};

export const addCategory = async (category) => {
  const response = await axios.post(`${API_URL}/add`, category);
  return response.data;
};

export const updateCategory = async (id, category) => {
  const response = await axios.put(`${API_URL}/edit/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axios.delete(`${API_URL}/delete/${id}`);
  return response.data;
};

export const getCategoryWithTrendyolDetails = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/with-trendyol-details`);
  return response.data;
};

export const searchTrendyolCategories = async (search, page = 1, limit = 20) => {
  const response = await axios.get(`${API_URL}/search-trendyol-categories`, {
    params: { search, page, limit }
  });
  return response.data;
};

export const getTrendyolCategoryById = async (id) => {
  const response = await axios.get(`${API_URL}/trendyol-category/${id}`);
  return response.data;
};

export const getTrendyolCategoryAttributes = async (categoryId) => {
  const response = await axios.get(`${API_URL}/trendyol-attributes/${categoryId}`);
  return response.data;
};