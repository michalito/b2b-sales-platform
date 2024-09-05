import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import config from '../config';
import { useTranslation } from 'react-i18next';

const API_URL = config.API_URL;

const RegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { email, password });
      login(response.data.token, response.data.userRole);
    } catch (err) {
      setError('Registration being proccessed. Account needs to be approved by the team!'); // Temp solution
      // setError('Registration failed. Email might already be in use.'); THERE IS A BUG HERE
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">{t('login.register')}</button>
    </form>
  );
};

export default RegisterForm;