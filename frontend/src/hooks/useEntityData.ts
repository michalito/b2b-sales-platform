import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../AuthContext';
import { useMessage } from '../MessageContext';

const API_URL = config.API_URL;

export function useEntityData<T>(endpoint: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { setError } = useMessage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
        setError(`Failed to fetch data from ${endpoint}`);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token, endpoint, setError]);

  return { data, loading };
}