import express from 'express';
import { addToCart, getCart, updateCartItem, removeFromCart } from '../controllers/cartController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/add', authenticate, addToCart);
router.get('/', authenticate, getCart);
router.put('/item/:cartItemId', authenticate, updateCartItem);
router.delete('/item/:cartItemId', authenticate, removeFromCart);

export default router;