import React, { useState } from 'react';
import { useBrands } from '../hooks/useBrands';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const BrandManagement: React.FC = () => {
  const { brands, loading, addBrand, updateBrand, deleteBrand } = useBrands();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [newBrandName, setNewBrandName] = useState('');

  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [editingBrandName, setEditingBrandName] = useState('');

  if (loading) return <div>Loading...</div>;

  const handleAddBrand = async () => {
    if (newBrandName.trim() === '') {
      // Optionally, show an error message
      return;
    }
    await addBrand({
        name: newBrandName,
        products: []
    });
    setNewBrandName('');
    setIsAddDialogOpen(false);
  };

  const handleEditBrand = async () => {
    if (editingBrandName.trim() === '' || !editingBrandId) {
      // Optionally, show an error message
      return;
    }
    await updateBrand(editingBrandId, {
        name: editingBrandName,
        products: []
    });
    setEditingBrandId(null);
    setEditingBrandName('');
    setIsEditDialogOpen(false);
  };

  const handleDeleteBrand = (id: string) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      deleteBrand(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brands</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" /> Add New Brand
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Brand</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="Brand Name"
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddBrand}>Add</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <ul className="space-y-2">
          {brands.map((brand) => (
            <li key={brand.id} className="flex items-center justify-between">
              <span>{brand.name}</span>
              <div className="flex space-x-2">
                <Dialog
                  open={isEditDialogOpen && editingBrandId === brand.id}
                  onOpenChange={(open) => {
                    if (!open) {
                      setIsEditDialogOpen(false);
                      setEditingBrandId(null);
                      setEditingBrandName('');
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingBrandId(brand.id);
                        setEditingBrandName(brand.name);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Brand</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        value={editingBrandName}
                        onChange={(e) => setEditingBrandName(e.target.value)}
                        placeholder="Brand Name"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditDialogOpen(false);
                            setEditingBrandId(null);
                            setEditingBrandName('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleEditBrand}>Save</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button onClick={() => handleDeleteBrand(brand.id)} variant="ghost" size="sm">
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

export default BrandManagement;
