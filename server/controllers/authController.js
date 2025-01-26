// Importing Required Modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Importing our custom data models
const User = require("../models/userModel");

// Importing our Custom middlewares
const { errorHandler } = require("../middlewares/errorHandler");
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
            return next(errorHandler(400, "Username or Email already exists..."));    
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
            return next(errorHandler(404, "User not found...")); 
        }

        // Check password validity
        const validPass = bcrypt.compareSync(password, validUser.password);
        if (!validPass) {
            return next(errorHandler(400, "Invalid Email or Password..."));
        }

        // Create a token
        const token = jwt.sign( { id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);
        // Exclude the password from user
        const { password: passwd, ...rest } = validUser._doc;
        res.status(200).cookie("token", token, {httpOnly: true}).json(rest);

    } catch (error) {
        next(error);
    }
};


// Creating a Google req handler Controller function
exports.google = async (req, res, next) => {
    // Destructure the info
    const { name, email, googlePhotoUrl } = req.body;

    try {
        const userExist = await User.findOne({ email });
        if(userExist){
            const token = jwt.sign({id: userExist._id, isAdmin: userExist.isAdmin}, process.env.JWT_SECRET);
            const { password: passwd, ...rest } = userExist._doc;
            res.status(200).cookie("token", token, {httpOnly: true}).json(rest);
        } else{
            // Else if the user do not exist then create a new User
            // Generate a random pass of length = 16 ...(8 + 8) as it is required in our model
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            // Protecting the credentials
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(generatedPassword, salt);

            // Now create the new user and save it
            const newUser = new User({
                // Convert the username in such a format that it is always unique
                // Test User => testuser6519        ... here we lowercase, split at space, join them and add a random 4 digit value to it
                userName: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
                email: email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl
            });

            await newUser.save();

            const token = jwt.sign({id: newUser._id, isAdmin: newUser.isAdmin}, process.env.JWT_SECRET);
            const { password: passwd, ...rest } = newUser._doc;
            res.status(200).cookie("token", token, {httpOnly: true}).json(rest);
        }
    } catch (error) {
        next(error);
    };
}; 


// Creating a signOut Controller Function
exports.signOut = async (req, res, next) => {
    try {
        res.clearCookie("token").status(200).json({message:"User has been Signed Out."});
    } catch (error) {
        next(error);
    }
};


// Creating a Update User Controller Function3
exports.updateUserAccount = async (req, res, next) => {
    try {
        // Destructure the incoming data
        const { userName, email, password, profilePicture } = req.body;

        // Check if user from params and cookie are the same
        if (req.user.id !== req.params.userId) {
            return next(errorHandler(403, "You are not allowed to update this account..."));
        }

        // create a updated fields empty object
        const updateFields = {};

        // Check if the password length is not proper
        if (password) {
            if (password.length < 8) {
                return next(errorHandler(400, "Password should have at least 8 characters..."));
            }
            // Encrypt the password
            const salt = await bcrypt.genSalt(10);
            // set the encrypted password into updated field objects
            updateFields.password = await bcrypt.hash(password, salt);
        }

        // Put a constraint on Username
        if (userName) {
            // A regex to specify the format of Username
            const userNamePatternRegex = /^[a-zA-Z0-9_]+$/;

            // Check the Username format
            if (userName.length < 7 || userName.length > 20) {
                return next(errorHandler(400, "Username must be between 7 to 20 characters..."));
            } else if (userName.includes(" ")) {
                return next(errorHandler(400, "No spaces allowed in Username..."));
            } else if (!userNamePatternRegex.test(userName)) {
                return next(errorHandler(400, "Only Letters, Numbers and _ are allowed..."));
            }
            // set the username into updated field objects
            updateFields.userName = userName;
        }

        if (email) {
            // set the email into updated field objects
            updateFields.email = email;
        }

        if (profilePicture) {
            // set the profile pic into updated field objects
            updateFields.profilePicture = profilePicture;
        }

        // If there are fields to update, update the user
        if (Object.keys(updateFields).length > 0) {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.userId,
                { $set: updateFields },
                { new: true }
            );

            const { password: hashedPassword, ...rest } = updatedUser._doc;
            res.status(200).json(rest);
        } else {
            res.status(400).json({ message: "Nothing new to update" });
        }
    } catch (error) {
        next(error);
    }
};


// Creating a Delete Account controller function (secured by auth)
exports.deleteUserAccount = async (req, res, next) => {
    // Check if user from params and cookie are same
    if(req.user.id !== req.params.userId){
        return next(errorHandler(403, "You are not allowed to delete this account."));
    }

    // Delete the user details
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("Account has been Deleted.");
    } catch (error) {
        next(error);
    }
}