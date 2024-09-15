import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductManagement from './ProductManagement';
import CategoryManagement from './CategoryManagement';
import SubCategoryManagement from './SubCategoryManagement';
import BrandManagement from './BrandManagement';

const AdminProductManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Product Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>
        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CategoryManagement />
            <SubCategoryManagement />
          </div>
        </TabsContent>
        <TabsContent value="brands">
          <BrandManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProductManagement;