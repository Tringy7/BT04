'use strict';
import express from 'express';
import homeController from '../controllers/home.controller.js';
import productController from '../controllers/product.controller.js';

const router = express.Router();

router.get('/api/home', homeController.getHomePage);
router.get('/api/home/products/:id', productController.getProductDetail);
router.get('/api/home/products/category/:categoryId', productController.getProductsByCategory);
router.get('/', homeController.getHomePage);
export default router;
