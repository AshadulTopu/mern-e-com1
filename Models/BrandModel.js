const mongoose = require('mongoose')

const BrandSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true
    }
},
    {
        timestamps: true,
        versionKey: false
    })


module.exports = mongoose.model('Brands', BrandSchema)