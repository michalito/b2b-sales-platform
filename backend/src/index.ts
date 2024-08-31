import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import cartRoutes from './routes/cartRoutes';
import { errorHandler } from './utils/errorHandler';
import orderRoutes from './routes/orderRoutes';

const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is reachable' });
});

app.use('/health', healthRouter);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);



// Error handling middleware
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});