import React from 'react';
import { Tag, ShoppingCart, Package } from 'lucide-react';

const ProductTile = ({ product }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
    <div className="relative pt-[56.25%]">
      {product.imageUrl && (
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="absolute top-0 left-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/placeholder-image.png';
          }}
        />
      )}
      {product.discountPercentage > 0 && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          {product.discountPercentage}% OFF
        </div>
      )}
    </div>
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2 truncate">{product.name}</h2>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600 flex items-center">
          <Tag size={16} className="mr-1" /> {product.color} / {product.size}
        </span>
        <span className="text-xs bg-gray-200 px-2 py-1 rounded">SKU: {product.sku}</span>
      </div>
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="text-lg font-bold">${product.wholesalePrice.toFixed(2)}</span>
          <span className="text-xs text-gray-500 ml-1">wholesale</span>
        </div>
        <span className="text-sm text-gray-500 line-through">${product.retailPrice.toFixed(2)} retail</span>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span className="flex items-center">
          <Package size={16} className="mr-1" /> {product.stock} in stock
        </span>
        <span>{product.category}</span>
      </div>
    </div>
    <div className="bg-gray-100 p-3 mt-2">
      <button className="w-full bg-blue-500 text-white py-2 rounded-md flex items-center justify-center hover:bg-blue-600 transition-colors">
        <ShoppingCart size={18} className="mr-2" /> Add to Cart
      </button>
    </div>
  </div>
);

export default ProductTile;