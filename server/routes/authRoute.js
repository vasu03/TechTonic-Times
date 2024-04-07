// Importing required modules
const express = require("express");

// Importing our Custom controllers
const { signUp, signIn, google, signOut } = require("../controllers/authController");

// Creating a router
const router = express.Router();

// Defining the routes
router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.post("/google", google);
router.post("/signOut", signOut);

// Exporting the router
module.exports = router;