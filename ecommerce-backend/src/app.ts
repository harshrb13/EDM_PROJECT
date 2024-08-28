import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import {config} from "dotenv";
import morgon from "morgan";


//import routes
import productRoute from "./routes/product.js"
import userRoute from "./routes/user.js"
import orderRoute from "./routes/order.js"


config({
    path:"./.env"
})

const app = express()

export const myCatch = new NodeCache()

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || "";

connectDB(mongoUri);


app.use(express.json())
app.use(morgon('dev'))

app.use("/api/v1/user",userRoute)
app.use("/api/v1/product",productRoute)
app.use("/api/v1/order",orderRoute)


app.use('/uploads',express.static('uploads'))
// errorHandler middleaware
app.use(errorMiddleware)

app.listen(port,()=>{
    console.log(`Server is listen on http://localhost:${port}`)
})