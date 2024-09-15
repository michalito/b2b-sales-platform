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
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const ProductManagement: React.FC = () => {
    const {
      products,
      loading,
      filters,
      setFilters,
      totalPages,
      addProduct,
      updateProduct,
      deleteProduct,
    } = useProducts();
  
    const { categories } = useCategories();
    const { subCategories } = useSubCategories();
    const { brands } = useBrands();
  
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
    const handlePageChange = (page: number) => {
      setFilters((prev) => ({ ...prev, page }));
    };
  
    if (loading) return <div>Loading...</div>;
  
    const handleDeleteProduct = (id: string) => {
      if (window.confirm('Are you sure you want to delete this product?')) {
        deleteProduct(id);
      }
    };
  
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
                    setIsAddDialogOpen(false);
                  });
                }}
                onCancel={() => setIsAddDialogOpen(false)}
                categories={categories}
                subCategories={subCategories}
                brands={brands}
              />
            </DialogContent>
          </Dialog>
        </div>
  
        <ProductTable
          products={products}
          onEdit={(product) => {
            setEditingProduct(product);
            setIsEditDialogOpen(true);
          }}
          onDelete={handleDeleteProduct}
        />
  
        <Pagination
          currentPage={filters.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
  
        {editingProduct && (
          <Dialog
            open={isEditDialogOpen}
            onOpenChange={(open) => {
              if (!open) {
                setEditingProduct(null);
                setIsEditDialogOpen(false);
              }
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
              </DialogHeader>
              <ProductForm
                product={editingProduct}
                onSubmit={(productData) => {
                  return updateProduct(editingProduct.id, productData).then(() => {
                    setEditingProduct(null);
                    setIsEditDialogOpen(false);
                  });
                }}
                onCancel={() => {
                  setEditingProduct(null);
                  setIsEditDialogOpen(false);
                }}
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
