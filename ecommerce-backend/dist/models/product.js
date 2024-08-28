import mongoose from "mongoose";
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product Name"],
    },
    photo: {
        type: String,
        required: [true, "Please add product Photo"],
    },
    price: {
        type: Number,
        required: [true, "Please add product Price"],
    },
    stock: {
        type: Number,
        required: [true, "Please add product Stock"],
    },
    category: {
        type: String,
        required: [true, "Please select category"],
        trim: true
    }
}, {
    timestamps: true
});
export const Product = mongoose.model("Product", schema);
