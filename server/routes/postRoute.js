// Importing required modules
const express = require('express');

// Importing our Custom controllers
const { createPost, getPost, deletePost, updatePost } = require('../controllers/postController');

// Importing our Custom middlewares
const { verifyUser } = require('../middlewares/verifyUser');

// Creating a router
const router = express.Router();

// Defining the routes
router.post("/createPost", verifyUser, createPost);
router.get("/getPost", getPost);
router.delete("/deletePost/:postId/:userId", verifyUser, deletePost);
router.put("/updatePost/:postId/:userId", verifyUser, updatePost);

// Exporting the router
module.exports = router;