import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const EmailVerification: React.FC = () => {
  const [message, setMessage] = useState('Verifying your email...');
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = new URLSearchParams(location.search).get('token');
      try {
        await axios.post('http://localhost:3000/api/auth/verify-email', { token });
        setMessage('Email verified successfully. You can now log in.');
      } catch (error) {
        setMessage('Email verification failed. Please try again or contact support.');
      }
    };

    verifyEmail();
  }, [location]);

  return (
    <div className="text-center mt-8">
      <p>{message}</p>
    </div>
  );
};

export default EmailVerification;