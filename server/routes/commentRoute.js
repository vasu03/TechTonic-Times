// Importing required modules
const express = require('express');

// Importing our Custom controllers

// Importing our Custom middlewares
const { verifyUser } = require('../middlewares/verifyUser');
const { getComment, addNewComment, updateComment, deleteComment } = require('../controllers/commentController');

// Creating a router
const router = express.Router();

// Defining the routes
router.get("/getComment", verifyUser, getComment);
router.post("/addComment", verifyUser, addNewComment);
router.put("/editComment", verifyUser, updateComment);
router.delete("/deleteComment", verifyUser, deleteComment);

// Exporting the router
module.exports = router;