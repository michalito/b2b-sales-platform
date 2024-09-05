import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../AuthContext';
import { useError } from '../ErrorContext';
import ProductTile from './ProductTile';
import { useTranslation } from 'react-i18next';
// import { Product as ProductType } from '../types';

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

const API_URL = config.API_URL;

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
  const { token, isAuthenticated } = useAuth();
  const { setError } = useError();
  const { t } = useTranslation();
  // const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const { data, isLoading, error, isFetching } = useQuery<ProductResponse>(
    ['products', filters],
    async () => {
      if (!token) {
        throw new Error('Token is missing');
      }
      const response = await axios.get(`${API_URL}/products`, {
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
      const response = await axios.get(`${API_URL}/products/filter-options`, {
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

  if (optionsLoading) {
    return <div>Loading filter options...</div>;
  }

  if (optionsError) {
    return <div>Error loading filter options: {(optionsError as Error).message}</div>;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
      page: 1,
    }));
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
  if (error) {
    console.error('Product error:', error);
    return <div className="text-center mt-8 text-red-500">An error occurred: {(error as Error).message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{t('productList.title')}</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
        <input
          type="text"
          name="search"
          placeholder={t('productList.searchPlaceholder')}
          value={filters.search}
          onChange={handleInputChange}
          className="w-full sm:w-64 p-2 border rounded"
        />
        <select name="category" onChange={handleFilterChange} value={filters.category} className="w-full sm:w-auto p-2 border rounded">
        <option value="">{t('productList.allCategories')}</option>
          {filterOptions?.categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select name="subCategory" onChange={handleFilterChange} value={filters.subCategory} className="w-full sm:w-auto p-2 border rounded">
        <option value="">{t('productList.allSubcategories')}</option>
          {filterOptions?.subCategories.map(subCategory => (
            <option key={subCategory} value={subCategory}>{subCategory}</option>
          ))}
        </select>
        <select name="color" onChange={handleFilterChange} value={filters.color} className="w-full sm:w-auto p-2 border rounded">
        <option value="">{t('productList.allColors')}</option>
          {filterOptions?.colors.map(color => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
        <select name="size" onChange={handleFilterChange} value={filters.size} className="w-full sm:w-auto p-2 border rounded">
        <option value="">{t('productList.allSizes')}</option>
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
          <option value="">{t('productList.sortBy')}</option>
          <option value="name-asc">{t('productList.nameAZ')}</option>
          <option value="name-desc">{t('productList.nameZA')}</option>
          <option value="retailPrice-asc">{t('productList.priceLowHigh')}</option>
          <option value="retailPrice-desc">{t('productList.priceHighLow')}</option>
          <option value="discountPercentage-asc">{t('productList.discountLowHigh')}</option>
          <option value="discountPercentage-desc">{t('productList.discountHighLow')}</option>
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
          <label htmlFor="showOnlyAvailable">{t('productList.showOnlyAvailable')}</label>
        </div>
        <button onClick={clearFilters} className="w-full sm:w-auto p-2 bg-red-500 text-white rounded hover:bg-red-600">
        {t('productList.clearFilters')}
        </button>
      </div>

      {(isLoading || isFetching) && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data?.products.map(product => (
          <ProductTile key={product.id} product={product} />
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
