import express from 'express';
import { createOrder, getOrders } from '../controllers/orderController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/create', authenticate, createOrder);
router.get('/', authenticate, getOrders);

export default router;