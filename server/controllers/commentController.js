// Importing required Modules

// Importing out custom models
const Comment = require("../models/commentModel");

// Importing our custom middlewares
const { errorHandler } = require("../middlewares/errorHandler");

// Controller function to Add a new comment
exports.addNewComment = async (req, res, next) => {
    try {
        // Grab the incoming data
        const { content, postId, userId } = req.body;

        // Check if the user is authorised to create a comment
        if(userId !== req.user.id){
            return next(errorHandler(403, "You are not authorised to add a comment."));
        }

        // Create a new comment based on the data
        const newComment = new Comment({
            content, 
            postId,
            userId
        });

        // Save the comment created to database
        const savedComment = await newComment.save();

        // return the saved comment as response
        res.status(201).json(savedComment);
    } catch (error) {
        next(error);
    }
}


// Controller function to Update a comment
exports.updateComment = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
}


// Controller function to Get a comment
exports.getComment = async (req, res, next) => {
    try {
        // Get all the comments for a particular post
        const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });

        // return the obtained data
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}


// Controller function to Delete a comment
exports.deleteComment = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
}