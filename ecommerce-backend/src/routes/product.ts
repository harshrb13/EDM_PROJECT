import express from 'express'
import { deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getLatestProduct, getSingleProduct, newProduct, updateProduct } from '../controllers/product.js'
import { singleUpload } from '../middlewares/multer.js'
import { adminOnly } from '../middlewares/auth.js'

const router = express.Router()


//route /api/v1/product/new
router.post("/new",adminOnly,singleUpload,newProduct)


//route /api/v1/product/latest
router.get("/latest",getLatestProduct)

//route /api/v1/product/categories
router.get("/categories",getAllCategories)

//route /api/v1/product/all
router.get("/all",getAllProducts)

//route /api/v1/product/admin-products
router.get("/admin-products",adminOnly,getAdminProducts)


//route /api/v1/product/admin/:dynamicId
router.route("/:id")
.get(getSingleProduct)
.patch(adminOnly,singleUpload,updateProduct)
.delete(adminOnly,deleteProduct)

export default router