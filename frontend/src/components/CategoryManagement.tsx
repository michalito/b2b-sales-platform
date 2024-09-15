import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, Pencil, Trash2 } from 'lucide-react';
import { Category } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const CategoryManagement: React.FC = () => {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  if (loading) return <div>Loading...</div>;

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === '') {
      // Optionally, show an error message
      return;
    }
    await addCategory({
        name: newCategoryName,
        subCategories: [],
        products: []
    });
    setNewCategoryName('');
    setIsAddDialogOpen(false);
  };

  const handleEditCategory = async () => {
    if (editingCategoryName.trim() === '' || !editingCategory) {
      // Optionally, show an error message
      return;
    }
    await updateCategory(editingCategory.id, {
        name: editingCategoryName,
        subCategories: [],
        products: []
    });
    setEditingCategory(null);
    setEditingCategoryName('');
    setIsEditDialogOpen(false);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" /> Add New Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category Name"
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory}>Add</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between">
              <span>{category.name}</span>
              <div className="flex space-x-2">
                <Dialog
                  open={isEditDialogOpen && editingCategory?.id === category.id}
                  onOpenChange={(open) => {
                    if (!open) {
                      setIsEditDialogOpen(false);
                      setEditingCategory(null);
                      setEditingCategoryName('');
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingCategory(category);
                        setEditingCategoryName(category.name);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                        placeholder="Category Name"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditDialogOpen(false);
                            setEditingCategory(null);
                            setEditingCategoryName('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleEditCategory}>Save</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() => handleDeleteCategory(category.id)}
                  variant="ghost"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default CategoryManagement;
