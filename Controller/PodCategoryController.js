
const CategoryModel = require('../Models/PodCategoryModel')
const asyncHandler = require("express-async-handler")
const validateMongodbId = require("../Utils/ValidateMongodbId");


// create new category
exports.createCategory = asyncHandler(async (req, res) => {
    const { id } = req.user
    validateMongodbId(id)
    console.log(req.body);
    try {
        const category = await CategoryModel.create(req.body)
        res.json({
            success: true,
            message: "Category created successfully",
            data: category
        })
    }
    catch (error) {
        throw new Error(error)
    }
})

// update category
exports.updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    try {
        const category = await CategoryModel.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json({
            success: true,
            message: "Category updated successfully",
            data: category
        })
    }
    catch (error) {
        throw new Error(error)
    }
})

// delete category
exports.deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    try {
        const category = await CategoryModel.findByIdAndDelete(id)
        res.json({
            success: true,
            message: "Category deleted successfully",
            data: category
        })
    }
    catch (error) {
        throw new Error(error)
    }
})

// get all categories
exports.getAllCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await CategoryModel.find()
        res.json({
            success: true,
            message: "Categories fetched successfully",
            data: categories
        })
    }
    catch (error) {
        throw new Error(error)
    }
})

// get category by id
exports.getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    try {
        const category = await CategoryModel.findById(id)
        res.json({
            success: true,
            message: "Category fetched successfully",
            data: category
        })
    }
    catch (error) {
        throw new Error(error)
    }
})