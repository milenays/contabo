import axios from 'axios';

const API_URL = 'http://localhost:5000/api/trendyol';

export const getShipmentAddresses = async () => {
  try {
    const response = await axios.get(`${API_URL}/addresses`);
    return response.data;
  } catch (error) {
    console.warn('Error fetching shipment addresses:', error);
    return []; // Boş dizi döndür
  }
};