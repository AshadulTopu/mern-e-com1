const BlogModel = require("../Models/BlogModel");
const UserModel = require("../Models/UserModel");

const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../Utils/ValidateMongodbId");
const CloudinaryUploadImages = require("../Utils/Cloudinary");
const fs = require("fs");

// create new blog
exports.createBlog = asyncHandler(async (req, res) => {
    try {
        // if (req.body.title) {
        //     req.body.slug = slugify(req.body.title);
        // }
        const blog = await BlogModel.create(req.body);
        res.json({
            success: true,
            message: "Blog created successfully",
            data: blog,
        });
    } catch (error) {
        throw new Error(error);
    }
});

// update blog
exports.updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        // if (req.body.title) {
        //     req.body.slug = slugify(req.body.title);
        // }
        const blog = await BlogModel.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json({
            success: true,
            message: "Blog updated successfully",
            data: blog,
        });
    } catch (error) {
        throw new Error(error);
    }
})

// delete blog
exports.deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const blog = await BlogModel.findByIdAndDelete(id);
        res.json({
            success: true,
            message: "Blog deleted successfully",
            data: blog,
        });
    } catch (error) {
        throw new Error(error);
    }
})

// get all blogs
exports.getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const blogs = await BlogModel.find();
        res.json({
            success: true,
            message: "Blogs fetched successfully",
            data: blogs,
        });
    } catch (error) {
        throw new Error(error);
    }
})

// get by id and increment views
exports.getBlogById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const blog = await BlogModel.findById(id).populate("likes").populate("dislikes"); // show post data
        const updateBlog = await BlogModel.findByIdAndUpdate( // increment views
            id,
            {
                $inc: { numViews: 1 },
            },
            { new: true }
        ).populate("likes").populate("dislikes");
        res.json({
            success: true,
            message: "Blog fetched successfully",
            // data: updateBlog,
            data: blog,
        });
    } catch (error) {
        throw new Error(error);
    }
})

// like or dislike blog
// like blog
exports.likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    console.log(blogId);
    validateMongodbId(blogId);
    // find the blog post
    const blog = await BlogModel.findById(blogId);
    // find the user
    const user = await UserModel.findById(req.user.id);
    // check if user already liked the blog
    const isLiked = blog?.isLiked;
    // check if user already disliked the blog find the user 
    const alreadyDisliked = blog?.dislikes.find((userId) => String(userId) === String(req.user.id));
    // if user already disliked the blog
    if (alreadyDisliked) {
        const blog = await BlogModel.findByIdAndUpdate(blogId, {
            $pull: { dislikes: req.user.id },
            isDisliked: false,
        }, {
            new: true
        })
        res.json({
            success: true,
            message: "Remove Disliked",
            data: blog
        })
    }
    // if user already liked the blog
    if (isLiked) {
        const blog = await BlogModel.findByIdAndUpdate(blogId, {
            $pull: { likes: req.user.id },
            isLiked: false,
        }, {
            new: true
        })
        res.json({
            success: true,
            message: "Remove Like",
            data: blog
        })
    } else {
        const blog = await BlogModel.findByIdAndUpdate(blogId, {
            $push: { likes: req.user.id },
            isLiked: true,
        }, {
            new: true
        })
        res.json({
            success: true,
            message: "Add liked",
            data: blog
        })
    }

})

// dislike blog
exports.disLikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongodbId(blogId);
    // find the blog post
    const blog = await BlogModel.findById(blogId);
    // find the user
    const user = await UserModel.findById(req.user.id);
    // check if user already liked the blog
    const isDisliked = blog?.isDisliked;
    // check if user already disliked the blog find the user 
    const alreadyLiked = blog?.likes.find((userId) => String(userId) === String(req.user.id));
    // if user already disliked the blog
    if (alreadyLiked) {
        const blog = await BlogModel.findByIdAndUpdate(blogId, {
            $pull: { likes: req.user.id },
            isLiked: false,
        }, {
            new: true
        })
        res.json({
            success: true,
            message: "Remove Like",
            data: blog
        })
    }
    // if user already disLiked the blog
    if (isDisliked) {
        const blog = await BlogModel.findByIdAndUpdate(blogId, {
            $pull: { dislikes: req.user.id },
            isDisliked: false,
        }, {
            new: true
        })
        res.json({
            success: true,
            message: "Remove Disliked",
            data: blog
        })
    }
    else {
        const blog = await BlogModel.findByIdAndUpdate(blogId, {
            $push: { dislikes: req.user.id },
            isDisliked: true,
        }, {
            new: true
        })
        res.json({
            success: true,
            message: "Add disliked",
            data: blog
        })
    }
})

// upload images
exports.uploadImages = asyncHandler(async (req, res) => {
    // console.log(req.files);
    const { id } = req.params
    validateMongodbId(id)
    try {
        // console.log(req.files);
        // upload image to cloudinary
        const uploader = (path) => CloudinaryUploadImages(path, {
            folder: "blogs",
            resource_type: "auto",
        })

        const urls = []
        const files = req.files
        // console.log(files);
        for (const file of files) {
            const { path } = file
            // console.log(path);
            const newPath = await uploader(path)
            urls.push(newPath)
            // fs.unlinkSync(path)
        }
        const blog = await BlogModel.findByIdAndUpdate(id, {
            images: urls.map((file) => {
                return file
            })
        }, {
            new: true
        })
        res.json(blog)
    } catch (error) {
        throw new Error(error)
    }
})