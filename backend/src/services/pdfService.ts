import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export interface Order {
  id: string;
  createdAt: Date;
  user: User;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
}

interface OrderItem {
  product: {
    name: string;
    sku: string;
  };
  quantity: number;
  price: number;
}

interface User {
  id: string;
  email: string;
  name?: string | null;
  company?: string | null;
  vatNumber?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  discountRate: number;
}

const drawFooter = (doc: PDFKit.PDFDocument, pageHeight: number) => {
  const footerHeight = 50;
  const footerY = pageHeight - footerHeight;

  doc
    .rect(0, footerY, doc.page.width, footerHeight)
    .fill('#f0f0f0')
    .stroke();
  
  doc
    .fillColor('#888888')
    .fontSize(10)
    .text('Ευχαριστούμε!', 0, footerY + 20, {
      align: 'center',
      width: doc.page.width,
    });
};

export const generateOrderPDF = async (order: Order): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];
      const pageHeight = doc.page.height;

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      const logoPath = path.resolve(__dirname, '../../assets/logo.png');
      const headerBgColor = '#f0f0f0';
      const primaryColor = '#A60F46';
      const textColor = '#333';

      // Header Section
      doc.rect(0, 0, doc.page.width, 100).fill(headerBgColor).fillColor(textColor);
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 40, 15, { width: 200 });
      } else {
        console.warn('Logo file not found:', logoPath);
      }
      doc.font('Helvetica-Bold').fontSize(20).fillColor(primaryColor).text('Order Confirmation', 200, 40, { align: 'right' });

      // Order details
      doc.fillColor(textColor).fontSize(10);
      doc.text(`Order ID: ${order.id}`, 50, 120);
      doc.text(`Date: ${order.createdAt.toLocaleDateString('de-DE')}`, 50, 135);

      // Customer Information
      doc.fontSize(12).fillColor(primaryColor).text('Customer Information', 50, 160);
      doc.fontSize(10).fillColor(textColor)
         .text(`Name: ${order.user.name || 'N/A'}`, 50, 180)
         .text(`Company: ${order.user.company || 'N/A'}`, 50, 195)
         .text(`VAT Number: ${order.user.vatNumber || 'N/A'}`, 50, 210)
         .text(`Phone: ${order.user.phoneNumber || 'N/A'}`, 50, 225)
         .text(`Email: ${order.user.email}`, 50, 240)
         .text(`Address: ${order.user.address || 'N/A'}`, 50, 255);

      // Order Items
      doc.fontSize(12).fillColor(primaryColor).text('Order Items', 50, 285);
      const itemStart = 300;
      doc.fontSize(10).fillColor(textColor);

      // Table header
      doc.font('Helvetica-Bold');
      doc.text('Item', 50, itemStart);
      doc.text('SKU', 200, itemStart);
      doc.text('Quantity', 300, itemStart);
      doc.text('Price', 380, itemStart);
      doc.text('Total', 460, itemStart);

      // Underline header
      doc.moveTo(50, itemStart + 15).lineTo(550, itemStart + 15).stroke();

      doc.font('Helvetica');
      let position = itemStart + 30;
      order.items.forEach((item, index) => {
        doc.text(item.product.name, 50, position);
        doc.text(item.product.sku, 200, position);
        doc.text(item.quantity.toString(), 300, position);
        doc.text(`$${item.price.toFixed(2)}`, 380, position);
        doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 460, position);
        position += 20;

        // Add a light gray line between items
        if (index < order.items.length - 1) {
          doc.moveTo(50, position - 5).lineTo(550, position - 5).stroke('#f0f0f0');
        }

        // Check if we need a new page
        if (position > 700) {
          drawFooter(doc, pageHeight);
          doc.addPage();
          position = 50;
        }
      });

      // Order Summary
      const summaryStart = position + 20;
      doc.fontSize(12).fillColor(primaryColor).text('Order Summary', 50, summaryStart);
      doc.fontSize(10).fillColor(textColor);

      doc.text(`Subtotal:`, 380, summaryStart + 20);
      doc.text(`$${order.subtotal.toFixed(2)}`, 460, summaryStart + 20);

      if (order.user.discountRate > 0) {
        const discountAmount = order.subtotal * order.user.discountRate;
        doc.text(`Discount (${(order.user.discountRate * 100).toFixed(2)}%):`, 380, summaryStart + 35);
        doc.text(`-$${discountAmount.toFixed(2)}`, 460, summaryStart + 35);
      }

      doc.text('Tax:', 380, summaryStart + 50);
      doc.text(`$${order.tax.toFixed(2)}`, 460, summaryStart + 50);

      doc.font('Helvetica-Bold').fillColor(primaryColor);
      doc.text('Total:', 380, summaryStart + 65);
      doc.text(`$${order.totalAmount.toFixed(2)}`, 460, summaryStart + 65);

      drawFooter(doc, pageHeight);

      doc.end();
    } catch (error: unknown) {
      console.error('Error generating PDF:', error);
      if (error instanceof Error) {
        reject(new Error(`Failed to generate PDF: ${error.message}`));
      } else {
        reject(new Error('An unknown error occurred while generating the PDF'));
      }
    }
  });
};
