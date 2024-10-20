import { Request } from "express";
import { NewOrderRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { invalidateCatch, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-classes.js";
import { myCatch } from "../app.js";

export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      orderItems,
      shippingInfo,
      shippingCharges,
      subtotal,
      tax,
      total,
      user,
      discount,
    } = req.body;

    if (!orderItems || !shippingInfo || !subtotal || !tax || !total || !user)
      return next(new ErrorHandler("Please Enter all filed", 400));

    const order= await Order.create({
      orderItems,
      shippingInfo,
      shippingCharges,
      subtotal,
      tax,
      total,
      user,
      discount,
    });

    await reduceStock(orderItems);

    invalidateCatch({ 
        product: true, 
        order: true, 
        admin: true, 
        userId: user,
        productId: String(order.orderItems.map(i=>i.productId))
    });

    return res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
    });
  }
);

export const getMyOrders = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;
  const key = `my-orders-${user}`;

  let orders = [];
  if (myCatch.has(key)) orders = JSON.parse(myCatch.get(key) as string);
  else {
    orders = await Order.find({ user });
    myCatch.set(key, JSON.stringify(orders));
  }
  return res.status(200).json({
    success: true,
    orders,
  });
});

export const getAllOrders = TryCatch(async (req, res, next) => {
  const key = `all-orders`;

  let orders = [];
  if (myCatch.has(key)) orders = JSON.parse(myCatch.get(key) as string);
  else {
    orders = await Order.find();
    myCatch.set(key, JSON.stringify(orders));
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});

export const getSingleOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const key = `order - ${id}`;

  let order;
  if (myCatch.has(key)) order = JSON.parse(myCatch.get(key) as string);
  else {
    order = await Order.findById(id).populate("user", "name");
    if (!order) return next(new ErrorHandler("Order Not Found", 400));
    myCatch.set(key, JSON.stringify(order));
  }

  return res.status(200).json({
    success: true,
    order,
  });
});

export const processOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) return next(new ErrorHandler("Order not found", 404));

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";
      break;
    case "Shipped":
      order.status = "Delivered";
      break;
    default:
      order.status = "Delivered";
      break;
  }

  await order.save();

  invalidateCatch({ 
    product: false, 
    order: true, 
    admin: true,
    userId:order.user ,
    orderId:String(order._id),
    productId:String(order.orderItems.map(i=>i.productId))
});

  return res.status(201).json({
    success: true,
    message: "Order Processed Successfully",
  });
});

export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) return next(new ErrorHandler("Order not found", 404));

  await order.deleteOne();

  invalidateCatch({ 
    product: false,
    order: true,
    admin: true,
    userId:order.user,
    orderId:String(order._id),
    productId:String(order.orderItems.map(i=>i.productId)) 
  });

  return res.status(201).json({
    success: true,
    message: "Order Deleted Successfully",
  });
});
