// Importing required modules
const router = require("express").Router();
const { signUp } = require("../controllers/authController");

// Defining the routes
router.post('/signUp', signUp);

// Exporting the router
module.exports = router;