import express from 'express';
import { deleteOrder, getAllOrders, getMyOrders, getSingleOrder, newOrder, processOrder } from '../controllers/order.js';
import { adminOnly } from '../middlewares/auth.js';
const router = express.Router();
//route /api/v1/order/new
router.post("/new", newOrder);
//route /api/v1/order/my
router.get("/my", getMyOrders);
//route /api/v1/order/all -- admin
router.get("/all", adminOnly, getAllOrders);
//route /api/v1/order/:dynamicId
router.route("/:id")
    .get(getSingleOrder)
    .patch(adminOnly, processOrder)
    .delete(adminOnly, deleteOrder);
export default router;
