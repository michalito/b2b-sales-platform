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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label htmlFor="email" className="block mb-2">{t('login.email')}</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-2">{t('login.password')}</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">{t('login.loginButton')}</button>
      {/* <div className="text-center">
        <Link to="/forgot-password" className="text-blue-500 hover:underline">{t('login.forgotPassword')}</Link>
      </div> */}
    </form>
  );
};

export default LoginForm;