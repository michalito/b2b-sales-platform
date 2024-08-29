import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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