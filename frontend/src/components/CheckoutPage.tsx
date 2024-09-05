import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import { getCartTotal, createOrder } from '../api/orderApi';
import { User } from '../types';

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const { cart } = useCart();
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartTotal = async () => {
      if (token) {
        try {
          const { total } = await getCartTotal(token);
          setTotal(total);
        } catch (error) {
          console.error('Error fetching cart total:', error);
        }
      }
    };

    fetchCartTotal();
  }, [token]);

  const handleCheckout = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const pdfBlob = await createOrder(token);
      const url = window.URL.createObjectURL(new Blob([pdfBlob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'order-confirmation.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return <div className="text-center mt-8">{t('cart.empty')}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('checkout.title')}</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-2">{t('checkout.summaryTitle')}</h2>
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <span>{item.product.name} x {item.quantity}</span>
            <span>{(item.product.wholesalePrice * item.quantity).toFixed(2)}€</span>
          </div>
        ))}
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between items-center font-bold">
            <span>{t('checkout.total')}:</span>
            <span>{total.toFixed(2)}€</span>
          </div>
          {(user as User)?.discountRate > 0 && (
          <div className="text-sm text-gray-600 mt-1">
            {t('checkout.discountApplied', {
              discountRate: ((user as User).discountRate * 100).toFixed(2)
            })}
          </div>
          )}
        </div>
      </div>
      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
      >
      {isLoading ? t('checkout.processing') : t('checkout.confirmOrderAndDownload')}
    </button>
    </div>
  );
};

export default CheckoutPage;