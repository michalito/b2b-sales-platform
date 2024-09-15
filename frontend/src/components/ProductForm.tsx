import React, { useState, useEffect } from 'react';
import { Category, Brand, SubCategory, ProductFormData } from '../types';
import { Info } from 'lucide-react';

interface ProductFormProps {
  product?: ProductFormData;
  onSubmit: (product: ProductFormData) => Promise<void>;
  onCancel: () => void;
  categories: Category[];
  subCategories: SubCategory[];
  brands: Brand[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  categories,
  subCategories,
  brands,
}) => {
  const [formData, setFormData] = useState<ProductFormData>(
    product || {
      sku: '',
      name: '',
      color: '',
      retailPrice: 0,
      wholesalePrice: 0,
      discountPercentage: 0,
      discountedPrice: 0,
      categoryId: '',
      subCategoryId: '',
      brandId: '',
      size: '',
      stock: 0,
      imageUrl: '',
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [showHelper, setShowHelper] = useState<string | null>(null);
  const [availableSubCategories, setAvailableSubCategories] = useState<SubCategory[]>([]);

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku,
        name: product.name,
        color: product.color,
        retailPrice: product.retailPrice,
        wholesalePrice: product.wholesalePrice,
        discountPercentage: product.discountPercentage,
        discountedPrice: product.discountedPrice,
        categoryId: product.categoryId,
        subCategoryId: product.subCategoryId,
        brandId: product.brandId,
        size: product.size,
        stock: product.stock,
        imageUrl: product.imageUrl || '',
      });
      updateAvailableSubCategories(product.categoryId);
    }
  }, [product, subCategories]);

  useEffect(() => {
    const wholesalePrice = parseFloat(formData.wholesalePrice.toString());
    const discountPercentage = parseFloat(formData.discountPercentage.toString());
    const discountedPrice = wholesalePrice - (wholesalePrice * (discountPercentage / 100));
    setFormData(prev => ({ ...prev, discountedPrice: Number(discountedPrice.toFixed(2)) }));
  }, [formData.wholesalePrice, formData.discountPercentage]);

  const updateAvailableSubCategories = (categoryId: string) => {
    const filteredSubCategories = subCategories.filter(sc => sc.categoryId === categoryId);
    setAvailableSubCategories(filteredSubCategories);
    
    if (filteredSubCategories.length > 0 && !filteredSubCategories.some(sc => sc.id === formData.subCategoryId)) {
      setFormData(prev => ({ ...prev, subCategoryId: '' }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'categoryId') {
      setFormData(prev => ({
        ...prev,
        categoryId: value,
        subCategoryId: '',
      }));
      updateAvailableSubCategories(value);
    } else if (name === 'subCategoryId') {
      setFormData(prev => ({ ...prev, subCategoryId: value }));
    } else if (name === 'brandId') {
      setFormData(prev => ({ ...prev, brandId: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'stock' ? parseInt(value) :
                ['retailPrice', 'wholesalePrice', 'discountPercentage'].includes(name) ? parseFloat(value) :
                value
      }));
    }
    validateField(name, value);
  };

  const validateField = (name: string, value: string | number | undefined) => {
    let error = '';
    switch (name) {
      case 'sku':
        const skuPattern = /^[A-Za-z]{3}\d{3}-.*$/;
        if (typeof value === 'string' && !skuPattern.test(value)) {
          error = 'SKU must be in the format XXXYYY-STRING where XXX is three letters and YYY is three digits';
        }
        break;
      case 'retailPrice':
      case 'wholesalePrice':
        if (typeof value === 'number' && value <= 0) error = 'Price must be greater than 0';
        break;
      case 'discountPercentage':
        if (typeof value === 'number' && (value < 0 || value > 100))
          error = 'Discount must be between 0 and 100';
        break;
      case 'stock':
        if (typeof value === 'number' && value < 0) error = 'Stock cannot be negative';
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // const validateForm = () => {
  //   let isValid = true;
  //   Object.keys(formData).forEach(key => {
  //     validateField(key, formData[key as keyof ProductFormData]);
  //     if (errors[key as keyof ProductFormData]) isValid = false;
  //   });
  //   if (formData.wholesalePrice >= formData.retailPrice) {
  //     setErrors(prev => ({ ...prev, wholesalePrice: 'Wholesale price must be less than retail price' }));
  //     isValid = false;
  //   }
  //   return isValid;
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
    }
  };

  const helperTexts: Record<string, string> = {
    sku: 'A unique identifier for the product. Must be in the format TAV101-EBN-SM',
    wholesalePrice: 'The price at which retailers purchase the product. Must be less than the retail price.',
    discountPercentage: 'The percentage discount applied to the wholesale price. Enter a value between 0 and 100.',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sku" className="block mb-1">SKU*</label>
          <div className="relative">
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              className={`w-full p-2 border rounded ${errors.sku ? 'border-red-500' : ''}`}
            />
            <Info 
              className="absolute right-2 top-2 cursor-pointer text-gray-400" 
              size={20} 
              onClick={() => setShowHelper('sku')}
            />
          </div>
          {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
        </div>
        <div>
          <label htmlFor="name" className="block mb-1">Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="brandId" className="block mb-1">Brand*</label>
          <select
            id="brandId"
            name="brandId"
            value={formData.brandId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select a brand</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="color" className="block mb-1">Color*</label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="retailPrice" className="block mb-1">Retail Price*</label>
          <input
            type="number"
            id="retailPrice"
            name="retailPrice"
            value={formData.retailPrice}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className={`w-full p-2 border rounded ${errors.retailPrice ? 'border-red-500' : ''}`}
          />
          {errors.retailPrice && <p className="text-red-500 text-sm mt-1">{errors.retailPrice}</p>}
        </div>
        <div>
          <label htmlFor="wholesalePrice" className="block mb-1">Wholesale Price*</label>
          <div className="relative">
            <input
              type="number"
              id="wholesalePrice"
              name="wholesalePrice"
              value={formData.wholesalePrice}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className={`w-full p-2 border rounded ${errors.wholesalePrice ? 'border-red-500' : ''}`}
            />
            <Info 
              className="absolute right-2 top-2 cursor-pointer text-gray-400" 
              size={20} 
              onClick={() => setShowHelper('wholesalePrice')}
            />
          </div>
          {errors.wholesalePrice && <p className="text-red-500 text-sm mt-1">{errors.wholesalePrice}</p>}
        </div>
        <div>
          <label htmlFor="discountPercentage" className="block mb-1">Discount Percentage*</label>
          <div className="relative">
            <input
              type="number"
              id="discountPercentage"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleChange}
              required
              min="0"
              max="100"
              step="0.1"
              className={`w-full p-2 border rounded ${errors.discountPercentage ? 'border-red-500' : ''}`}
            />
            <Info 
              className="absolute right-2 top-2 cursor-pointer text-gray-400" 
              size={20} 
              onClick={() => setShowHelper('discountPercentage')}
            />
          </div>
          {errors.discountPercentage && <p className="text-red-500 text-sm mt-1">{errors.discountPercentage}</p>}
        </div>
        <div>
          <label htmlFor="discountedPrice" className="block mb-1">Discounted Price</label>
          <input
            type="number"
            id="discountedPrice"
            name="discountedPrice"
            value={formData.discountedPrice}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label htmlFor="categoryId" className="block mb-1">Category*</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="subCategoryId" className="block mb-1">Subcategory*</label>
          <select
            id="subCategoryId"
            name="subCategoryId"
            value={formData.subCategoryId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            disabled={!formData.categoryId}
          >
            <option value="">Select a subcategory</option>
            {availableSubCategories.map(subCategory => (
              <option key={subCategory.id} value={subCategory.id}>{subCategory.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="size" className="block mb-1">Size*</label>
          <input
            type="text"
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="stock" className="block mb-1">Stock*</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            className={`w-full p-2 border rounded ${errors.stock ? 'border-red-500' : ''}`}
          />
          {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="imageUrl" className="block mb-1">Image URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      {formData.imageUrl && (
        <div className="mt-2">
          <img src={formData.imageUrl} alt="Product preview" className="max-w-xs mx-auto" />
        </div>
      )}
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
      </div>
      
      {showHelper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{showHelper} Helper</h3>
              <button onClick={() => setShowHelper(null)}>
                Close
              </button>
            </div>
            <p>{helperTexts[showHelper]}</p>
          </div>
        </div>
      )}
    </form>
  );
};

export default ProductForm;