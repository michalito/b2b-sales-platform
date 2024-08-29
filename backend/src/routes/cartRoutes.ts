import express from 'express';
import { addToCart, getCart, updateCartItem, removeFromCart, getCartTotal } from '../controllers/cartController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/add', authenticate, addToCart);
router.get('/', authenticate, getCart);
router.put('/item/:cartItemId', authenticate, updateCartItem);
router.delete('/item/:cartItemId', authenticate, removeFromCart);
router.get('/total', authenticate, getCartTotal);  // Add this new route


export default router;