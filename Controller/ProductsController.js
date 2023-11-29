
const ProductModel = require('../Models/ProductsModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../Utils/ValidateMongodbId')
const slugify = require('slugify')

// create new product
exports.createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const product = await ProductModel.create(req.body)
        res.json(product)
    } catch (error) {
        throw new Error(error)
    }
})

// get all products
// exports.getAllProducts = asyncHandler(async (req, res) => {
//     try {
//         const products = await ProductModel.find()
//         res.json(products)
//     } catch (error) {
//         throw new Error(error)
//     }
// })

// get single product
exports.getSingleProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    try {
        const product = await ProductModel.findById(id)
        res.json(product)
    } catch (error) {
        throw new Error(error)
    }
})

// update product
exports.updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const product = await ProductModel.findByIdAndUpdate(id, req.body, {
            new: true,
        })
        res.json(product)
    } catch (error) {
        throw new Error(error)
    }
})

// delete product
exports.deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const product = await ProductModel.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: product,
        });
    } catch (error) {
        throw new Error(error);
    }
});

// get all products by simple query
// exports.getAllProducts = asyncHandler(async (req, res) => {
//     const query = req.query
//     console.log(query);
//     try {
//         const products = await ProductModel.find(query)
//         res.json(products)
//     } catch (error) {
//         throw new Error(error)
//     }
// })


// get all products by advanced query
exports.getAllProducts = asyncHandler(async (req, res) => {
    try {

        // filtering
        const queryObj = { ...req.query }
        const excludeFields = ['sort', 'page', 'limit', 'fields']
        excludeFields.forEach((el) => delete queryObj[el])

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

        // console.log(queryStr);
        // console.log(JSON.parse(queryStr));
        let query = ProductModel.find(JSON.parse(queryStr))


        // sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt')
        }

        // limiting fields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }

        // pagination
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit) // the skip means how many products to skip from the start index in database and limit means how many products to show
        // console.log(page, limit, skip);
        if (req.query.page) {
            const numProducts = await ProductModel.countDocuments()
            if (skip >= numProducts) throw new Error('This page does not exist')
        }


        const products = await query
        res.json(products)
    } catch (error) {
        throw new Error(error)
    }
})