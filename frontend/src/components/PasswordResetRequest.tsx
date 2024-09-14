import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import { useTranslation } from 'react-i18next';
import { useMessage } from '../MessageContext';

const API_URL = config.API_URL;

const PasswordResetRequest: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message] = useState('');
  const { setError, setSuccess } = useMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setSuccess(t('forgotPassword.successMessage'));
    } catch (error) {
      setError(t('forgotPassword.errorMessage'));
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
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
      {t('forgotPassword.passwordResetRequestButton')}
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </form>
  );
};

export default PasswordResetRequest;