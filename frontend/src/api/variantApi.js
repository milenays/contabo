import axios from 'axios';

const API_URL = 'http://localhost:5000/api/variants';

export const getVariants = async () => {
  const response = await axios.get(`${API_URL}/list`);
  return response.data;
};

export const addVariant = async (variant) => {
  const response = await axios.post(`${API_URL}/add`, variant);
  return response.data;
};

export const updateVariant = async (id, variant) => {
  const response = await axios.put(`${API_URL}/edit/${id}`, variant);
  return response.data;
};

export const deleteVariant = async (id) => {
  const response = await axios.delete(`${API_URL}/delete/${id}`);
  return response.data;
};
