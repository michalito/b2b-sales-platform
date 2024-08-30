//@ts-nocheck
import PDFDocument from 'pdfkit';

export const generateOrderPDF = async (order) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    // Add content to the PDF
    doc.fontSize(18).text('Order Confirmation', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${order.id}`);
    doc.text(`Date: ${order.createdAt.toLocaleDateString()}`);
    doc.moveDown();

    // User Information
    doc.fontSize(14).text('User Information');
    doc.fontSize(12).text(`Name: ${order.user.name || 'N/A'}`);
    doc.text(`Company: ${order.user.company || 'N/A'}`);
    doc.text(`VAT Number: ${order.user.vatNumber || 'N/A'}`);
    doc.text(`Phone: ${order.user.phoneNumber || 'N/A'}`);
    doc.text(`Email: ${order.user.email}`);
    doc.text(`Address: ${order.user.address || 'N/A'}`);
    doc.moveDown();

    // Order Items
    doc.fontSize(14).text('Order Items');
    order.items.forEach(item => {
      doc.fontSize(12).text(`${item.product.name} (${item.product.sku})`);
      doc.text(`  Quantity: ${item.quantity}`);
      doc.text(`  Price: $${item.price.toFixed(2)}`);
      doc.text(`  Total: $${(item.price * item.quantity).toFixed(2)}`);
      doc.moveDown(0.5);
    });

    // Order Summary
    doc.moveDown();
    doc.fontSize(14).text('Order Summary');
    const subtotal = order.items.reduce((total, item) => total + item.price * item.quantity, 0);
    doc.fontSize(12).text(`Subtotal: $${subtotal.toFixed(2)}`);
    if (order.user.discountRate > 0) {
      const discountAmount = subtotal * order.user.discountRate;
      doc.text(`Discount (${(order.user.discountRate * 100).toFixed(2)}%): $${discountAmount.toFixed(2)}`);
      doc.text(`Total After Discount: $${order.totalAmount.toFixed(2)}`);
    } else {
      doc.text(`Total: $${order.totalAmount.toFixed(2)}`);
    }

    doc.end();
  });
};