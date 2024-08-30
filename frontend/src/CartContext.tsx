import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useError } from './ErrorContext';
import * as cartApi from './api/cartApi';
import { CartItem as CartItemType } from './types';

interface Cart {
  id: string;
  items: CartItemType[];
}

interface CartContextType {
  cart: Cart | null;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const { setError: setGlobalError } = useError();

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const fetchCart = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await cartApi.getCart(token);
      setCart(data); // Assuming data is the full cart object with an `items` array
    } catch (err) {
      setError('Failed to fetch cart');
      setGlobalError('Failed to fetch cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number) => {
    if (!token) return;
    setLoading(true);
    try {
      await cartApi.addToCart(token, productId, quantity);
      await fetchCart();
    } catch (err) {
      setError('Failed to add item to cart');
      setGlobalError('Failed to add item to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!token) return;
    setLoading(true);
    try {
      await cartApi.removeFromCart(token, cartItemId);
      await fetchCart();
    } catch (err) {
      setError('Failed to remove item from cart');
      setGlobalError('Failed to remove item from cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (cartItemId: string, quantity: number) => {
    if (!token) return;
    setLoading(true);
    try {
      await cartApi.updateCartItem(token, cartItemId, quantity);
      await fetchCart();
    } catch (err) {
      setError('Failed to update cart item');
      setGlobalError('Failed to update cart item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!token) return;
    setLoading(true);
    try {
      await cartApi.clearCart(token);
      setCart({ id: cart?.id || 'default-cart-id', items: [] });
    } catch (err) {
      setError('Failed to clear cart');
      setGlobalError('Failed to clear cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartItem, clearCart, loading, error }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
