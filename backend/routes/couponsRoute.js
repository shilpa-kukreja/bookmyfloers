import express from 'express';
import { createCoupon , getAllCoupons, getCouponById, deleteCoupon, updateCoupon } from '../controllers/couponControllers.js';


const couponRouter = express.Router();

couponRouter.post('/add',  createCoupon);
couponRouter.post('/all', getAllCoupons);
couponRouter.get('/delete/:id', deleteCoupon);
couponRouter.get('/get/:id', getCouponById);
couponRouter.put('/edit/:id', updateCoupon );

export default couponRouter;