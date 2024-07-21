// Importing required modules
const express = require("express");

// Importing our Custom controllers
const { updateUser, deleteUser, getUsers, getCommentUsers } = require("../controllers/userController");

// Importing our Custom middlewares
const { verifyUser } = require("../middlewares/verifyUser");

// Creating a router
const router = express.Router();

// Defining the routes
router.delete("/delete/:userId", verifyUser, deleteUser);
router.get("/getUsers", verifyUser, getUsers);
router.get("/getCommentUser/:userId", getCommentUsers);

// Exporting the router
module.exports = router;