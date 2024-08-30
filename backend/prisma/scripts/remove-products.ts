import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeProducts() {
  try {
    await prisma.product.deleteMany({});
    console.log('All products have been removed');
  } catch (error) {
    console.error('Error removing products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeProducts();