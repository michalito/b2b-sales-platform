import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../AuthContext';
import { useError } from '../ErrorContext';
// import { Link, useNavigate } from 'react-router-dom'; TO BE IMPLEMENTED
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const API_URL = config.API_URL;

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { setError } = useError();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const { token, userRole } = response.data;
      if (token && userRole) {
        login(token, userRole);
        navigate('/');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          switch (err.response.status) {
            case 400:
              setError('Invalid email or password.');
              break;
            case 401:
              setError('Unauthorized access. Please check your credentials.');
              break;
            case 500:
              setError('Internal server error. Please try again later.');
              break;
            default:
              setError(err.response.data.error || 'An error occurred');
          }
        } else if (err.request) {
          setError('No response from the server. Please check your network connection.');
        } else {
          setError('Error in setting up the request.');
        }
      } else {
        setError('An unexpected error occurred');
      }
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="../../public/logo/logo.svg" alt="Company Logo" className="mx-auto w-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{t('login.signIn')}</h2>
        </div>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">{t('login.email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">{t('login.password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              {t('login.loginButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LoginForm;