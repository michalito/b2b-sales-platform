import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { Category } from '../types';

const CategoryManagement: React.FC = () => {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Categories</h2>
      <input 
        type="text" 
        value={newCategoryName} 
        onChange={(e) => setNewCategoryName(e.target.value)} 
        placeholder="New category name" 
      />
      <button onClick={() => {
        addCategory({
            name: newCategoryName,
            products: [],
            subCategories: []
        });
        setNewCategoryName('');
      }}>
        Add Category
      </button>
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            {editingCategory?.id === category.id ? (
              <>
                <input 
                  value={editingCategory.name} 
                  onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})} 
                />
                <button onClick={() => {
                  updateCategory(category.id, editingCategory);
                  setEditingCategory(null);
                }}>
                  Save
                </button>
                <button onClick={() => setEditingCategory(null)}>Cancel</button>
              </>
            ) : (
              <>
                {category.name}
                <button onClick={() => setEditingCategory(category)}>Edit</button>
                <button onClick={() => deleteCategory(category.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManagement;