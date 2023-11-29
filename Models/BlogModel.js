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
    image: {
        type: String,
        // required: true,
        default: "https://images.unsplash.com/photo-1605106706229-9b2a5a9a3f5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
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