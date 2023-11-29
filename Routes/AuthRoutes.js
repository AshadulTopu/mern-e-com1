const router = require('express').Router();
const { authMiddleware, isAdmin } = require('../Middlewares/AuthMiddleware');

const userController = require('../Controller/UserController');

router.post('/registration', userController.registration);
router.get('/login', userController.login);
router.get('/all-users', userController.getUsers);
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





module.exports = router