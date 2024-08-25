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
  }
);
