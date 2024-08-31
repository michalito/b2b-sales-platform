import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrder = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      company: true,
      vatNumber: true,
      phoneNumber: true,
      address: true,
      discountRate: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
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
    throw new Error('Cart is empty');
  }

  const orderItems = cart.items.map((item: { productId: any; quantity: any; product: { wholesalePrice: any; }; }) => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.product.wholesalePrice,
  }));

  const subtotal = orderItems.reduce((total: number, item: { price: number; quantity: number; }) => total + item.price * item.quantity, 0);
  const discountAmount = subtotal * user.discountRate;
  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * 0.24; // Assuming 24% tax rate
  const totalAmount = discountedSubtotal + tax;

  const order = await prisma.$transaction(async (prisma: { order: { create: (arg0: { data: { userId: string; items: { create: any; }; subtotal: any; tax: number; totalAmount: number; }; include: { items: { include: { product: boolean; }; }; user: boolean; }; }) => any; }; cartItem: { deleteMany: (arg0: { where: { cartId: any; }; }) => any; }; }) => {
    const newOrder = await prisma.order.create({
      data: {
        userId,
        items: {
          create: orderItems,
        },
        subtotal,
        tax,
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

    return newOrder;
  });

  return order;
};
