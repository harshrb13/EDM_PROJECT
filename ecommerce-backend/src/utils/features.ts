import mongoose from "mongoose";
import { InvalidateCatchProps, OrderItemType } from "../types/types.js";
import { Product } from "../models/product.js";
import { myCatch } from "../app.js";
import { Document } from "mongoose";
import { Order } from "../models/order.js";

export const connectDB = (uri: string) => {
  mongoose
    .connect(uri, {
      dbName: "EDM",
    })
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

export const invalidateCatch = ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: InvalidateCatchProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "admin-products",
      "category",
      `product:${productId}`,
    ];

    if (typeof productId === "string") productKeys.push(`product:${productId}`);
    if (typeof productId === "object")
      productId.forEach((i) => {
        productKeys.push(`product:${i}`);
      });
    myCatch.del(productKeys);
  }

  if (order) {
    const orderKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order - ${orderId}`,
    ];

    myCatch.del(orderKeys);
  }

  if (admin) {
    myCatch.del([
      "admin-stats",
      "admin-pie-charts",
      "admin-bar-chart",
      "admin-line-chart"
    ])
  }
};

export const reduceStock = async (orderItems: OrderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product not found");
    product.stock -= order.quantity;
    product.save();
  }
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100;
  const percent = (thisMonth / lastMonth) * 100;
  return Number(percent.toFixed(0));
};

export const getInventories = async ({
  categories,
  productsCount,
}: {
  categories: string[];
  productsCount: number;
}) => {

  const categoriesCountPromise = categories.map((category: string) => {
    return Product.countDocuments({ category });
  });

  const categoriesCount = await Promise.all(categoriesCountPromise);

  const categoryCount: Record<string, number>[] = [];

  categories.forEach((category, i) => {
    categoryCount.push({
      [category]: Math.round((categoriesCount[i] / productsCount) * 100),
    });
  });

  return categoryCount;
};

interface MyDocument extends Document{
  createdAt:Date;
  discount?:number;
  total?:number;
}

type funcProps = {
  length:number,
  docArr:MyDocument[]
  today:Date,
  property?:"discount" | "total"
}

export const getChartData =({length,docArr,today,property}:funcProps)=>{
  
  const data:number[] = new Array(length).fill(0)

    docArr.forEach((i)=>{
      const creationDate = i.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth()+12)%12;

      if(monthDiff < length){
        data[length-monthDiff-1] += property?i[property]!:1;
      }
    })

    return data;
}
