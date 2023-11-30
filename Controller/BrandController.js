
const BrandModel = require('../Models/BrandModel')
const asyncHandler = require("express-async-handler")
const validateMongodbId = require("../Utils/ValidateMongodbId");


// create new brand
exports.createBrand = asyncHandler(async (req, res) => {
    const { id } = req.user
    validateMongodbId(id)
    console.log(req.body);
    try {
        const brand = await BrandModel.create(req.body)
        res.json({
            success: true,
            message: "Brand created successfully",
            data: brand
        })
    }
    catch (error) {
        throw new Error(error)
    }
})

// update brand
exports.updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    try {
        const brand = await BrandModel.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json({
            success: true,
            message: "Brand updated successfully",
            data: brand
        })
    }
    catch (error) {
        throw new Error(error)
    }
})

// delete brand
exports.deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    try {
        const brand = await BrandModel.findByIdAndDelete(id)
        res.json({
            success: true,
            message: "Brand deleted successfully",
            data: brand
        })
    }
    catch (error) {
        throw new Error(error)
    }
})

// get all categories
exports.getAllBrands = asyncHandler(async (req, res) => {
    try {
        const categories = await BrandModel.find()
        res.json({
            success: true,
            message: "Brands fetched successfully",
            data: categories
        })
    }
    catch (error) {
        throw new Error(error)
    }
})

// get brand by id
exports.getBrandById = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    try {
        const brand = await BrandModel.findById(id)
        res.json({
            success: true,
            message: "Brand fetched successfully",
            data: brand
        })
    }
    catch (error) {
        throw new Error(error)
    }
})