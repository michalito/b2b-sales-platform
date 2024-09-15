import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductTable } from './ProductTable.tsx';
import ProductForm from './ProductForm';
import ProductFilter from './ProductFilter.tsx';
import Pagination from './Pagination.tsx';
import { Product } from '../types';
import { useCategories } from '../hooks/useCategories';
import { useSubCategories } from '../hooks/useSubCategories';
import { useBrands } from '../hooks/useBrands';

export const ProductManagement: React.FC = () => {
  const { 
    products, 
    loading, 
    filters, 
    setFilters, 
    totalPages, 
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useProducts();
  const { categories } = useCategories();
  const { subCategories } = useSubCategories();
  const { brands } = useBrands();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <ProductFilter filters={filters} setFilters={setFilters} />
      
      <button 
        onClick={() => setShowAddForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add New Product
      </button>

      <ProductTable
        products={products}
        onEdit={setEditingProduct}
        onDelete={deleteProduct}
      />

      <Pagination
        currentPage={filters.page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

        {showAddForm && (
        <ProductForm
            onSubmit={addProduct}
            onCancel={() => setShowAddForm(false)}
            categories={categories}
            subCategories={subCategories}
            brands={brands}
        />
        )}

        {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSubmit={(product) => {
            return updateProduct(editingProduct.id, product).then(() => {
              setEditingProduct(null);
            });
          }}
          onCancel={() => setEditingProduct(null)}
          categories={categories}
          subCategories={subCategories}
          brands={brands}
        />
        )}
    </div>
  );
};

export default ProductManagement;