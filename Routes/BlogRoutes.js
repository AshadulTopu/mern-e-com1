const router = require("express").Router();
const blogController = require("../Controller/BlogController");
const { authMiddleware, isAdmin } = require("../Middlewares/authMiddleware");


router.post("/create-blog", authMiddleware, isAdmin, blogController.createBlog);
router.put("/update-blog/:id", authMiddleware, isAdmin, blogController.updateBlog);
router.get("/delete-blog/:id", authMiddleware, isAdmin, blogController.deleteBlog);
router.get("/blog-post/", blogController.getAllBlogs);
router.get("/blog-post/:id", blogController.getBlogById);
router.put("/like-blog/", authMiddleware, blogController.likeBlog);
router.put("/dislike-blog/", authMiddleware, blogController.disLikeBlog);


module.exports = router