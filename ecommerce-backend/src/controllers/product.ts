import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-classes.js";
import { rm } from "fs";
import { myCatch } from "../app.js";
import { invalidateCatch } from "../utils/features.js";

export const newProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, price, stock, category } = req.body;

    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please add Photo", 400));

    if (!name || !price || !stock || !category) {
      rm(photo.path, () => {
        console.log("deleted");
      });
      return next(new ErrorHandler("Please add all required filed", 400));
    }

    const product = await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo?.path,
    });

    invalidateCatch({product:true,admin:true})

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  }
);

export const getLatestProduct = TryCatch(async (req, res, next) => {

  let products;
  if(myCatch.has("latest-products"))
    products = JSON.parse(myCatch.get("latest-products") as string)
  else{
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    myCatch.set("latest-products",JSON.stringify(products))
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

export const getAllCategories = TryCatch(async (req, res, next) => {

  let categories;

  if(myCatch.has("category"))
    categories = JSON.parse(myCatch.get("category") as string)
  else{
    categories = await Product.distinct("category");
    myCatch.set("category",JSON.stringify(categories))
  }

  return res.status(200).json({
    success: true,
    categories,
  });
});

// admin controller
export const getAdminProducts = TryCatch(async (req, res, next) => {

  let products;
  if(myCatch.has('admin-products'))
    products = JSON.parse(myCatch.get('admin-products') as string)
  else{
    products = await Product.find({});
    myCatch.set("admin-products",JSON.stringify(products))
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

export const getSingleProduct = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  let product;

  if(myCatch.has(`product:${id}`))
    product = JSON.parse(myCatch.get(`product:${id}`) as string)
  else{
    product = await Product.findById(id);

    if(!product) return next(new ErrorHandler("Product not Found",404))

    myCatch.set(`product:${id}`,JSON.stringify(product))
  }

  return res.status(200).json({
    success: true,
    product,
  });
});

export const updateProduct = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const { name, price, stock, category } = req.body;
  const photo = req.file;
  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Invalid Product Id", 404));

  if (photo) {
    rm(product.photo!, () => {
      console.log("Old Photo deleted");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  await product.save();

  invalidateCatch({product:true,productId:String(product._id),admin:true})

  return res.status(201).json({
    success: true,
    message: "Product updated successfully",
  });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found", 404));

  rm(product.photo!, () => {
    console.log("Photo deleted");
  });

  await product.deleteOne();

  invalidateCatch({product:true,productId:String(product._id),admin:true})

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, category, price, sort } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price),
    };
    
    if (category) baseQuery.category = category;

    const productpromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredOnlyProduct] = await Promise.all([
      productpromise,
      Product.find(baseQuery),
    ]);

    const totalPages = Math.ceil(filteredOnlyProduct.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPages,
    });
  }
);
