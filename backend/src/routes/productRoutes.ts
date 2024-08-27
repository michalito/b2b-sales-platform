import express from 'express';
import { getProducts, getFilterOptions } from '../controllers/productController';

const router = express.Router();

router.get('/', getProducts);
router.get('/filter-options', getFilterOptions);

export default router;