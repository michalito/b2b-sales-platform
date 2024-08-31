import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

const API_URL = config.API_URL;

const PasswordResetRequest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setMessage('If an account with that email exists, we sent a password reset link.');
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block mb-2">Email</label>
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
        Request Password Reset
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </form>
  );
};

export default PasswordResetRequest;