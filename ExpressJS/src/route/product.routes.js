import express from 'express';
import productController from '../controllers/product.controller.js';

const router = express.Router();

router.get('/api/products/:id', productController.getProductDetail);
router.get('/api/products/category/:categoryId', productController.getProductsByCategory);

export default router;
