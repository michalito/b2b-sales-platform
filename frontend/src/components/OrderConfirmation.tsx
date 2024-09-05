import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const OrderConfirmation: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">{t('checkout.orderConfirmed')}</h1>
      <p className="mb-4">
        {t('checkout.confirmedOrderMessage')}
      </p>
      {/* <p className="mb-4">
        You can view your order history in your account settings.
      </p> */}
      <Link 
        to="/"
        className="inline-block bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        {t('checkout.returnHomeButton')}
      </Link>
    </div>
  );
};

export default OrderConfirmation;