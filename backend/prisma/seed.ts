import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const tops = await prisma.category.create({ data: { name: 'Tops' } });
  const socks = await prisma.category.create({ data: { name: 'Socks' } });

  // Create subcategories
  const longSleeve = await prisma.subCategory.create({
    data: { name: 'Long Sleeve', categoryId: tops.id }
  });
  const bras = await prisma.subCategory.create({
    data: { name: 'Bras', categoryId: tops.id }
  });
  const gripSocks = await prisma.subCategory.create({
    data: { name: 'Grip Socks', categoryId: socks.id }
  });

  // Create brands
  const tavi = await prisma.brand.create({ data: { name: 'Tavi' } });

  // Create Products
  const productsData = [
    {
      sku: 'TAV101-EBN-SM',
      name: 'Pleated Long Sleeve Top',
      color: 'Ebony',
      retailPrice: 29.99,
      wholesalePrice: 17.00,
      discountPercentage: 0,
      discountedPrice: 17.00,
      categoryId: tops.id,
      subCategoryId: longSleeve.id,
      brandId: tavi.id,
      size: 'Small',
      stock: 4,
      imageUrl: 'https://fitnessproduction-images.imgix.net/tavi/apparel_pleatedlongsleeve_ebony_front_820x.png'
    },
    {
      sku: 'TAV101-EBN-MD',
      name: 'Pleated Long Sleeve Top',
      color: 'Ebony',
      retailPrice: 29.99,
      wholesalePrice: 17.00,
      discountPercentage: 5,
      discountedPrice: 16.15,
      categoryId: tops.id,
      subCategoryId: longSleeve.id,
      brandId: tavi.id,
      size: 'Medium',
      stock: 5,
      imageUrl: 'https://fitnessproduction-images.imgix.net/tavi/apparel_pleatedlongsleeve_ebony_front_820x.png'
    },
    {
      sku: 'TAV101-GNT-MD',
      name: 'Pleated Long Sleeve Top',
      color: 'Garnet',
      retailPrice: 29.99,
      wholesalePrice: 20.00,
      discountPercentage: 10,
      discountedPrice: 18.00,
      categoryId: tops.id,
      subCategoryId: longSleeve.id,
      brandId: tavi.id,
      size: 'Medium',
      stock: 2,
      imageUrl: 'https://fitnessproduction-images.imgix.net/tavi/apparel_pleatedlongsleeve_garnet_front_820x.png'
    },
    {
      sku: 'TAV001-PSW-MD',
      name: 'Savvy Grip Socks',
      color: 'Green Pastel',
      retailPrice: 19.99,
      wholesalePrice: 8.00,
      discountPercentage: 0,
      discountedPrice: 8.00,
      categoryId: socks.id,
      subCategoryId: gripSocks.id,
      brandId: tavi.id,
      size: 'Medium',
      stock: 11,
      imageUrl: 'https://fitnessproduction-images.imgix.net/tavi/TAVI_August23_Savvy_Green-Pastel-Wave-Stripe_900x.png'
    },
    {
      sku: 'TAV102-LMT-SM',
      name: 'Tavi Neck Bra',
      color: 'Lime Tropic',
      retailPrice: 24.99,
      wholesalePrice: 17.50,
      discountPercentage: 15,
      discountedPrice: 14.875,
      categoryId: tops.id,
      subCategoryId: bras.id,
      brandId: tavi.id,
      size: 'Small',
      stock: 9,
      imageUrl: 'https://fitnessproduction-images.imgix.net/tavi/S24_TAVI_Apparel_Square-Neck-Bra_Lime-Tropic-Toile_Detail.jpg'
    }
  ];

  for (const product of productsData) {
    await prisma.product.create({
      data: product
    });
  }

  // Create admin user
  const email = 'michael.sinoplis@fitnessproduction.gr';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email: email },
    update: {},
    create: {
      email: email,
      password: hashedPassword,
      approved: true,
      emailVerified: true
    }
  });

  console.log('Seed data inserted successfully');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
