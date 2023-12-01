const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        default: "user",
        // enum: ["user", "admin"],
        trim: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    cart: {
        type: Array,
        default: [],
    },
    // address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    address: {
        type: String,
        trim: true,
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: {
        type: String,
    },
    picture: {
        type: String,
        trim: true,
    },
    passwordChangeAt: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date }
},
    {
        timestamps: true,
        versionKey: false
    }
);

// check if password is changed then hash the password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        this.passwordChangeAt = Date.now();
        next();
    }
    next();
});

// Hash the password
// userSchema.pre('save', async function (next) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// })
// Compare the password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 600000; // Token expires in 10 minutes
    return resetToken;
};



//Export the model
module.exports = mongoose.model('User', userSchema);