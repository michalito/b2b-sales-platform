import express from 'express';
import { 
  getProducts, 
  getFilterOptions, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getProductById 
} from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, getProducts);
router.get('/filter-options', authenticate, getFilterOptions);

// Admin-only routes
router.post('/', authenticate, authorize(['ADMIN']), createProduct);
router.get('/:id', authenticate, getProductById);
router.put('/:id', authenticate, authorize(['ADMIN']), updateProduct);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteProduct);

export default router;