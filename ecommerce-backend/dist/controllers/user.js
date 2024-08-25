import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
export const newUser = TryCatch(async (req, res, next) => {
    const { _id, name, email, gender, photo, dob } = req.body;
    const user = await User.create({
        _id,
        name,
        email,
        gender,
        photo,
        dob,
    });
    return res.status(201).json({
        success: true,
        message: `Welcome,${user.name}`,
    });
});
