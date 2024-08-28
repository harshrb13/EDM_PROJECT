import mongoose from "mongoose";
import { Product } from "../models/product.js";
import { myCatch } from "../app.js";
export const connectDB = (uri) => {
    mongoose.connect(uri, {
        dbName: "EDM",
    })
        .then(c => console.log(`DB connected to ${c.connection.host}`))
        .catch(e => console.log(e));
};
export const invalidateCatch = async ({ product, order, admin, userId, orderId, productId }) => {
    if (product) {
        const productKeys = [
            "latest-products",
            "admin-products",
            "category",
            `product:${productId}`
        ];
        if (typeof productId === "string")
            productKeys.push(`product:${productId}`);
        if (typeof productId === "object")
            productId.forEach(i => {
                productKeys.push(`product:${i}`);
            });
        myCatch.del(productKeys);
    }
    if (order) {
        const orderKeys = [
            "all-orders",
            `my-orders-${userId}`,
            `order - ${orderId}`
        ];
        myCatch.del(orderKeys);
    }
    if (admin) {
    }
};
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new Error("Product not found");
        product.stock -= order.quantity;
        product.save();
    }
};
