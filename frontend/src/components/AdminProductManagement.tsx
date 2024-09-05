import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../AuthContext';
import { useError } from '../ErrorContext';
import ProductForm from './ProductForm';
import { deleteProduct } from '../api/productApi';

interface Product {
  id: string;
  sku: string;
  name: string;
  color: string;
  retailPrice: number;
  wholesalePrice: number;
  discountPercentage: number;
  category: string;
  subCategory: string;
  size: string;
  stock: number;
  imageUrl?: string;
}

interface PaginatedResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
}

const API_URL = config.API_URL;

const AdminProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const { token } = useAuth();
  const { setError } = useError();

  useEffect(() => {
    fetchProducts(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const fetchProducts = async (page: number, search: string) => {
    try {
      const response = await axios.get<PaginatedResponse>(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 10, search }
      });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again.');
    }
  };

  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      await axios.post(`${API_URL}/products`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts(currentPage, searchTerm);
      setError('Product added successfully');
      setShowAddForm(false); // Hide the form after successful addition
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product. Please try again.');
    }
  };

  const handleEditProduct = async (id: string, productData: Omit<Product, 'id'>) => {
    try {
      await axios.put(`${API_URL}/products/${id}`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts(currentPage, searchTerm);
      setEditingProduct(null);
      setError('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Please try again.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(token!, id);
        // Update the local state to remove the deleted product
        setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
        setError('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        if (axios.isAxiosError(error) && error.response) {
          const errorData = error.response.data;
          setError(`Failed to delete product: ${errorData.error}${errorData.details ? ` ${errorData.details}` : ''}`);
        } else {
          setError('Failed to delete product. Please try again.');
        }
      }
    }
  };
  

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Product Management</h1>
      
      {/* Add New Product Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
      >
        {showAddForm ? 'Cancel' : 'Add New Product'}
      </button>

      {/* Add New Product Form */}
      {showAddForm && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Add New Product</h2>
          <ProductForm onSubmit={handleAddProduct} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      <h2 className="text-xl font-semibold mt-8 mb-2">Product List</h2>
      
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">SKU</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Category</th>
              <th className="px-4 py-2 border-b">Price</th>
              <th className="px-4 py-2 border-b">Stock</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-2 border-b">{product.sku}</td>
                <td className="px-4 py-2 border-b">{product.name}</td>
                <td className="px-4 py-2 border-b">{product.category}</td>
                <td className="px-4 py-2 border-b">{product.retailPrice.toFixed(2)}€</td>
                <td className="px-4 py-2 border-b">{product.stock}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === page ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {editingProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-semibold mb-4">Edit Product</h3>
            <ProductForm
              product={editingProduct}
              onSubmit={(productData) => handleEditProduct(editingProduct.id, productData)}
              onCancel={() => setEditingProduct(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductManagement;