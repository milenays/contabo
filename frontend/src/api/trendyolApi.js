import axios from 'axios';

export const fetchTyBrands = async () => {
    const response = await axios.post('/api/trendyol/fetch-brands');
    return response.data;
};

export const fetchTyCategories = async () => {
    const response = await axios.post('/api/trendyol/fetch-categories');
    return response.data;
};

export const fetchTyCategoryAttributes = async () => {
    const response = await axios.post('/api/trendyol/fetch-category-attributes');
    return response.data;
};

export const fetchTrendyolAddresses = async () => {
    const response = await axios.get('/api/trendyol/fetch-addresses');
    return response.data;
};

export const sendProductToTrendyol = async (productData) => {
    const response = await axios.post('/api/trendyol/send-product', productData);
    return response.data;
};

export const updateProductOnTrendyol = async (productId, updateData) => {
    const response = await axios.put('/api/trendyol/update-product', { productId, updateData });
    return response.data;
};

export const getTrendyolAddresses = async () => {
    try {
      const response = await axios.get(`/api/trendyol/addresses`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Trendyol addresses:', error);
      throw error;
    }
};