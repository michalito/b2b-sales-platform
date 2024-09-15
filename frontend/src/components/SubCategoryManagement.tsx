import React, { useState } from 'react';
import { useSubCategories } from '../hooks/useSubCategories';
import { useCategories } from '../hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const SubCategoryManagement: React.FC = () => {
  const { subCategories, loading, addSubCategory, updateSubCategory, deleteSubCategory } = useSubCategories();
  const { categories } = useCategories();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Add SubCategory States
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Edit SubCategory States
  const [editingSubCategoryId, setEditingSubCategoryId] = useState<string | null>(null);
  const [editingSubCategoryName, setEditingSubCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string>('');

  if (loading) return <div>Loading...</div>;

  const handleAddSubCategory = async () => {
    if (newSubCategoryName.trim() === '' || selectedCategoryId === '') {
      // Optionally, show an error message
      return;
    }
    await addSubCategory({
      name: newSubCategoryName,
      categoryId: selectedCategoryId,
    });
    setNewSubCategoryName('');
    setSelectedCategoryId('');
    setIsAddDialogOpen(false);
  };

  const handleEditSubCategory = async () => {
    if (
      editingSubCategoryName.trim() === '' ||
      editingCategoryId === '' ||
      !editingSubCategoryId
    ) {
      // Optionally, show an error message
      return;
    }
    await updateSubCategory(editingSubCategoryId, {
      name: editingSubCategoryName,
      categoryId: editingCategoryId,
    });
    setEditingSubCategoryId(null);
    setEditingSubCategoryName('');
    setEditingCategoryId('');
    setIsEditDialogOpen(false);
  };

  const handleDeleteSubCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      deleteSubCategory(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subcategories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" /> Add New Subcategory
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subcategory</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={newSubCategoryName}
                  onChange={(e) => setNewSubCategoryName(e.target.value)}
                  placeholder="Subcategory Name"
                />
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSubCategory}>Add</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <ul className="space-y-2">
          {subCategories.map((subCategory) => (
            <li key={subCategory.id} className="flex items-center justify-between">
              <div>
                <span>{subCategory.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({categories.find((c) => c.id === subCategory.categoryId)?.name})
                </span>
              </div>
              <div className="flex space-x-2">
                <Dialog
                  open={isEditDialogOpen && editingSubCategoryId === subCategory.id}
                  onOpenChange={(open) => {
                    if (!open) {
                      setIsEditDialogOpen(false);
                      setEditingSubCategoryId(null);
                      setEditingSubCategoryName('');
                      setEditingCategoryId('');
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingSubCategoryId(subCategory.id);
                        setEditingSubCategoryName(subCategory.name);
                        setEditingCategoryId(subCategory.categoryId);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Subcategory</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        value={editingSubCategoryName}
                        onChange={(e) => setEditingSubCategoryName(e.target.value)}
                        placeholder="Subcategory Name"
                      />
                      <Select
                        value={editingCategoryId}
                        onValueChange={setEditingCategoryId}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditDialogOpen(false);
                            setEditingSubCategoryId(null);
                            setEditingSubCategoryName('');
                            setEditingCategoryId('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleEditSubCategory}>Save</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() => handleDeleteSubCategory(subCategory.id)}
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

export default SubCategoryManagement;
