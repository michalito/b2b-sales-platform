import React from 'react';
import { FilterState } from '../types';

interface ProductFilterProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ filters, setFilters }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div>
      <input 
        type="text" 
        name="search" 
        value={filters.search} 
        onChange={handleChange} 
        placeholder="Search products" 
      />
      {/* Add more filter inputs here */}
    </div>
  );
};

export default ProductFilter;