import React from 'react';
import { useTranslation } from 'react-i18next';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    name: string;
    wholesalePrice: number;
    stock: number;
    imageUrl?: string;
  };
}

interface CartSummaryProps {
  items: CartItem[];
}

const CartSummary: React.FC<CartSummaryProps> = ({ items }) => {
  const { t } = useTranslation();

  const subtotal = items.reduce((total, item) => total + item.product.wholesalePrice * item.quantity, 0);
  const tax = subtotal * 0.24; // Assuming 24% tax
  const total = subtotal + tax;

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{t('cart.summaryTitle')}</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>{t('cart.subtotal')}:</span>
          <span>{subtotal.toFixed(2)}€</span>
        </div>
        <div className="flex justify-between">
          <span>{t('cart.tax')} (24%):</span>
          <span>{tax.toFixed(2)}€</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>{t('cart.total')}:</span>
          <span>{total.toFixed(2)}€</span>
        </div>
      </div>
      {/* <button
        onClick={proceedToCheckout}
        className="w-full bg-green-500 text-white py-2 rounded-md mt-4 hover:bg-green-600 transition-colors"
      >
        Proceed to Checkout
      </button> */}
    </div>
  );
};

export default CartSummary;
