// Importing required modules
const express = require('express');

// Importing our Custom controllers

// Importing our Custom middlewares
const { verifyUser } = require('../middlewares/verifyUser');
const { getComment, addNewComment, updateComment, likeComment, deleteComment } = require('../controllers/commentController');

// Creating a router
const router = express.Router();

// Defining the routes
router.get("/getComment/:postId", getComment);
router.post("/addComment", verifyUser, addNewComment);
router.put("/editComment/:commentId", verifyUser, updateComment);
router.put("/likeComment/:commentId", verifyUser, likeComment);
router.delete("/deleteComment", verifyUser, deleteComment);

// Exporting the router
module.exports = router;