import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

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
};

const ProductList: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const { data, isLoading, error, isFetching } = useQuery<ProductResponse>(
    ['products', filters],
    async () => {
      const response = await axios.get('http://localhost:3000/api/products', { params: filters });
      return response.data;
    },
    { keepPreviousData: true }
  );

  const { data: filterOptions, isLoading: optionsLoading, error: optionsError } = useQuery<FilterOptions>(
    'filterOptions',
    async () => {
      const response = await axios.get('http://localhost:3000/api/products/filter-options');
      return response.data;
    }
  );

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

  if (isLoading || optionsLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error || optionsError) return <div className="text-center mt-8 text-red-500">An error occurred</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Product List</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
        <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={handleSearchChange}
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
        <select onChange={handleSortChange} value={`${filters.sortBy}-${filters.sortOrder}`} className="w-full sm:w-auto p-2 border rounded">
          <option value="">Sort By</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="retailPrice-asc">Price (Low to High)</option>
          <option value="retailPrice-desc">Price (High to Low)</option>
        </select>
        <button onClick={clearFilters} className="w-full sm:w-auto p-2 bg-red-500 text-white rounded hover:bg-red-600">
          Clear Filters
        </button>
      </div>

      {(isLoading || isFetching) && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.products.map(product => (
          <div key={product.id} className="border p-4 rounded shadow-lg bg-white">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600">Color: {product.color}</p>
            <p className="text-gray-600">Size: {product.size}</p>
            <p className="font-bold mt-2">Retail Price: ${product.retailPrice.toFixed(2)}</p>
            <p className="text-green-600">Wholesale Price: ${product.wholesalePrice.toFixed(2)}</p>
            {product.discountPercentage > 0 && (
              <p className="text-red-500">Discount: {product.discountPercentage}% off</p>
            )}
            <p className="mt-2">Category: {product.category} - {product.subCategory}</p>
            <p className="text-gray-500">Stock: {product.stock} available</p>
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