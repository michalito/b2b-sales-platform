import React, { useState } from 'react';
import { useCart } from '../CartContext';
import { Trash2, AlertCircle } from 'lucide-react';

interface CartItemProps {
  item: {
    id: string;
    product: {
      id: string;
      name: string;
      wholesalePrice: number;
      stock: number;
      imageUrl?: string;
    };
    quantity: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (isNaN(newQuantity) || newQuantity < 1) return;
    setQuantity(newQuantity);
    updateCartItem(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex items-center border-b py-4">
      <img 
        src={item.product.imageUrl || '/placeholder-image.png'} 
        alt={item.product.name} 
        className="w-20 h-20 object-cover mr-4"
      />
      <div className="flex-grow">
        <h3 className="font-semibold">{item.product.name}</h3>
        <p className="text-gray-600">${item.product.wholesalePrice.toFixed(2)} each</p>
        <div className="flex items-center mt-2">
          <input
            type="number"
            min="1"
            max={item.product.stock}
            value={quantity}
            onChange={handleQuantityChange}
            className="w-16 p-1 border rounded mr-2"
          />
          <button onClick={handleRemove} className="text-red-500">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold">${(item.product.wholesalePrice * quantity).toFixed(2)}</p>
        {item.product.stock <= 2 && (
          <p className="text-orange-500 flex items-center text-sm mt-2">
            <AlertCircle size={16} className="mr-1" />
            Only {item.product.stock} left
          </p>
        )}
      </div>
    </div>
  );
};

export default CartItem;
