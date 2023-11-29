
const userModel = require('../Models/UserModel')
const asyncHandler = require('express-async-handler')
// const generateToken = require('../Config/JWTToken')
const jwt = require('jsonwebtoken')


// auth middleware
// verify token
const authMiddleware = asyncHandler(
    async (req, res, next) => {
        let token = req.headers.authorization || req.header('token')
        // let token = req.cookies.refreshToken || req.headers.authorization || req.header('token')
        if (token) {
            try {
                // Verify token
                if (token) {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET)
                    const User = await userModel.findById(decoded.id)
                    req.user = User
                    next()
                }
            } catch (error) {
                console.log(error)
                res.status(401)
                throw new Error('Not authorized, token failed to verify, please login')
            }
        } else {
            res.status(401)
            throw new Error('Not authorized, please login')
        }
    }
)






// isAdmin middleware
const isAdmin = asyncHandler(
    async (req, res, next) => {
        // console.log(req.user);
        const email = req.user.email
        const user = await userModel.findOne({ email })
        if (user && user.role === 'admin') {
            next()
        } else {
            res.status(401)
            throw new Error('You are not an admin')
        }
    }
)














module.exports = {
    authMiddleware,
    isAdmin
}