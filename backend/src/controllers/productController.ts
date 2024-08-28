import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
    try {
      const { category, subCategory, color, size, sortBy, sortOrder, page = '1', limit = '9', search } = req.query;
  
      const whereClause: any = {};
      if (category) whereClause.category = category as string;
      if (subCategory) whereClause.subCategory = subCategory as string;
      if (color) whereClause.color = color as string;
      if (size) whereClause.size = size as string;
      if (search) {
        whereClause.OR = [
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

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await prisma.product.delete({
        where: { id },
      });
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  };