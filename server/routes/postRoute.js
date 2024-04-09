// Importing required modules
const express = require('express');

// Importing our Custom controllers
const { createPost } = require('../controllers/postController');

// Importing our Custom middlewares
const { verifyUser } = require('../middlewares/verifyUser');

// Creating a router
const router = express.Router();

// Defining the routes
router.post("/createPost", verifyUser, createPost);

// Exporting the router
module.exports = router;