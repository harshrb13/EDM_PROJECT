import ErrorHandler from "../utils/utility-classes.js";
import { User } from "../models/user.js";
// Middleware to make sure user is admin or not 
export const adminOnly = async (req, res, next) => {
    const { id } = req.query;
    if (!id)
        return next(new ErrorHandler("please login", 400));
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("Invalid Id", 401));
    if (user.role === "user")
        return next(new ErrorHandler("Invalid Request", 401));
    next();
};
