import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const productsData = [
    {
      sku: 'TAV101-EBN-SM',
      name: 'Pleated Long Sleeve Top',
      color: 'Ebony',
      retailPrice: 29.99,
      wholesalePrice: 17.00,
      discountPercentage: 0,
      category: 'Tops',
      subCategory: 'Long Sleeve',
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
      category: 'Tops',
      subCategory: 'Long Sleeve',
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
      category: 'Tops',
      subCategory: 'Long Sleeve',
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
      category: 'Socks',
      subCategory: 'Grip Socks',
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
      category: 'Tops',
      subCategory: 'Bras',
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

  console.log('Seed data inserted successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });