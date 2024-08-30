import axios from 'axios';
import { Product } from '../types';

const API_URL = 'http://localhost:3000/api';

export const getProducts = async (token: string, params: any) => {
  const response = await axios.get(`${API_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` },
    params
  });
  return response.data;
};

export const getProductById = async (token: string, id: string) => {
  const response = await axios.get(`${API_URL}/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createProduct = async (token: string, productData: Omit<Product, 'id'>) => {
  const response = await axios.post(`${API_URL}/products`, productData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateProduct = async (token: string, id: string, productData: Omit<Product, 'id'>) => {
  const response = await axios.put(`${API_URL}/products/${id}`, productData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteProduct = async (token: string, id: string) => {
  const response = await axios.delete(`${API_URL}/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};