import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
    user?: {
      id: string;
      email: string;
      role: string;
    };
}
  
export const getCart = async (req: AuthRequest, res: Response) => {
try {
    if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.id;

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

    if (!cart) {
    return res.json({ items: [] });
    }

    res.json(cart);
} catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'An error occurred while fetching the cart' });
}
};

export const addToCart = async (req: AuthRequest, res: Response) => {
try {
    if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.id;
    const { productId, quantity } = req.body;

    let cart = await prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
    }

    const existingCartItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
    });

    if (existingCartItem) {
    await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
    });
    } else {
    await prisma.cartItem.create({
        data: {
        cartId: cart.id,
        productId,
        quantity,
        },
    });
    }

    res.json({ message: 'Item added to cart successfully' });
} catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'An error occurred while adding to cart' });
}
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user as { userId: string };
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: { userId },
      },
      include: { product: true },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (cartItem.product.stock < quantity) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    res.json(updatedCartItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'An error occurred while updating the cart item' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user as { userId: string };
    const { cartItemId } = req.params;

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: { userId },
      },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'An error occurred while removing from cart' });
  }
};