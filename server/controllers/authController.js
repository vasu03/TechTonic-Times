// Importing Required Modules
const bcrypt = require('bcryptjs');
const User = require("../models/userModel");
const { validateUserRegistration, validateUserLogin } = require("../middlewares/authUserValidattion");


// Creating a signUp Controller Function
exports.signUp = async (req, res, next) => {
    try {
        // Validating the user info before creating it
        validateUserRegistration(req.body);

        // Destructure the info
        const { userName, email, password } = req.body;

        // Check if the user already exist
        const emailExist = await User.findOne({ email });
        const userNameExist = await User.findOne({ userName });
        if( userNameExist || emailExist ){
            throw new Error("Username or Email already exists");    
        }

        // Protecting the credentials
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Creating a new User
        const newUser = new User({
            userName,
            email,
            password: hashedPassword
        });

        // Save the new user into records
        await newUser.save();
        res.status(200).json({succMsg: "SignUp Successful..."});

    } catch (error) {
        next(error);
    }
};

// Creating a signIn Controller Function
exports.signIn = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
};
