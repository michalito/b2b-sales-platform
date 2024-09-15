import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config';
import { Product, FilterState, ProductInput } from '../types';
import { useAuth } from '../AuthContext';
import { useMessage } from '../MessageContext';

const API_URL = config.API_URL;

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    subCategory: '',
    brand: '',
    color: '',
    size: '',
    sortBy: '',
    sortOrder: 'asc',
    page: 1,
    search: '',
    minDiscount: '',
    showOnlyAvailable: false,
  });
  const [totalPages, setTotalPages] = useState(1);
  const { token } = useAuth();
  const { setError, setSuccess } = useMessage();

  const fetchProducts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products`, {
        params: filters,
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [token, filters, setError]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (product: ProductInput): Promise<void> => {
    try {
      await axios.post(`${API_URL}/products`, product, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Product added successfully');
      fetchProducts();
    } catch (error) {
      setError('Failed to add product');
    }
  };

  const updateProduct = async (id: string, product: ProductInput): Promise<void> => {
    try {
      await axios.put(`${API_URL}/products/${id}`, product, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Product updated successfully');
      fetchProducts();
    } catch (error) {
      setError('Failed to update product');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      setError('Failed to delete product');
    }
  };

  return {
    products,
    loading,
    filters,
    setFilters,
    totalPages,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};