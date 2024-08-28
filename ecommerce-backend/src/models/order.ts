import mongoose from "mongoose";

const schema = new mongoose.Schema({
    shippingInfo:{
        address:{
            type:String,
            required:[true,"Please add Address"]
        },
        city:{
            type:String,
            required:[true,"Please add city"]
        },
        state:{
            type:String,
            required:[true,"Please add State"]    
        },
        country:{
            type:String,
            required:[true,"Please add Country"]
        },
        pincode:{
            type:Number,
            required:[true,"Please add Pincode"]
        }
    },
    user:{
        type:String,
        ref:"User",
        required:true
    },
    subtotal:{
        type:Number,
        required:true
    },
    tax:{
        type:Number,
        required:true
    },
    shippingCharges:{
        type:Number,
        default:0
    },
    discount:{
        type:Number,
        default:0
    },
    total:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["Processing","Shipped","Delivered"],
        default:"Processing"
    },
    orderItems:[
        {
            name:String,
            photo:String,
            price:Number,
            quantity:Number,
            productId:{
                type:mongoose.Types.ObjectId,
                ref:"Product"
            }
        }
    ]
},
{
    timestamps:true
});

export const Order = mongoose.model("Order", schema);
