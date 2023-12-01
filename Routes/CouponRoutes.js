
const router = require('express').Router()

const CouponController = require('../Controller/CouponController')
const { authMiddleware, isAdmin } = require('../Middlewares/AuthMiddleware')


router.post('/create', authMiddleware, isAdmin, CouponController.createCoupon)
router.put('/update/:id', authMiddleware, isAdmin, CouponController.updateCoupon)
router.get('/delete/:id', authMiddleware, isAdmin, CouponController.deleteCoupon)
router.get('/', CouponController.getAllCoupons)
router.get('/:id', CouponController.getSingleCoupon)


module.exports = router