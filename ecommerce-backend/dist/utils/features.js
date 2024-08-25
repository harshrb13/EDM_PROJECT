import mongoose from "mongoose";
export const connectDB = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/", {
        dbName: "EDM",
    })
        .then(c => console.log(`DB connected to ${c.connection.host}`))
        .catch(e => console.log(e));
};
