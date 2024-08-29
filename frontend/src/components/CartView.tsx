import React from 'react';
import { useCart } from '../CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

const CartView: React.FC = () => {
  const { cart, loading, error } = useCart();

  if (loading) return <div className="text-center mt-8">Loading cart...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error loading cart: {error}</div>;

  if (!cart || cart.items.length === 0) {
    return <div className="text-center mt-8">Your cart is empty</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {cart.items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <div className="md:col-span-1">
          <CartSummary items={cart.items} />
        </div>
      </div>
    </div>
  );
};

export default CartView;
