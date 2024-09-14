import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useMessage } from '../MessageContext';
import { Product } from '../types';

const API_URL = config.API_URL;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { setError } = useMessage();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to fetch product details. Please try again.');
      }
    };

    fetchProduct();
  }, [id, token, setError]);

  const handleEdit = () => {
    navigate(`/edit-product/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/products');
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete product. Please try again.');
      }
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <h3 className="text-xl font-light mb-4">{product.sku}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <img src={product.imageUrl} alt={product.name} className="w-full h-auto" />
        </div>
        <div>
          <p><strong>Color:</strong> {product.color}</p>
          <p><strong>Retail Price:</strong> ${product.retailPrice.toFixed(2)}</p>
          <p><strong>Wholesale Price:</strong> ${product.wholesalePrice.toFixed(2)}</p>
          <p><strong>Discount:</strong> {product.discountPercentage}%</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Subcategory:</strong> {product.subCategory}</p>
          <p><strong>Size:</strong> {product.size}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          {user?.role === 'ADMIN' && (
            <div className="mt-4">
              <button onClick={handleEdit} className="px-4 py-2 bg-blue-500 text-white rounded mr-2">Edit</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;