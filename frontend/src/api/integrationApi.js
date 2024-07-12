import axios from 'axios';

export const getIntegrations = async () => {
  const response = await axios.get('/api/integrations');
  return response.data;
};

export const saveIntegration = async (integrationData) => {
  const response = await axios.post('/api/integrations/save', integrationData);
  return response.data;
};

export const fetchTrendyolProducts = async (integrationId) => {
  const response = await axios.get(`/api/integrations/fetch-trendyol-products/${integrationId}`);
  return response.data;
};

export const deleteIntegration = async (id) => {
  const response = await axios.delete(`/api/integrations/${id}`);
  return response.data;
};

export const updateIntegrationStatus = async (integrationId, status) => {
  const response = await axios.put(`/api/integrations/${integrationId}/status`, { status });
  return response.data;
};