import express from 'express';
import { 
  getProducts, 
  getFilterOptions, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getProductById,
  getCategories,
  getSubCategories,
  getBrands,
  addCategory,
  addSubCategory,
  addBrand,
  updateCategory,
  deleteCategory,
  updateSubCategory,
  deleteSubCategory,
  updateBrand,
  deleteBrand
} from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, getProducts);
router.get('/filter-options', authenticate, getFilterOptions);
router.get('/categories', authenticate, getCategories);
router.get('/subcategories', authenticate, getSubCategories);
router.get('/brands', authenticate, getBrands);
router.get('/:id', authenticate, getProductById);

// Admin-only routes
router.post('/', authenticate, authorize(['ADMIN']), createProduct);
router.put('/:id', authenticate, authorize(['ADMIN']), updateProduct);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteProduct);

router.post('/categories', authenticate, authorize(['ADMIN']), addCategory);
router.put('/categories/:id', authenticate, authorize(['ADMIN']), updateCategory);
router.delete('/categories/:id', authenticate, authorize(['ADMIN']), deleteCategory);

router.post('/subcategories', authenticate, authorize(['ADMIN']), addSubCategory);
router.put('/subcategories/:id', authenticate, authorize(['ADMIN']), updateSubCategory);
router.delete('/subcategories/:id', authenticate, authorize(['ADMIN']), deleteSubCategory);

router.post('/brands', authenticate, authorize(['ADMIN']), addBrand);
router.put('/brands/:id', authenticate, authorize(['ADMIN']), updateBrand);
router.delete('/brands/:id', authenticate, authorize(['ADMIN']), deleteBrand);

export default router;