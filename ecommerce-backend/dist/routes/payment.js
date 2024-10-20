import express from 'express';
import { addDiscount, allCoupons, createPaymentIntent, deleteCoupon } from '../controllers/payment.js';
import { adminOnly } from '../middlewares/auth.js';
const router = express.Router();
//route /api/v1/payment/create
router.post("/create ", createPaymentIntent);
//route /api/v1/payment/discount
router.get("/discount", adminOnly, addDiscount);
//route /api/v1/payment/coupon/all
router.get("/coupon/all", adminOnly, allCoupons);
//route /api/v1/payment/coupon/:id
router.delete("/coupon/:id", adminOnly, deleteCoupon);
export default router;
