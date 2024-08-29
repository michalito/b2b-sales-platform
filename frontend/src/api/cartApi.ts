import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const getCart = async (token: string) => {
  const response = await axios.get(`${API_URL}/cart`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const addToCart = async (token: string, productId: string, quantity: number) => {
  const response = await axios.post(`${API_URL}/cart/add`, { productId, quantity }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateCartItem = async (token: string, cartItemId: string, quantity: number) => {
  const response = await axios.put(`${API_URL}/cart/item/${cartItemId}`, { quantity }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const removeFromCart = async (token: string, cartItemId: string) => {
  const response = await axios.delete(`${API_URL}/cart/item/${cartItemId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const clearCart = async (token: string) => {
  const response = await axios.delete(`${API_URL}/cart`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};