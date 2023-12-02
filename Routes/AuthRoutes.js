const router = require('express').Router();
const { authMiddleware, isAdmin } = require('../Middlewares/AuthMiddleware');

const userController = require('../Controller/UserController');

router.post('/registration', userController.registration);
router.get('/login', userController.login);
router.get('/all-users', authMiddleware, isAdmin, userController.getUsers);
router.get('/single-user/:id', authMiddleware, userController.getSingleUser);
router.get('/delete-user/:id', authMiddleware, userController.deleteUser);
router.put('/update-user/:id', authMiddleware, userController.updateUser);
router.post('/block-user/:id', authMiddleware, isAdmin, userController.blockUser);
router.post('/unblock-user/:id', authMiddleware, isAdmin, userController.unblockUser);
router.get('/refresh-token', userController.refreshToken);
router.get('/logout', userController.logout);
router.put('/update-password', authMiddleware, userController.updatePassword);
router.post('/forgot-password-token', userController.forgotPasswordToken);
router.put('/reset-password/:token', userController.resetPassword);
router.get('/admin', userController.loginAdmin);
router.get('/wishlist', authMiddleware, userController.getWishList);
router.put('/save-address', authMiddleware, userController.saveAddress);
router.post('/cart', authMiddleware, userController.addToCart);
router.get('/cart', authMiddleware, userController.getCart);
router.put('/cart-item', authMiddleware, userController.emptyCart);
router.post('/apply-coupon', authMiddleware, userController.applyCoupon);
router.post('/cash-order', authMiddleware, userController.createOrder);
router.get('/orders', authMiddleware, userController.getOrders);
router.put('/order-status/:id', authMiddleware, isAdmin, userController.updateOrderStatus);




module.exports = router