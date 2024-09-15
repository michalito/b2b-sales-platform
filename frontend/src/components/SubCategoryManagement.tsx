import React, { useState } from 'react';
import { useSubCategories } from '../hooks/useSubCategories';
import { useCategories } from '../hooks/useCategories';
import { SubCategory } from '../types';

const SubCategoryManagement: React.FC = () => {
  const { subCategories, loading, addSubCategory, updateSubCategory, deleteSubCategory } = useSubCategories();
  const { categories } = useCategories();
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Subcategories</h2>
      <input 
        type="text" 
        value={newSubCategoryName} 
        onChange={(e) => setNewSubCategoryName(e.target.value)} 
        placeholder="New subcategory name" 
      />
      <select
        value={selectedCategoryId}
        onChange={(e) => setSelectedCategoryId(e.target.value)}
      >
        <option value="">Select a category</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
      <button onClick={() => {
        if (selectedCategoryId) {
          addSubCategory({
            name: newSubCategoryName,
            categoryId: selectedCategoryId,
          });
          setNewSubCategoryName('');
          setSelectedCategoryId('');
        } else {
          alert('Please select a parent category');
        }
      }}>
        Add Subcategory
      </button>
      <ul>
        {subCategories.map(subCategory => (
          <li key={subCategory.id}>
            {editingSubCategory?.id === subCategory.id ? (
              <>
                <input 
                  value={editingSubCategory.name} 
                  onChange={(e) => setEditingSubCategory({...editingSubCategory, name: e.target.value})} 
                />
                <select
                  value={editingSubCategory.categoryId}
                  onChange={(e) => setEditingSubCategory({...editingSubCategory, categoryId: e.target.value})}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                <button onClick={() => {
                  updateSubCategory(subCategory.id, editingSubCategory);
                  setEditingSubCategory(null);
                }}>
                  Save
                </button>
                <button onClick={() => setEditingSubCategory(null)}>Cancel</button>
              </>
            ) : (
              <>
                {subCategory.name} - {categories.find(c => c.id === subCategory.categoryId)?.name}
                <button onClick={() => setEditingSubCategory(subCategory)}>Edit</button>
                <button onClick={() => deleteSubCategory(subCategory.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubCategoryManagement;