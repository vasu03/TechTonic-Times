// Importing required modules
const router = require("express").Router();
const { signUp, signIn } = require("../controllers/authController");

// Defining the routes
router.post('/signUp', signUp);
router.post('/signIn', signIn);

// Exporting the router
module.exports = router;