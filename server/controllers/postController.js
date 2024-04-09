// Importing Required Modules

// Importing our custom data models
const Post = require("../models/postModel");

// Importing our Custom middlewares
const { errorHandler } = require("../middlewares/errorHandler");

// Creating a createPost Controller Function
exports.createPost = async (req, res, next) => {
    try {
        // Check if the user a admin or not
        const userRole = req.user.isAdmin;
        if(!userRole){
            next(errorHandler(403, "You are not allowed to create a Post."));
        }

        // Check if the required parameters for a post are available
        const postTitle = req.body.title;
        const postContent = req.body.content;
        const postAuthorID = req.user.id;

        if(!postTitle || !postContent){
            next(errorHandler(400, "Please provide all the required fields for a post."));
        }

        // Creating a Slug for our post to improve the SEO for App
        const slug = postTitle.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, " ");

        // .Creating a new post
        const newPost = new Post({
            ...req.body,
            slug,
            userId: postAuthorID,
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);

    } catch (error) {
        next(error);
    }
};