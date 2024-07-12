import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tags';

export const getTags = async () => {
  const response = await axios.get(`${API_URL}/list`);
  return response.data;
};

export const addTag = async (tag) => {
  const response = await axios.post(`${API_URL}/add`, tag);
  return response.data;
};

export const updateTag = async (id, tag) => {
  const response = await axios.put(`${API_URL}/edit/${id}`, tag);
  return response.data;
};

export const deleteTag = async (id) => {
  const response = await axios.delete(`${API_URL}/delete/${id}`);
  return response.data;
};
