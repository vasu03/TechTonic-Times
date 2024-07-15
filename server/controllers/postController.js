// Importing our custom data models
const Post = require("../models/postModel");

// Importing our Custom middlewares
const { errorHandler } = require("../middlewares/errorHandler");


// creating a getPost controller function
exports.getPost = async (req, res, next) => {
    try {
        // parameters to show the posts
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === "asc" ? 1 : -1;

        // search the post over different parameters available
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: "i" } },
                    { content: { $regex: req.query.searchTerm, $options: "i" } },
                ],
            }),
        }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);

        // tracking total no. of posts
        const totalPosts = await Post.countDocuments();

        const now = new Date();

        // total post created one month ago
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        // Send all data in response
        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts
        });
    } catch (error) {
        next(error);
    }
};


// Creating a createPost Controller Function
exports.createPost = async (req, res, next) => {
    try {
        // Check if the user a admin or not
        const userRole = req.user.isAdmin;
        if (!userRole) {
            next(errorHandler(403, "You are not allowed to create a Post."));
        }

        // Check if the required parameters for a post are available
        const postTitle = req.body.title;
        const postContent = req.body.content;
        const postAuthorID = req.user.id;

        if (!postTitle || !postContent) {
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


// Creating a updatePost controller function
exports.updatePost = async (req, res, next) => {
    try {
        // Check if the user is authorised to update a post or not
        if (!req.user.isAdmin || req.user.id !== req.params.userId) {
            return next(errorHandler(403, "Unauthorised to update this Post."));
        }

        // find the post and update only specific details of a post
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $set: {
                    title: req.body.title,
                    image: req.body.image,
                    category: req.body.category,
                    content: req.body.content
                },
            }, { new: true }
        );

        // sending the response
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};


// Creating a deletePost controller function
exports.deletePost = async (req, res, next) => {
    try {
        // Check if the user is authorised to delete a post or not
        if (!req.user.isAdmin || req.user.id !== req.params.userId) {
            return next(errorHandler(403, "Unauthorised to delete this Post."));
        }

        // Find the specific post and delete it
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json("Post deleted Successfully.");
    } catch (error) {
        next(error);
    }
};
