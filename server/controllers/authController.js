// Importing Required Modules
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
        // Validating the user info before creating it
        validateUserLogin(req.body);

        // Destructure the info
        const { email, password } = req.body;

        // Checking if the email exists
        const validUser = await User.findOne({ email: email });
        if (!validUser) {
            throw new Error("User do not Exist"); 
        }

        // Check password validity
        const validPass = bcrypt.compareSync(password, validUser.password);
        if (!validPass) {
            throw new Error("Invalid Email or Password");
        }

        // Create a token
        const token = jwt.sign( { id: validUser._id }, process.env.JWT_SECRET);
        // Exclude the password from user
        const { password: passwd, ...rest } = validUser._doc;
        res.status(200).cookie('token', token, {httpOnly: true}).json(rest);

    } catch (error) {
        next(error);
    }
};
