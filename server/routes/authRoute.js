// Importing required modules
const express = require("express");

// Importing our Custom controllers
const { signUp, signIn, google, signOut, deleteUserAccount, updateUserAccount } = require("../controllers/authController");

// Importing our Custom middlewares
const { verifyUser } = require("../middlewares/verifyUser");

// Creating a router
const router = express.Router();

// Defining the routes
router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.post("/google", google);
router.post("/signOut", signOut);
router.put("/update/:userId", verifyUser, updateUserAccount)
router.delete("/delete/:userId", verifyUser, deleteUserAccount);


// Exporting the router
module.exports = router;