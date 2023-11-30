const router = require('express').Router();
const ProductController = require('../Controller/ProductsController')
const { authMiddleware, isAdmin } = require('../Middlewares/AuthMiddleware');

router.post('/create-product', authMiddleware, isAdmin, ProductController.createProduct);
router.get('/all-products', ProductController.getAllProducts);
router.get('/single-product/:id', ProductController.getSingleProduct);
router.put('/update-product/:id', authMiddleware, isAdmin, ProductController.updateProduct);
router.get('/delete-product/:id', authMiddleware, isAdmin, ProductController.deleteProduct);
router.put('/wishlist', authMiddleware, ProductController.addToWishlist);
router.put('/rating', authMiddleware, ProductController.updateRating);


module.exports = router