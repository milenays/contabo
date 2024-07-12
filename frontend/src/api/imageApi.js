import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const uploadImage = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/images/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
