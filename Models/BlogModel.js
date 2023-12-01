const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    // content: {
    //     type: String,
    //     required: true
    // },
    category: {
        type: String,
        required: true
    },
    numViews: {
        type: Number,
        default: 0
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisliked: {
        type: Boolean,
        default: false
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    author: {
        type: String,
        // required: true,
        default: "Admin"
    },
    tags: [String],
    images: [],
    // date: {
    //     type: Date,
    //     default: Date.now
    // },

},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Blog', blogSchema)