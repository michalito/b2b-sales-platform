import React from 'react';
import { Product } from '../types';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th>SKU</th>
          <th>Name</th>
          <th>Category</th>
          <th>Subcategory</th>
          <th>Brand</th>
          <th>Color</th>
          <th>Size</th>
          <th>Retail Price</th>
          <th>Wholesale Price</th>
          <th>Discount %</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id}>
            <td>{product.sku}</td>
            <td>{product.name}</td>
            <td>{product.category.name}</td>
            <td>{product.subCategory.name}</td>
            <td>{product.brand.name}</td>
            <td>{product.color}</td>
            <td>{product.size}</td>
            <td>{product.retailPrice}</td>
            <td>{product.wholesalePrice}</td>
            <td>{product.discountPercentage}%</td>
            <td>{product.stock}</td>
            <td>
              <button onClick={() => onEdit(product)} className="text-blue-500 mr-2">Edit</button>
              <button onClick={() => onDelete(product.id)} className="text-red-500">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};