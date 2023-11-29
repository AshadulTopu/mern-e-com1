const userModel = require('../Models/UserModel')
const asyncHandler = require('express-async-handler')
const generateToken = require('../Config/JWTToken')
const validateMongodbId = require('../Utils/ValidateMongodbId')
const generateRefreshToken = require('../Config/RefreshToken')
const jwt = require('jsonwebtoken')
// const { token } = require('morgan')
const sendEmail = require('./EmailController')
const crypto = require('crypto')

exports.registration = asyncHandler(
    async (req, res) => {
        const { firstName, lastName, email, phone, password, role } = req.body

        if (!firstName || !lastName || !email || !phone || !password || !role) {
            return res.status(400).json({ error: "All fields are required" })
        }
        // check if user exist
        const userExist = await userModel.findOne({ email: email })
        if (userExist) {
            // return res.status(400).json({ error: "User already exist" })
            throw new Error("User already exist")
        }
        // create new user
        const user = new userModel({
            firstName,
            lastName,
            email,
            phone,
            password,
            role
        })
        await user.save()
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        })

    }
)

// login user
exports.login = asyncHandler(
    async (req, res) => {
        const { email, password } = req.body
        // console.log(email, password);
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }
        // check if user exist
        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        // console.log(user);
        // compare password  
        const isMatch = await user.comparePassword(password)
        // console.log(isMatch);
        if (!isMatch) {
            // return res.status(401).json({ error: "Invalid credentials" }) // note: if you show the error message, some time the hacker will understand that the gmail also have an account,
            //return res.status(401).json({ error: "Email or Password Invalid" }) // note: if you show the error message, some time the hacker will take time to understand that is the gmail has any account,
            throw new Error("Email or Password Invalid")
        }
        // generate fresh token
        const refreshToken = await generateRefreshToken(user._id)
        const updatedUser = await userModel.findByIdAndUpdate(user._id, { refreshToken: refreshToken }, { new: true })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: user, // don't send password in response data 
            token: generateToken(user._id),
        })
    }
)

// refresh token handler
exports.refreshToken = asyncHandler(
    async (req, res) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) { // check if the user refresh token exist in cookies
            throw new Error("No refresh token found")
        }
        const user = await userModel.findOne({ refreshToken })
        if (!user) { // check if the user refresh token exist in database
            // return res.status(403).json({ error: "Please login or register" })
            throw new Error("Please login or register")
        }

        // compare refresh token
        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err || user.id !== decoded.id) { // check if the user refresh token is valid or not 
                throw new Error("Please login or register")
            }
        })

        // generate fresh token
        const freshToken = await generateRefreshToken(user._id)
        const updatedUser = await userModel.findByIdAndUpdate(user._id, { refreshToken: refreshToken }, { new: true })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: user, // don't send password in response data 
            token: freshToken,
        })
    }
)

// logout user
exports.logout = asyncHandler(
    async (req, res) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) { // check if the user refresh token exist in cookies
            throw new Error("No refresh token found")
        }
        const user = await userModel.findOne({ refreshToken })
        if (!user) { // check if the user refresh token exist in database
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true
            })
            return res.sendStatus(204) // forbidden
        }
        await userModel.findByIdAndUpdate(user._id, { refreshToken: "" })
        if (!user) { // check if the user refresh token exist in database
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true
            })
            return res.sendStatus(204)
        }
    }
)

// get all users
exports.getUsers = asyncHandler(
    async (req, res) => {
        try {
            const users = await userModel.find()
            res.status(200).json({
                success: true,
                message: "Users fetched successfully",
                data: users,
            })
        } catch (error) {
            // res.status(500).json({ error: error.message })
            throw new Error(error)
        }
    }
)

// get single user
exports.getSingleUser = asyncHandler(
    async (req, res) => {
        try {
            const userId = req.user.id;
            validateMongodbId(userId);
            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: user,
            });
        } catch (error) {
            throw new Error(error);
        }
    }
);

