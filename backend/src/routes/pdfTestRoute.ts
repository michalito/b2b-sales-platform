import express from 'express';
import { generateOrderPDF } from '../services/pdfService';

const router = express.Router();

router.get('/test-pdf', async (req, res) => {
  try {
    const testOrder = {
      id: 'test-order-id',
      createdAt: new Date(),
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        company: 'Test Company',
        vatNumber: '123456789',
        phoneNumber: '1234567890',
        address: '123 Test St, Test City, 12345',
        discountRate: 0.1,
      },
      items: [
        {
          product: {
            name: 'Test Product',
            sku: 'TEST-SKU-001',
          },
          quantity: 2,
          price: 29.99,
        },
      ],
      subtotal: 59.98, // 2 * 29.99
      tax: 12.96, // Assuming 24% tax on discounted subtotal (59.98 * 0.9 * 0.24)
      totalAmount: 66.98, // (59.98 * 0.9) + 12.96
    };

    const pdfBuffer = await generateOrderPDF(testOrder);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=test-order.pdf');
    res.send(pdfBuffer);
  } catch (error: unknown) {
    console.error('Error in test PDF route:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: 'Failed to generate test PDF', details: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred while generating the test PDF' });
    }
  }
});

export default router;