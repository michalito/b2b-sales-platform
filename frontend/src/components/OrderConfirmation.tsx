import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmation: React.FC = () => {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Order Confirmed!</h1>
      <p className="mb-4">
        Thank you for your order. A PDF confirmation has been downloaded to your device.
      </p>
      <p className="mb-4">
        You can view your order history in your account settings.
      </p>
      <Link 
        to="/"
        className="inline-block bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default OrderConfirmation;