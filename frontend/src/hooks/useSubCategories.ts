import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config';
import { SubCategory } from '../types';
import { useAuth } from '../AuthContext';
import { useMessage } from '../MessageContext';

const API_URL = config.API_URL;

export const useSubCategories = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { setError, setSuccess } = useMessage();

  const fetchSubCategories = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products/subcategories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubCategories(response.data);
    } catch (error) {
      setError('Failed to fetch subcategories');
    } finally {
      setLoading(false);
    }
  }, [token, setError]);

  useEffect(() => {
    fetchSubCategories();
  }, [fetchSubCategories]);

  const addSubCategory = async (subCategory: Omit<SubCategory, 'id' | 'category' | 'products'>) => {
    try {
      await axios.post(`${API_URL}/products/subcategories`, subCategory, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Subcategory added successfully');
      fetchSubCategories();
    } catch (error) {
      setError('Failed to add subcategory');
    }
  };

  const updateSubCategory = async (id: string, subCategory: Omit<SubCategory, 'id' | 'category' | 'products'>) => {
    try {
      await axios.put(`${API_URL}/products/subcategories/${id}`, subCategory, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Subcategory updated successfully');
      fetchSubCategories();
    } catch (error) {
      setError('Failed to update subcategory');
    }
  };

  const deleteSubCategory = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/products/subcategories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Subcategory deleted successfully');
      fetchSubCategories();
    } catch (error) {
      setError('Failed to delete subcategory');
    }
  };

  return {
    subCategories,
    loading,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
  };
};