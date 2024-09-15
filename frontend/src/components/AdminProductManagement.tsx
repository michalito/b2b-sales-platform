import React from 'react';
import ProductManagement from './ProductManagement.tsx';
import CategoryManagement from './CategoryManagement';
import SubCategoryManagement from './SubCategoryManagement.tsx';
import BrandManagement from './BrandManagement.tsx';

const AdminProductManagement: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Product Management</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <ProductManagement />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <CategoryManagement />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Subcategories</h2>
          <SubCategoryManagement />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Brands</h2>
          <BrandManagement />
        </section>
      </div>
    </div>
  );
};

export default AdminProductManagement;