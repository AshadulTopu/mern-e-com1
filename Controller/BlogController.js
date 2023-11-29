const BlogModel = require("../Models/BlogModel");
const UserModel = require("../Models/UserModel");

const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../Utils/ValidateMongodbId");


// create new blog
exports.createBlog = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const blog = await BlogModel.create(req.body);
        res.json(blog);
    } catch (error) {
        throw new Error(error);
    }
});