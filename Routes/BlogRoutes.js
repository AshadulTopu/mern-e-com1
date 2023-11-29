const router = require("express").Router();
const blogController = require("../Controller/BlogController");

router.post("/create-blog", blogController.createBlog);




module.exports = router