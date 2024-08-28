import { NextFunction, Request, Response } from "express";
import { NewUserRequestBody } from "../types/types.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-classes.js";
import { TryCatch } from "../middlewares/error.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { _id, name, email, gender, photo, dob } = req.body;
    let user = await User.findById(_id);
    if (user)
      return res.status(200).json({
        success: true,
        message: `Welcome,${user.name}`,
      });

    if (!_id || !name || !email || !gender || !photo || !dob)
      return next(new ErrorHandler("Please add all field", 400));

    user = await User.create({
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
  }
);

export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    success: true,
    users,
  });
});

export const getUserDetail = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid ID", 400));

  res.status(200).json({
    success: true,
    user,
  });
});

export const deleteUser= TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid ID", 400));

  await user?.deleteOne()
  res.status(200).json({
    success: true,
    message:"User Deleted Successfully",
  });
});
