import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      subCategory, 
      color, 
      size, 
      sortBy, 
      sortOrder, 
      page = '1', 
      limit = '9', 
      search,
      minDiscount,
      maxDiscount,
      showOnlyAvailable
    } = req.query;

    const whereClause: any = {};
    if (category) whereClause.category = category as string;
    if (subCategory) whereClause.subCategory = subCategory as string;
    if (color) whereClause.color = color as string;
    if (size) whereClause.size = size as string;
    if (minDiscount) whereClause.discountPercentage = { gte: parseFloat(minDiscount as string) };
    if (maxDiscount) whereClause.discountPercentage = { ...whereClause.discountPercentage, lte: parseFloat(maxDiscount as string) };
    if (showOnlyAvailable === 'true') whereClause.stock = { gt: 0 };
    if (search) {
      whereClause.OR = [
        { sku: { contains: search as string, mode: 'insensitive' } },
        { name: { contains: search as string, mode: 'insensitive' } },
        { category: { contains: search as string, mode: 'insensitive' } },
        { subCategory: { contains: search as string, mode: 'insensitive' } },
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
        select: {
          id: true,
          sku: true,
          name: true,
          color: true,
          retailPrice: true,
          wholesalePrice: true,
          discountPercentage: true,
          category: true,
          subCategory: true,
          size: true,
          stock: true,
          imageUrl: true,
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
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    const subCategories = await prisma.product.findMany({
      select: { subCategory: true },
      distinct: ['subCategory'],
    });
    const colors = await prisma.product.findMany({
      select: { color: true },
      distinct: ['color'],
    });
    const sizes = await prisma.product.findMany({
      select: { size: true },
      distinct: ['size'],
    });

    res.json({
      categories: categories.map(c => c.category),
      subCategories: subCategories.map(sc => sc.subCategory),
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
      category,
      subCategory,
      size,
      stock,
      imageUrl
    } = req.body;

    const product = await prisma.product.create({
      data: {
        sku,
        name,
        color,
        retailPrice: parseFloat(retailPrice),
        wholesalePrice: parseFloat(wholesalePrice),
        discountPercentage: parseFloat(discountPercentage),
        category,
        subCategory,
        size,
        stock: parseInt(stock),
        imageUrl
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'An error occurred while creating the product' });
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
      category,
      subCategory,
      size,
      stock,
      imageUrl
    } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        sku,
        name,
        color,
        retailPrice: parseFloat(retailPrice),
        wholesalePrice: parseFloat(wholesalePrice),
        discountPercentage: parseFloat(discountPercentage),
        category,
        subCategory,
        size,
        stock: parseInt(stock),
        imageUrl
      }
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
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