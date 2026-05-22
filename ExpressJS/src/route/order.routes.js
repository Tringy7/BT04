import express from 'express';
import orderController from '../controllers/order.controller.js';
import {authorize, verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  '/api/order/add',
  verifyToken,
  authorize("user", "admin"),
  orderController.createOrder
);

router.delete(
  '/api/order/:orderId/cancel',
  verifyToken,
  authorize("user", "admin"),
 orderController.cancelOrder);

router.get(
  '/api/orders',
  verifyToken,
  authorize("user", "admin"),
  orderController.getOrders);

router.get(
  '/api/orders/:orderId',
  verifyToken,
  authorize("user", "admin"),
  orderController.getOrderById);
export default router;
