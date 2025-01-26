// Importing required modules
const mongoose = require('mongoose');

// Creating the Comment Schema
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    likes: {
        type: Array,
        default: []
    },
    numberOfLike: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Exporting our model
module.exports = mongoose.model("Comment", commentSchema);
