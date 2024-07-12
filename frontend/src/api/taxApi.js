import axios from 'axios';

const API_URL = 'http://localhost:5000/api/taxes';

export const getTaxes = async () => {
  const response = await axios.get(`${API_URL}/list`);
  return response.data;
};

export const addTax = async (tax) => {
  const response = await axios.post(`${API_URL}/add`, tax);
  return response.data;
};

export const updateTax = async (id, tax) => {
  const response = await axios.put(`${API_URL}/edit/${id}`, tax);
  return response.data;
};

export const deleteTax = async (id) => {
  const response = await axios.delete(`${API_URL}/delete/${id}`);
  return response.data;
};
