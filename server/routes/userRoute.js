// Importing required modules
const express = require('express');

// Importing our Custom controllers
const { updateUser, deleteUser } = require('../controllers/userController');

// Importing our Custom middlewares
const { verifyUser } = require('../middlewares/verifyUser');

// Creating a router
const router = express.Router();

// Defining the routes
router.put("/update/:userId", verifyUser, updateUser);
router.delete("/delete/:userId", verifyUser, deleteUser);

// Exporting the router
module.exports = router;