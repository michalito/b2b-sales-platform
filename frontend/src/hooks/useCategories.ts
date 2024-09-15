import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config';
import { Category } from '../types';
import { useAuth } from '../AuthContext';
import { useMessage } from '../MessageContext';

const API_URL = config.API_URL;

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { setError, setSuccess } = useMessage();

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [token, setError]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      await axios.post(`${API_URL}/products/categories`, category, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Category added successfully');
      fetchCategories();
    } catch (error) {
      setError('Failed to add category');
    }
  };

  const updateCategory = async (id: string, category: Omit<Category, 'id'>) => {
    try {
      await axios.put(`${API_URL}/products/categories/${id}`, category, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Category updated successfully');
      fetchCategories();
    } catch (error) {
      setError('Failed to update category');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/products/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      setError('Failed to delete category');
    }
  };

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};