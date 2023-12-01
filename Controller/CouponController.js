const couponModel = require('../Models/CouponModel')
const asyncHandler = require("express-async-handler")
const validateMongodbId = require("../Utils/ValidateMongodbId");

// create new coupon
exports.createCoupon = asyncHandler(async (req, res) => {
    try {
        const coupon = await couponModel.create(req.body)
        res.json({
            success: true,
            message: "Coupon created successfully",
            data: coupon
        })
    }
    catch (error) {
        throw new Error(error)
    }
})

// get all coupons
exports.getAllCoupons = asyncHandler(async (req, res) => {
    try {
        const coupons = await couponModel.find()
        res.json(coupons)
    } catch (error) {
        throw new Error(error)
    }
})

// get single coupon
exports.getSingleCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    try {
        const coupon = await couponModel.findById(id)
        res.json(coupon)
    } catch (error) {
        throw new Error(error)
    }
})

// update coupon
exports.updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    try {
        const coupon = await couponModel.findByIdAndUpdate(id, req.body, {
            new: true,
        })
        res.json(coupon)
    } catch (error) {
        throw new Error(error)
    }
})

// delete coupon
exports.deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const coupon = await couponModel.findByIdAndDelete(id);
        res.json({
            success: true,
            message: "Coupon deleted successfully",
            data: coupon,
        });
    } catch (error) {
        throw new Error(error);
    }
})