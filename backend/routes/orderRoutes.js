import express from 'express';

import { createOrder, getAllOrders, updateOrderStatus, getOrderById, getUserOrders, stats, recentOrders } from '../controllers/orderControllers.js';  

const orderRouter = express.Router();

orderRouter.post('/add', createOrder);
orderRouter.post('/all', getAllOrders);
orderRouter.get('/stats', stats);
orderRouter.get('/recentOrders/:limit', recentOrders);
orderRouter.get('/user-order/:email', getUserOrders);
orderRouter.get('/get/:id', getOrderById);
orderRouter.put('/updatestatus/:orderId', updateOrderStatus);

export default orderRouter;