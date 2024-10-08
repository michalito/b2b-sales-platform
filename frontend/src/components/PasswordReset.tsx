import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import { useLocation } from 'react-router-dom';
import { useMessage } from '../MessageContext';

const API_URL = config.API_URL;

const PasswordReset: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message] = useState('');
  const location = useLocation();
  const { setError, setSuccess } = useMessage();

  const token = new URLSearchParams(location.search).get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword: password });
      setSuccess('Password reset successful. You can now log in with your new password.');
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="block mb-2">New Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block mb-2">Confirm New Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Reset Password
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </form>
  );
};

export default PasswordReset;