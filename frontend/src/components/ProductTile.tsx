import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag, ShoppingCart, Package, AlertCircle } from 'lucide-react';
import { useCart } from '../CartContext';
import { Product } from '../types';

interface ProductTileProps {
  product: Product;
}

const ProductTile: React.FC<ProductTileProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [showQuantityInput, setShowQuantityInput] = useState(false);
  const { addToCart } = useCart();
  const { t } = useTranslation();

  const optimizedImageUrl = `${product.imageUrl}?auto=compress,format&fit=crop&w=600&h=600`;

  const handleAddToCart = () => {
    if (showQuantityInput) {
      addToCart(product.id, quantity);
      setQuantity(1);
      alert(`Added ${quantity} ${product.name}(s) to cart!`);
      setShowQuantityInput(false);
    } else {
      setShowQuantityInput(true);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(parseInt(e.target.value) || 1, product.stock));
    setQuantity(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="relative pt-[100%] overflow-hidden">
        {optimizedImageUrl && (
          <img 
            src={optimizedImageUrl} 
            alt={product.name} 
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-110"
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
            <span className="text-xs bg-gray-200 px-2 py-1 rounded">{product.brand.name}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-col">
              <span className="text-lg font-bold">{product.wholesalePrice.toFixed(2)}€</span>
              {product.discountedPrice < product.wholesalePrice && (
                <span className="text-sm text-red-500 line-through">{product.discountedPrice.toFixed(2)}€</span>
              )}
            </div>
            <span className="text-sm text-gray-500">{product.retailPrice.toFixed(2)}€ {t('product.retail')}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <span className="flex items-center">
              <Package size={16} className="mr-1" /> {product.stock} {t('product.inStock')}
            </span>
            <span>{product.subCategory.name}</span>
          </div>
          {product.stock <= 2 && (
            <div className="text-right">
              <p className="text-orange-500 flex items-center text-sm justify-end">
                <AlertCircle size={16} className="mr-1" />
                {t('product.lowStock', { count: product.stock })}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="bg-gray-100 p-3">
        {product.stock === 0 ? (
          <p className="text-red-500 text-center bg-red-100 p-2 rounded">{t('product.outOfStock')}</p>
        ) : (
          <>
            {showQuantityInput && (
              <div className="flex items-center justify-between mb-2">
                <label htmlFor={`quantity-${product.id}`} className="text-sm font-medium">{t('product.quantity')}:</label>
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
              <ShoppingCart size={18} className="mr-2" /> 
              {showQuantityInput ? t('product.confirm') : t('product.addToCart')}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductTile;