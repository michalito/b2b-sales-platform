import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateOrderPDF } from '../services/pdfService';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
  
      const userId = req.user.id;
  
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
  
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }
  
      const orderItems = cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.wholesalePrice,
      }));
  
      const subtotal = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
      const discountAmount = subtotal * user.discountRate;
      const totalAmount = subtotal - discountAmount;
  
      const order = await prisma.order.create({
        data: {
          userId,
          items: {
            create: orderItems,
          },
          totalAmount,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });
  
      // Clear the cart
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  
      // Generate PDF
      const pdfBuffer = await generateOrderPDF(order);
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=order-${order.id}.pdf`);
      res.send(pdfBuffer);
  
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'An error occurred while creating the order' });
    }
  };

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'An error occurred while fetching orders' });
  }
};