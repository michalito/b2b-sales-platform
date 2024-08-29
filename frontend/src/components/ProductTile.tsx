import React, { useState } from 'react';
import { Tag, ShoppingCart, Package, AlertCircle } from 'lucide-react';
import { useCart } from '../CartContext';

const ProductTile = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [showQuantityInput, setShowQuantityInput] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (showQuantityInput) {
      addToCart(product.id, quantity);
      setQuantity(1); // Reset quantity after adding to cart
      alert(`Added ${quantity} ${product.name}(s) to cart!`); // Improve with better notification
      setShowQuantityInput(false); // Hide quantity input after adding to cart
    } else {
      setShowQuantityInput(true); // Show quantity input when Add to Cart is first clicked
    }
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(parseInt(e.target.value) || 1, product.stock));
    setQuantity(value);
  };

  if (!product) {
    return <div className="text-center text-red-500">Product not found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="relative pt-[56.25%]">
        {product.imageUrl && (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="absolute top-0 left-0 w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = '/placeholder-image.png'; }}
            loading="lazy"
          />
        )}
        {product.discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {product.discountPercentage}% OFF
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col justify-between" style={{ minHeight: '180px' }}>
        <div>
          <h2 className="text-lg font-semibold mb-1 truncate">{product.name}</h2>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600 flex items-center">
              <Tag size={16} className="mr-1" /> {product.color} / {product.size}
            </span>
            <span className="text-xs bg-gray-200 px-2 py-1 rounded">SKU: {product.sku}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-lg font-bold">${product.wholesalePrice.toFixed(2)}</span>
              <span className="text-xs text-gray-500 ml-1">wholesale</span>
            </div>
            <span className="text-sm text-gray-500 line-through">${product.retailPrice.toFixed(2)} retail</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <span className="flex items-center">
              <Package size={16} className="mr-1" /> {product.stock} in stock
            </span>
            <span>{product.category}</span>
          </div>
          {product.stock <= 2 && (
            <div className="mb-2" style={{ height: '24px' }}>
              <p className="text-orange-500 flex items-center text-sm">
                <AlertCircle size={16} className="mr-1" />
                Only {product.stock} left
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="bg-gray-100 p-3">
        {product.stock === 0 ? (
          <p className="text-red-500 text-center bg-red-100 p-2 rounded">Out of stock</p>
        ) : (
          <>
            {showQuantityInput && (
              <div className="flex items-center justify-between mb-2">
                <label htmlFor={`quantity-${product.id}`} className="text-sm font-medium">Quantity:</label>
                <input
                  id={`quantity-${product.id}`}
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-20 p-1 border rounded"
                />
              </div>
            )}
            <button 
              onClick={handleAddToCart}
              className="w-full bg-blue-500 text-white py-2 rounded-md flex items-center justify-center hover:bg-blue-600 transition-colors"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart size={18} className="mr-2" /> {showQuantityInput ? 'Confirm' : 'Add to Cart'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductTile;
