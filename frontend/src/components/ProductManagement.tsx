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
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <ProductFilter filters={filters} setFilters={setFilters} />
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" /> Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              onSubmit={(product) => {
                return addProduct(product).then(() => {
                  setIsAddDialogOpen(false); // Close the dialog after submission
                });
              }}
              onCancel={() => setIsAddDialogOpen(false)} // Close the dialog on cancel
              categories={categories}
              subCategories={subCategories}
              brands={brands}
            />
          </DialogContent>
        </Dialog>
      </div>

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

      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
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
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProductManagement;
