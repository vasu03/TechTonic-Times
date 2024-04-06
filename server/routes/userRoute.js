// Importing required modules
const express = require('express');
const { updateUser } = require('../controllers/userController');
const { verifyUser } = require('../middlewares/verifyUser');

// Creating a router
const router = express.Router();

// Defining the routes
router.put("/update/:userId", verifyUser, updateUser);

// Exporting the router
module.exports = router;