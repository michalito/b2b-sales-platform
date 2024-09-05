// src/types/models.ts

import { Prisma } from '@prisma/client';

export type User = Prisma.UserGetPayload<{}>;
export type Product = Prisma.ProductGetPayload<{}>;
export type Cart = Prisma.CartGetPayload<{}>;
export type CartItem = Prisma.CartItemGetPayload<{}>;
export type Order = Prisma.OrderGetPayload<{}>;
export type OrderItem = Prisma.OrderItemGetPayload<{}>;

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}