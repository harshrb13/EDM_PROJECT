import mongoose from "mongoose"
import { InvalidateCatchProps, OrderItemType } from "../types/types.js"
import { Product } from "../models/product.js"
import { myCatch } from "../app.js"
import { Order } from "../models/order.js"

    export const connectDB=(uri:string)=>{
        mongoose.connect(uri,{
        dbName:"EDM",
        })
        .then(c=>console.log(`DB connected to ${c.connection.host}`))
        .catch(e=>console.log(e))
    }

    export const invalidateCatch = async({
        product,
        order,
        admin,
        userId,
        orderId,
        productId
    }:InvalidateCatchProps)=>{

        if(product){
            const productKeys:string[] = [
                "latest-products",
                "admin-products",
                "category",
                `product:${productId}`
            ]

            if(typeof productId==="string") productKeys.push(`product:${productId}`)
            if(typeof productId==="object") productId.forEach(i=>{
                productKeys.push(`product:${i}`)
            })
            myCatch.del(productKeys)
        }

        if(order){
            const orderKeys:string[] = [
                "all-orders",
                `my-orders-${userId}`,
                `order - ${orderId}`
            ]

            myCatch.del(orderKeys)
        }
        
        if(admin){

        }
    }

    export const reduceStock = async(orderItems:OrderItemType[])=>{
        for (let i = 0; i < orderItems.length; i++) {
            const order = orderItems[i];
            const product = await Product.findById(order.productId)
            if(!product) throw new Error("Product not found")
            product.stock -= order.quantity;
            product.save()
        }
    }