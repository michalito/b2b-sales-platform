import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config';
import { Brand } from '../types';
import { useAuth } from '../AuthContext';
import { useMessage } from '../MessageContext';

const API_URL = config.API_URL;

export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { setError, setSuccess } = useMessage();

  const fetchBrands = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products/brands`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBrands(response.data);
    } catch (error) {
      setError('Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  }, [token, setError]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const addBrand = async (brand: Omit<Brand, 'id'>) => {
    try {
      await axios.post(`${API_URL}/products/brands`, brand, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Brand added successfully');
      fetchBrands();
    } catch (error) {
      setError('Failed to add brand');
    }
  };

  const updateBrand = async (id: string, brand: Omit<Brand, 'id'>) => {
    try {
      await axios.put(`${API_URL}/products/brands/${id}`, brand, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Brand updated successfully');
      fetchBrands();
    } catch (error) {
      setError('Failed to update brand');
    }
  };

  const deleteBrand = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/products/brands/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Brand deleted successfully');
      fetchBrands();
    } catch (error) {
      setError('Failed to delete brand');
    }
  };

  return {
    brands,
    loading,
    addBrand,
    updateBrand,
    deleteBrand,
  };
};