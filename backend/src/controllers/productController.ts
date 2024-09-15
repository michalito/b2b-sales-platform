import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching categories' });
  }
};

export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await prisma.brand.findMany();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching brands' });
  }
};

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({ data: { name } });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding the category' });
  }
};

export const addBrand = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const brand = await prisma.brand.create({ data: { name } });
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding the brand' });
  }
};

export const getSubCategories = async (req: Request, res: Response) => {
  try {
    const subCategories = await prisma.subCategory.findMany({
      include: { category: true }
    });
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching subcategories' });
  }
};

export const addSubCategory = async (req: Request, res: Response) => {
  try {
    const { name, categoryId } = req.body;
    const subCategory = await prisma.subCategory.create({
      data: { name, categoryId }
    });
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding the subcategory' });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      subCategory, 
      brand,
      color, 
      size, 
      sortBy, 
      sortOrder, 
      page = '1', 
      limit = '16', 
      search,
      minDiscount,
      showOnlyAvailable
    } = req.query;

    const whereClause: any = {};
    if (category) whereClause.categoryId = category as string;
    if (subCategory) whereClause.subCategoryId = subCategory as string;
    if (brand) whereClause.brandId = brand as string;
    if (color) whereClause.color = color as string;
    if (size) whereClause.size = size as string;
    if (minDiscount) whereClause.discountPercentage = { gte: parseFloat(minDiscount as string) };
    if (showOnlyAvailable === 'true') whereClause.stock = { gt: 0 };
    if (search) {
      whereClause.OR = [
        { sku: { contains: search as string, mode: 'insensitive' } },
        { name: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy as string] = sortOrder === 'desc' ? 'desc' : 'asc';
    }

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
        skip,
        take: limitNumber,
        include: {
          category: true,
          subCategory: true,
          brand: true,
        },
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    res.json({
      products,
      totalPages: Math.ceil(totalCount / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'An error occurred while fetching products' });
  }
};

export const getFilterOptions = async (req: Request, res: Response) => {
  try {
    const [categories, brands, colors, sizes] = await Promise.all([
      prisma.category.findMany({ include: { subCategories: true } }),
      prisma.brand.findMany(),
      prisma.product.findMany({ select: { color: true }, distinct: ['color'] }),
      prisma.product.findMany({ select: { size: true }, distinct: ['size'] }),
    ]);

    res.json({
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        subCategories: c.subCategories.map(sc => ({ id: sc.id, name: sc.name }))
      })),
      brands: brands.map(b => ({ id: b.id, name: b.name })),
      colors: colors.map(c => c.color),
      sizes: sizes.map(s => s.size),
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching filter options' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'An error occurred while fetching the product' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      sku,
      name,
      color,
      retailPrice,
      wholesalePrice,
      discountPercentage,
      categoryId,
      subCategoryId,
      brandId,
      size,
      stock,
      imageUrl
    } = req.body;

    // Validate that all required fields are present
    if (
      !sku ||
      !name ||
      !color ||
      retailPrice === undefined || retailPrice === null ||
      wholesalePrice === undefined || wholesalePrice === null ||
      discountPercentage === undefined || discountPercentage === null ||
      !categoryId ||
      !subCategoryId ||
      !brandId ||
      !size ||
      stock === undefined || stock === null
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const discountedPrice = wholesalePrice - (wholesalePrice * (discountPercentage / 100));

    // Parse numeric values
    const parsedRetailPrice = parseFloat(retailPrice);
    const parsedWholesalePrice = parseFloat(wholesalePrice);
    const parsedDiscountPercentage = parseFloat(discountPercentage);
    const parsedStock = parseInt(stock, 10);

    // Validate parsed values
    if (
      isNaN(parsedRetailPrice) ||
      isNaN(parsedWholesalePrice) ||
      isNaN(parsedDiscountPercentage) ||
      isNaN(parsedStock)
    ) {
      return res.status(400).json({ error: 'Invalid numeric field values' });
    }

    const product = await prisma.product.create({
      data: {
        sku,
        name,
        color,
        retailPrice: parsedRetailPrice,
        wholesalePrice: parsedWholesalePrice,
        discountPercentage: parsedDiscountPercentage,
        discountedPrice,
        categoryId,
        subCategoryId,
        brandId,
        size,
        stock: parsedStock,
        imageUrl
      },
      include: {
        category: true,
        subCategory: true,
        brand: true
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'A product with this SKU already exists' });
      }
      if (error.code === 'P2003') {
        return res.status(400).json({ error: 'Invalid category, subcategory, or brand ID' });
      }
    }
    res.status(500).json({ error: 'An error occurred while updating the product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      sku,
      name,
      color,
      retailPrice,
      wholesalePrice,
      discountPercentage,
      categoryId,
      subCategoryId,
      brandId,
      size,
      stock,
      imageUrl
    } = req.body;

    // Validate that all required fields are present
    if (
      !id ||
      !sku ||
      !name ||
      !color ||
      retailPrice === undefined || retailPrice === null ||
      wholesalePrice === undefined || wholesalePrice === null ||
      discountPercentage === undefined || discountPercentage === null ||
      !categoryId ||
      !subCategoryId ||
      !brandId ||
      !size ||
      stock === undefined || stock === null
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const discountedPrice = wholesalePrice - (wholesalePrice * (discountPercentage / 100));

    // Parse numeric values
    const parsedRetailPrice = parseFloat(retailPrice);
    const parsedWholesalePrice = parseFloat(wholesalePrice);
    const parsedDiscountPercentage = parseFloat(discountPercentage);
    const parsedStock = parseInt(stock, 10);

    // Validate parsed values
    if (
      isNaN(parsedRetailPrice) ||
      isNaN(parsedWholesalePrice) ||
      isNaN(parsedDiscountPercentage) ||
      isNaN(parsedStock)
    ) {
      return res.status(400).json({ error: 'Invalid numeric field values' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        sku,
        name,
        color,
        retailPrice: parsedRetailPrice,
        wholesalePrice: parsedWholesalePrice,
        discountPercentage: parsedDiscountPercentage,
        discountedPrice,
        categoryId,
        subCategoryId,
        brandId,
        size,
        stock: parsedStock,
        imageUrl
      },
      include: {
        category: true,
        subCategory: true,
        brand: true
      }
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'A product with this SKU already exists' });
      }
      if (error.code === 'P2003') {
        return res.status(400).json({ error: 'Invalid category, subcategory, or brand ID' });
      }
    }
    if (error instanceof Error && error.message === 'Product not found') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'An error occurred while updating the product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if the product is associated with any orders
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: id }
    });

    if (orderItemsCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete product. It is associated with existing orders.',
        details: `This product is part of ${orderItemsCount} order(s).`
      });
    }

    // Check if the product is in any cart
    const cartItemsCount = await prisma.cartItem.count({
      where: { productId: id }
    });

    if (cartItemsCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete product. It is currently in one or more user carts.',
        details: `This product is in ${cartItemsCount} user cart(s).`
      });
    }

    // If no associated orders or cart items, proceed with deletion
    await prisma.product.delete({
      where: { id }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      error: 'An error occurred while deleting the product',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name }
    });
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the category' });
  }
};

export const updateSubCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, categoryId } = req.body;
    const updatedSubCategory = await prisma.subCategory.update({
      where: { id },
      data: { name, categoryId }
    });
    res.json(updatedSubCategory);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the subcategory' });
  }
};

export const deleteSubCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.subCategory.delete({ where: { id } });
    res.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the subcategory' });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: { name }
    });
    res.json(updatedBrand);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the brand' });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.brand.delete({ where: { id } });
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the brand' });
  }
};