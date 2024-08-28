import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useError } from '../ErrorContext';
import { getProducts, deleteProduct } from '../api/productApi';

interface Product {
  id: string;
  name: string;
  color: string;
  retailPrice: number;
  wholesalePrice: number;
  discountPercentage: number;
  category: string;
  subCategory: string;
  size: string;
  stock: number;
}

interface FilterState {
  category: string;
  subCategory: string;
  color: string;
  size: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  search: string;
  minDiscount: string;
  maxDiscount: string;
  showOnlyAvailable: boolean;
}
interface FilterOptions {
  categories: string[];
  subCategories: string[];
  colors: string[];
  sizes: string[];
}

interface ProductResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
}

const initialFilterState: FilterState = {
  category: '',
  subCategory: '',
  color: '',
  size: '',
  sortBy: '',
  sortOrder: 'asc',
  page: 1,
  search: '',
  minDiscount: '',
  maxDiscount: '',
  showOnlyAvailable: false,
};

const ProductList: React.FC = () => {
  const { token, user, isAuthenticated } = useAuth();
  const { setError } = useError();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const { data, isLoading, error, isFetching } = useQuery<ProductResponse>(
    ['products', filters],
    async () => {
      if (!token) {
        throw new Error('Token is missing');
      }
      const response = await axios.get('http://localhost:3000/api/products', {
        params: filters,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    {
      keepPreviousData: true,
      enabled: isAuthenticated && !!token,
      onError: (err) => {
        console.error('Products fetch error:', err);
        setError('Failed to fetch products. Please try again.');
      },
    }
  );

  const { data: filterOptions, isLoading: optionsLoading, error: optionsError } = useQuery<FilterOptions>(
    'filterOptions',
    async () => {
      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }
      const response = await axios.get('http://localhost:3000/api/products/filter-options', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    {
      enabled: isAuthenticated && !!token,
      onError: (err) => console.error('Filter options fetch error:', err),
    }
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    setFilters(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value, 
      page: 1 
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: event.target.value, page: 1 }));
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = event.target.value.split('-');
    setFilters(prev => ({ ...prev, sortBy, sortOrder: sortOrder as 'asc' | 'desc', page: 1 }));
  };

  const clearFilters = () => {
    setFilters(initialFilterState);
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(token!, id);
        refetch();
        setError('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete product. Please try again.');
      }
    }
  };

  if (isLoading || optionsLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error || optionsError) {
    console.error('Product error:', error);
    console.error('Filter options error:', optionsError);
    return <div className="text-center mt-8 text-red-500">An error occurred: {error?.message || optionsError?.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Product List</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
        <input
          type="text"
          name="search"
          placeholder="Search products..."
          value={filters.search}
          onChange={handleInputChange}
          className="w-full sm:w-64 p-2 border rounded"
        />
        <select name="category" onChange={handleFilterChange} value={filters.category} className="w-full sm:w-auto p-2 border rounded">
          <option value="">All Categories</option>
          {filterOptions?.categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select name="subCategory" onChange={handleFilterChange} value={filters.subCategory} className="w-full sm:w-auto p-2 border rounded">
          <option value="">All Subcategories</option>
          {filterOptions?.subCategories.map(subCategory => (
            <option key={subCategory} value={subCategory}>{subCategory}</option>
          ))}
        </select>
        <select name="color" onChange={handleFilterChange} value={filters.color} className="w-full sm:w-auto p-2 border rounded">
          <option value="">All Colors</option>
          {filterOptions?.colors.map(color => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
        <select name="size" onChange={handleFilterChange} value={filters.size} className="w-full sm:w-auto p-2 border rounded">
          <option value="">All Sizes</option>
          {filterOptions?.sizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <div className="flex items-center">
          <input
            type="number"
            name="minDiscount"
            placeholder="Min Discount %"
            value={filters.minDiscount}
            onChange={handleInputChange}
            className="w-24 p-2 border rounded mr-2"
          />
          <span>-</span>
          <input
            type="number"
            name="maxDiscount"
            placeholder="Max Discount %"
            value={filters.maxDiscount}
            onChange={handleInputChange}
            className="w-24 p-2 border rounded ml-2"
          />
        </div>
        <select name="sortBy" onChange={handleSortChange} value={`${filters.sortBy}-${filters.sortOrder}`} className="w-full sm:w-auto p-2 border rounded">
          <option value="">Sort By</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="retailPrice-asc">Price (Low to High)</option>
          <option value="retailPrice-desc">Price (High to Low)</option>
          <option value="discountPercentage-asc">Discount % (Low to High)</option>
          <option value="discountPercentage-desc">Discount % (High to Low)</option>
        </select>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showOnlyAvailable"
            name="showOnlyAvailable"
            checked={filters.showOnlyAvailable}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label htmlFor="showOnlyAvailable">Show only Available</label>
        </div>
        <button onClick={clearFilters} className="w-full sm:w-auto p-2 bg-red-500 text-white rounded hover:bg-red-600">
          Clear Filters
        </button>
      </div>

      {(isLoading || isFetching) && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {data?.products.map(product => (
    <div key={product.id} className="border rounded-lg shadow-md bg-white overflow-hidden flex flex-col">
      <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
        {product.imageUrl && (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="absolute top-0 left-0 w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.png';
            }}
          />
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-2 truncate">{product.name}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">{product.color}</span>
            <span className="text-sm text-gray-600">{product.size}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">${product.retailPrice.toFixed(2)}</span>
            <span className="text-sm text-green-600">${product.wholesalePrice.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-2">
          {product.discountPercentage > 0 && (
            <p className="text-sm text-red-500 mb-1">Discount: {product.discountPercentage}% off</p>
          )}
          <p className="text-xs text-gray-500">{product.category} - {product.subCategory}</p>
          <p className="text-xs text-gray-500">Stock: {product.stock} available</p>
        </div>
      </div>
    </div>
  ))}
</div>

      {/* Pagination */}
      <div className="mt-8 flex flex-wrap justify-center">
        {Array.from({ length: data?.totalPages || 0 }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`m-1 px-3 py-1 rounded ${
              page === data?.currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
