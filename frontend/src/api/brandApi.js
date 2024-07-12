import axios from 'axios';

const API_URL = 'http://localhost:5000/api/brands';

export const getBrands = async (page = 1, limit = 20, options = {}) => {
  try {
    const response = await axios.get(`${API_URL}/list`, {
      params: { page, limit },
      ...options
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
    } else {
      throw error;
    }
  }
};

export const addBrand = async (brand) => {
  const response = await axios.post(`${API_URL}/add`, brand);
  return response.data;
};

export const updateBrand = async (id, brand) => {
  const response = await axios.put(`${API_URL}/edit/${id}`, brand);
  return response.data;
};

export const deleteBrand = async (id) => {
  const response = await axios.delete(`${API_URL}/delete/${id}`);
  return response.data;
};

export const getTrendyolBrands = async () => {
  const response = await axios.get('/api/brands/trendyol-brands');
  return response.data;
};

export const searchTrendyolBrands = async (search, page = 1, limit = 20) => {
  try {
    const response = await axios.get(`${API_URL}/trendyol-brands`, {
      params: { search, page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching Trendyol brands:', error);
    throw error;
  }
};

export const getTrendyolBrandById = async (brandId) => {
  const response = await axios.get(`/api/brands/trendyol-brands/${brandId}`);
  return response.data;
};

export const getBrandById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/list`);
    const brands = response.data.brands;
    const brand = brands.find(brand => brand._id === id);
    if (!brand) {
      throw new Error('Brand not found');
    }
    return brand;
  } catch (error) {
    console.error('Error fetching brand by id:', error);
    throw error;
  }
};