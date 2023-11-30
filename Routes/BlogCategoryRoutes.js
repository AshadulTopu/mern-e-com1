const router = require('express').Router()

const CategoryController = require('../Controller/BlogCategoryController')
const { authMiddleware, isAdmin } = require('../Middlewares/AuthMiddleware')

router.post('/create', authMiddleware, isAdmin, CategoryController.createCategory)
router.put('/update/:id', authMiddleware, isAdmin, CategoryController.updateCategory)
router.get('/delete/:id', authMiddleware, isAdmin, CategoryController.deleteCategory)
router.get('/categories', CategoryController.getAllCategories)
router.get('/category/:id', CategoryController.getCategoryById)



module.exports = router