// delete user
exports.deleteUser = asyncHandler(
    async (req, res) => {
        try {
            const userId = req.user.id;
            validateMongodbId(userId);
            const user = await userModel.findByIdAndDelete(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
                data: user,
            });
        } catch (error) {
            throw new Error(error);
        }
    }
)

// update user
exports.updateUser = asyncHandler(
    async (req, res) => {
        try {
            const userId = req.user.id;
            validateMongodbId(userId);
            const user = await userModel.findByIdAndUpdate(userId, req.body, {
                new: true,
            });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: user,
            });
        } catch (error) {
            throw new Error(error);
        }
    }
)

// block user
exports.blockUser = asyncHandler(
    async (req, res) => {
        try {
            // const userId = req.user.id; // admin id
            const userId = req.params.id; // user id
            validateMongodbId(userId);
            const user = await userModel.findByIdAndUpdate(userId, { isBlocked: true }, {
                new: true,
            });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json({
                success: true,
                message: "User blocked successfully",
                data: user,
            });
        } catch (error) {
            throw new Error(error);
        }
    }
);

// unblock user
exports.unblockUser = asyncHandler(
    async (req, res) => {
        try {
            // const userId = req.user.id; // admin id
            const userId = req.params.id; // user id
            validateMongodbId(userId);
            const user = await userModel.findByIdAndUpdate(userId, { isBlocked: false }, {
                new: true,
            });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json({
                success: true,
                message: "User unblocked successfully",
                data: user,
            });
        } catch (error) {
            throw new Error(error);
        }
    }
);

//update password
exports.updatePassword = asyncHandler(
    async (req, res) => {
        try {
            const userId = req.user.id;
            validateMongodbId(userId);

            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const { password } = req.body;
            // const hashedPassword = await bcrypt.hash(password, 10);
            // user.password = hashedPassword;
            user.password = password;
            await user.save();
            res.status(200).json({
                success: true,
                message: "Password update successfully",
                data: user,
            });
        } catch (error) {
            throw new Error(error);
        }
    }
)

// forgot password
exports.forgotPasswordToken = asyncHandler(
    async (req, res) => {
        const { email } = req.body;
        // const { email } = req.user;
        // console.log(email);
        const user = await userModel.findOne({ email });
        if (!user) {
            // return res.status(404).json({ error: "User not found" });
            throw new Error("User not found with this email");
        }
        try {
            // create reset token
            const resetToken = await user.generatePasswordResetToken();
            console.log(resetToken);
            await user.save();
            const resetUrl = `${req.protocol}://${req.get("host")}/api/user/reset-password/${resetToken}`;
            const message = `Your password reset token is :- \n\n ${resetUrl} \n This request is only valid for 10 minutes \nIf you have not requested this email then, please ignore it.`;
            const data = {
                to: user.email,
                text: message,
                subject: "Password Recovery",
                htm: resetUrl,
            }

            await sendEmail(data);
            res.status(200).json({
                success: true,
                message: `Email send to ${user.email}`,
                data: resetToken,
            })
        } catch (error) {
            // user.passwordResetToken = undefined;
            // user.passwordResetExpires = undefined;
            // await user.save();
            // return res
            //     .status(500)
            //     .json({ error: "Email could not be sent" });
            throw new Error(error);
        }
    }
)

// reset password
exports.resetPassword = asyncHandler(
    async (req, res) => {
        try {
            const { token } = req.params;
            console.log(token);
            const { password } = req.body;
            const hashPasswordToken = crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");
            const user = await userModel.findOne({
                passwordResetToken: hashPasswordToken,
                passwordResetExpires: { $gt: Date.now() },
            });
            if (!user) {
                // return res
                //     .status(400)
                //     .json({ error: "Token is invalid or has expired" });
                throw new Error("Token is invalid or has expired");
            }
            user.password = password;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            res.status(200).json({
                success: true,
                message: "Password updated successfully",
                data: user,
            });
        } catch (error) {
            throw new Error(error);
        }
    }
) 