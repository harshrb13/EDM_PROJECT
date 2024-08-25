import express from "express";


//import routes
import userRoute from "./routes/user.js"
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";


const port = 3000;
const app = express()
connectDB();

app.use(express.json())

app.use("/api/v1/user",userRoute)




// errorHandler middleaware
app.use(errorMiddleware)

app.listen(port,()=>{
    console.log(`Server is listen on http://localhost:${port}`)
})