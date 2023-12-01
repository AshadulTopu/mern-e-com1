const router = require('express').Router();
const ProductController = require('../Controller/ProductsController')
const { authMiddleware, isAdmin } = require('../Middlewares/AuthMiddleware');
const { uploadPhoto, resizePhoto } = require('../Middlewares/UploadImages');

router.post('/create-product', authMiddleware, isAdmin, ProductController.createProduct);
router.get('/all-products', ProductController.getAllProducts);
router.get('/single-product/:id', ProductController.getSingleProduct);
router.put('/update-product/:id', authMiddleware, isAdmin, ProductController.updateProduct);
router.get('/delete-product/:id', authMiddleware, isAdmin, ProductController.deleteProduct);
router.put('/wishlist', authMiddleware, ProductController.addToWishlist);
router.put('/rating', authMiddleware, ProductController.updateRating);
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 10), resizePhoto, ProductController.uploadImages);


module.exports = router