import axios from 'axios';
import config from '../config';

const API_URL = config.API_URL;

export const createOrder = async (token: string) => {
  const response = await axios.post(`${API_URL}/orders/create`, {}, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob', // Important for receiving the PDF
  });
  return response.data;
};

export const getOrders = async (token: string) => {
  const response = await axios.get(`${API_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getCartTotal = async (token: string) => {
  const response = await axios.get(`${API_URL}/cart/total`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};