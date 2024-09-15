import React, { useState } from 'react';
import { useBrands } from '../hooks/useBrands';
import { Brand } from '../types';

const BrandManagement: React.FC = () => {
  const { brands, loading, addBrand, updateBrand, deleteBrand } = useBrands();
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [newBrandName, setNewBrandName] = useState('');

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Brands</h2>
      <input 
        type="text" 
        value={newBrandName} 
        onChange={(e) => setNewBrandName(e.target.value)} 
        placeholder="New brand name" 
      />
      <button onClick={() => {
        addBrand({
            name: newBrandName,
            products: []
        });
        setNewBrandName('');
      }}>
        Add Brand
      </button>
      <ul>
        {brands.map(brand => (
          <li key={brand.id}>
            {editingBrand?.id === brand.id ? (
              <>
                <input 
                  value={editingBrand.name} 
                  onChange={(e) => setEditingBrand({...editingBrand, name: e.target.value})} 
                />
                <button onClick={() => {
                  updateBrand(brand.id, editingBrand);
                  setEditingBrand(null);
                }}>
                  Save
                </button>
                <button onClick={() => setEditingBrand(null)}>Cancel</button>
              </>
            ) : (
              <>
                {brand.name}
                <button onClick={() => setEditingBrand(brand)}>Edit</button>
                <button onClick={() => deleteBrand(brand.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrandManagement;