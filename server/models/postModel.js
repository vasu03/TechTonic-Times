// Importing required modules
const mongoose = require('mongoose');

// Creating the post Schema
const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://www.royacdn.com/unsafe/Site-76541409-4f72-43f9-b369-2d2bc9eaf57f/main/shutterstock_548780890_1_tinified.jpg"
    },
    category: {
        type: String,
        default: "uncategorized"
    },
    slug: {
        type: String,
        unique: true,
        required: true
    }
}, { timestamps: true });

// Exporting our model
module.exports = mongoose.model('Post', postSchema);