import React, { useState, useEffect } from 'react';
import {
  Category,
  SubCategory,
  Brand,
  ProductFormData,
} from '../types';
import { Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  const [availableSubCategories, setAvailableSubCategories] = useState<SubCategory[]>([]);

  useEffect(() => {
    if (product) {
      setFormData(product);
      updateAvailableSubCategories(product.categoryId);
    }
  }, [product]);

  useEffect(() => {
    const wholesalePrice = parseFloat(formData.wholesalePrice.toString());
    const discountPercentage = parseFloat(formData.discountPercentage.toString());
    const discountedPrice = wholesalePrice - (wholesalePrice * (discountPercentage / 100));
    setFormData((prev) => ({ ...prev, discountedPrice: Number(discountedPrice.toFixed(2)) }));
  }, [formData.wholesalePrice, formData.discountPercentage]);

  const updateAvailableSubCategories = (categoryId: string) => {
    const filteredSubCategories = subCategories.filter((sc) => sc.categoryId === categoryId);
    setAvailableSubCategories(filteredSubCategories);

    if (
      filteredSubCategories.length > 0 &&
      !filteredSubCategories.some((sc) => sc.id === formData.subCategoryId)
    ) {
      setFormData((prev) => ({ ...prev, subCategoryId: '' }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'stock' ||
        name === 'retailPrice' ||
        name === 'wholesalePrice' ||
        name === 'discountPercentage'
          ? Number(value)
          : value,
    }));

    validateField(name, value);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'categoryId') {
      updateAvailableSubCategories(value);
    }
  };

  const validateField = (name: string, value: any) => {
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
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // You can add form-level validation here
    if (Object.values(errors).some((error) => error)) {
      return;
    }
    try {
      await onSubmit(formData);
    } catch (error) {
      // Handle error
    }
  };

  const helperTexts: Record<string, string> = {
    sku: 'A unique identifier for the product. Must be in the format TAV101-EBN-SM',
    wholesalePrice: 'The price at which retailers purchase the product. Must be less than the retail price.',
    discountPercentage: 'The percentage discount applied to the wholesale price. Enter a value between 0 and 100.',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/** SKU Field */}
        <div>
          <Label htmlFor="sku" className="mb-1 flex items-center">
            SKU*
            <Popover>
              <PopoverTrigger asChild>
                <Info className="ml-1 h-4 w-4 cursor-pointer text-gray-400" />
              </PopoverTrigger>
              <PopoverContent>
                <p>{helperTexts.sku}</p>
              </PopoverContent>
            </Popover>
          </Label>
          <Input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
            className={errors.sku ? 'border-red-500' : ''}
          />
          {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
        </div>

        {/** Name Field */}
        <div>
          <Label htmlFor="name" className="mb-1">Name*</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/** Brand Field */}
        <div>
          <Label htmlFor="brandId" className="mb-1">Brand*</Label>
          <Select
            value={formData.brandId}
            onValueChange={(value) => handleSelectChange('brandId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/** Color Field */}
        <div>
          <Label htmlFor="color" className="mb-1">Color*</Label>
          <Input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
          />
        </div>

        {/** Retail Price Field */}
        <div>
          <Label htmlFor="retailPrice" className="mb-1">Retail Price*</Label>
          <Input
            type="number"
            id="retailPrice"
            name="retailPrice"
            value={formData.retailPrice}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className={errors.retailPrice ? 'border-red-500' : ''}
          />
          {errors.retailPrice && <p className="text-red-500 text-sm mt-1">{errors.retailPrice}</p>}
        </div>

        {/** Wholesale Price Field */}
        <div>
          <Label htmlFor="wholesalePrice" className="mb-1 flex items-center">
            Wholesale Price*
            <Popover>
              <PopoverTrigger asChild>
                <Info className="ml-1 h-4 w-4 cursor-pointer text-gray-400" />
              </PopoverTrigger>
              <PopoverContent>
                <p>{helperTexts.wholesalePrice}</p>
              </PopoverContent>
            </Popover>
          </Label>
          <Input
            type="number"
            id="wholesalePrice"
            name="wholesalePrice"
            value={formData.wholesalePrice}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className={errors.wholesalePrice ? 'border-red-500' : ''}
          />
          {errors.wholesalePrice && <p className="text-red-500 text-sm mt-1">{errors.wholesalePrice}</p>}
        </div>

        {/** Discount Percentage Field */}
        <div>
          <Label htmlFor="discountPercentage" className="mb-1 flex items-center">
            Discount Percentage*
            <Popover>
              <PopoverTrigger asChild>
                <Info className="ml-1 h-4 w-4 cursor-pointer text-gray-400" />
              </PopoverTrigger>
              <PopoverContent>
                <p>{helperTexts.discountPercentage}</p>
              </PopoverContent>
            </Popover>
          </Label>
          <Input
            type="number"
            id="discountPercentage"
            name="discountPercentage"
            value={formData.discountPercentage}
            onChange={handleChange}
            required
            min="0"
            max="100"
            step="0.1"
            className={errors.discountPercentage ? 'border-red-500' : ''}
          />
          {errors.discountPercentage && (
            <p className="text-red-500 text-sm mt-1">{errors.discountPercentage}</p>
          )}
        </div>

        {/** Discounted Price Field (Read-only) */}
        <div>
          <Label htmlFor="discountedPrice" className="mb-1">Discounted Price</Label>
          <Input
            type="number"
            id="discountedPrice"
            name="discountedPrice"
            value={formData.discountedPrice}
            readOnly
            className="bg-gray-100"
          />
        </div>

        {/** Category Field */}
        <div>
          <Label htmlFor="categoryId" className="mb-1">Category*</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => handleSelectChange('categoryId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/** Subcategory Field */}
        <div>
          <Label htmlFor="subCategoryId" className="mb-1">Subcategory*</Label>
          <Select
            value={formData.subCategoryId}
            onValueChange={(value) => handleSelectChange('subCategoryId', value)}
            disabled={!formData.categoryId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a subcategory" />
            </SelectTrigger>
            <SelectContent>
              {availableSubCategories.map((subCategory) => (
                <SelectItem key={subCategory.id} value={subCategory.id}>
                  {subCategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/** Size Field */}
        <div>
          <Label htmlFor="size" className="mb-1">Size*</Label>
          <Input
            type="text"
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
          />
        </div>

        {/** Stock Field */}
        <div>
          <Label htmlFor="stock" className="mb-1">Stock*</Label>
          <Input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            className={errors.stock ? 'border-red-500' : ''}
          />
          {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
        </div>

        {/** Image URL Field */}
        <div className="md:col-span-2">
          <Label htmlFor="imageUrl" className="mb-1">Image URL</Label>
          <Input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
          {formData.imageUrl && (
            <div className="mt-2">
              <img
                src={formData.imageUrl}
                alt="Product preview"
                className="max-w-xs mx-auto"
              />
            </div>
          )}
        </div>
      </div>

      {/** Action Buttons */}
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default ProductForm;
