// Importing required modules
const mongoose = require('mongoose');

// Creating the User Schema
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true  
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    profilePicture: {
        type: String,
        default: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Clipart.png"
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Exporting our model
module.exports = mongoose.model("User", userSchema);
