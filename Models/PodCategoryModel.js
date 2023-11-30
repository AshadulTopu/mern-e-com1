const mongoose = require('mongoose')

const podCategorySchema = new mongoose.Schema({
    title: {
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


module.exports = mongoose.model('PodCategory', podCategorySchema)