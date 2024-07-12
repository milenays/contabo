import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getIntegrationStatus = async () => {
  const response = await axios.get(`${API_BASE_URL}/integrations/status`);
  return response.data;
};

export const saveIntegration = async (integrationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/integrations`, integrationData);
    return response.data;
  } catch (error) {
    console.error('Error saving integration:', error.response ? error.response.data : error.message); // Log the error for debugging
    throw error;
  }
};

export const getIntegrations = async () => {
  const response = await axios.get(`${API_BASE_URL}/integrations`);
  return response.data;
};

export const fetchTrendyolOrders = async () => {
  const response = await axios.get(`${API_BASE_URL}/trendyol/orders`);
  return response.data;
};

export const getAllOrders = async () => {
  const response = await axios.get(`${API_BASE_URL}/orders`);
  return response.data;
};

export const getOrderDetail = async (orderId) => {
  const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
  return response.data;
};

export const fetchOrders = async () => {
  const response = await axios.get(`${API_BASE_URL}/orders`);
  return response.data;
};

export const updateOrderStatusToPicking = async (orderNumber) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/orders/update-order-status-to-picking`, { orderNumber });
    return response.data;
  } catch (error) {
    console.error('Error updating order status to Picking:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const changeCargo = async (shipmentPackageId, cargoProvider) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/orders/${shipmentPackageId}/change-cargo`, { cargoProvider });
    return response.data;
  } catch (error) {
    console.error('Error changing cargo provider:', error.response ? error.response.data : error.message);
    throw error;
  }
};
