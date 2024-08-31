import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createOrder as createOrderService } from '../services/orderService';
import { generateOrderPDF } from '../services/pdfService';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name?: string | null;
    company?: string | null;
    vatNumber?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    discountRate: number;
  };
}

export const createOrder = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const userId = req.user.id;

  try {
    const order = await createOrderService(userId);

    const user = {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      company: req.user.company,
      vatNumber: req.user.vatNumber,
      phoneNumber: req.user.phoneNumber,
      address: req.user.address,
      discountRate: req.user.discountRate,
    };

    const pdfBuffer = await generateOrderPDF({
      id: order.id,
      createdAt: order.createdAt,
      user,
      items: order.items.map((item: { product: { name: any; sku: any; }; quantity: any; price: any; }) => ({
        product: {
          name: item.product.name,
          sku: item.product.sku,
        },
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      totalAmount: order.totalAmount,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=order-${order.id}.pdf`);
    res.send(pdfBuffer);

  } catch (error: unknown) {
    console.error('Error creating order:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: 'An error occurred while creating the order', details: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred while creating the order' });
    }
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const userId = req.user.id;

  try {
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
