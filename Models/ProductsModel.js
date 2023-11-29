const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    // category: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Category'
    // },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    brand: {
        type: String,
        required: true
    },
    // brand: {
    //     type: String,
    //     // default: []
    //     enum: [
    //         'Apple',
    //         'Samsung',
    //         'HP',
    //         'Lenovo',
    //         'Asus',
    //         'Dell',
    //     ]
    // },
    freeShipping: {
        required: false,
        type: Boolean
    },
    // color: {
    //     type: String,
    //     enum: [
    //         'Black',
    //         'Brown',
    //         'Silver',
    //         'White',
    //         'Blue',
    //         'Red',
    //     ]
    // },
    color: {
        type: String,
        required: true
    },
    ratings: [
        {
            star: Number,
            postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }
    ]
},
    {
        timestamps: true,
        versionKey: false
    }
)



module.exports = mongoose.model('Product', productSchema)
