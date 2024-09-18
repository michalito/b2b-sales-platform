import axios from 'axios';
import { User } from '../types';
import config from '../config';

const API_URL = config.API_URL;

const getHeaders = (token: string | null) => {
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllUsers = async (token: string | null) => {
  const response = await axios.get(`${API_URL}/users/all`, {
    headers: getHeaders(token)
  });
  return response.data;
};

export const createUser = async (token: string | null, userData: Omit<User, 'id'>) => {
  console.log('Making API call to create user:', userData);
  const response = await axios.post(`${API_URL}/users/register`, userData, {
    headers: getHeaders(token)
  });
  return response.data;
};

export const updateUser = async (token: string | null, id: string, userData: Partial<User>) => {
  const response = await axios.put(`${API_URL}/users/${id}`, userData, {
    headers: getHeaders(token)
  });
  return response.data;
};

export const deleteUser = async (token: string | null, id: string) => {
  const response = await axios.delete(`${API_URL}/users/${id}`, {
    headers: getHeaders(token)
  });
  return response.data;
};

export const approveUser = async (token: string | null, id: string) => {
  const response = await axios.post(`${API_URL}/users/approve/${id}`, {}, {
    headers: getHeaders(token)
  });
  return response.data;
};