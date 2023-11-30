const router = require('express').Router()

const BrandController = require('../Controller/BrandController')
const { authMiddleware, isAdmin } = require('../Middlewares/AuthMiddleware')

router.post('/create', authMiddleware, isAdmin, BrandController.createBrand)
router.put('/update/:id', authMiddleware, isAdmin, BrandController.updateBrand)
router.get('/delete/:id', authMiddleware, isAdmin, BrandController.deleteBrand)
router.get('/brands', BrandController.getAllBrands)
router.get('/brand/:id', BrandController.getBrandById)

module.exports = router