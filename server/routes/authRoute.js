// Importing required modules
const router = require("express").Router();
const { signUp, signIn, google } = require("../controllers/authController");

// Defining the routes
router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.post('/google', google);

// Exporting the router
module.exports = router;