// Importing Required Modules
const bcrypt = require("bcryptjs");

// Importing our custom data models
const User = require("../models/userModel");

// Importing our Custom middlewares
const {errorHandler} = require("../middlewares/errorHandler");


// Creating a Update User Controller Function3
 
exports.updateUser = async (req, res, next) => {
    try {
        // Grab the updation info from the body
        const newUserName = req.body.userName;
        const newEmail = req.body.email;
        const newPassword = req.body.password;
        const newProfilePicture = req.body.profilePicture;

        // Check if user from params and cookie are same
        if(req.user.id !== req.params.userId){
            return next(errorHandler(403, "You are not allowed to update this account..."));
        }

        // Check if the password lenght is not proper
        if(newPassword){
            if(newPassword.length < 8){
                return next(errorHandler(400, "Password should have atleast 8 characters..."))
            }
            // Encrypt the password
            newPassword = bcrypt.hashSync(newPassword, 10);
        }

        // Put a constraint on Username
        if(newUserName){
            // A regex to specify the format of Username
            let userNamePatterRegex = /^[a-zA-Z0-9_]+$/;
            
            // Check the Username format
            if(newUserName.length < 7 || newUserName.length > 20){
                return next(errorHandler(400, "Username must be between 7 to 20 characters..."));
            }
            else if(newUserName.includes(" ")){
                return next(errorHandler(400, "No spaces allowed in Username..."));
            }
            else if (!userNamePatterRegex.test(newUserName)) {
                return next(errorHandler(400, "Only Letters, Numbers and _ is allowed..."));
            }
            
            // If everuthing is fine then update the user
            try {
                const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
                    $set: {
                        userName: newUserName,
                        email: newEmail,
                        password: newPassword,
                        profilePicture: newProfilePicture
                    }
                }, { new: true });
                const { password, ...rest } = updatedUser._doc;
                res.status(200).json(rest);
            } catch (error) {
               next(error); 
            }
        }
    } catch (error) {
        next(error);
    }
};


// Creating a Delete User controller function
exports.deleteUser = async (req, res, next) => {
    // Check if user from params and cookie are same
    if(req.user.id !== req.params.userId){
        return next(errorHandler(403, "You are not allowed to delete this account..."));
    }

    // Delete the user details
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("User has been Deleted...");
    } catch (error) {
        next(error);
    }
}


// Creating a Get User controller function
exports.getUsers = async (req, res, next) => {
    try {
       // Check if user is admin or not
    if(!req.user.isAdmin){
        return next(errorHandler(403, "You are not allowed to access this content..."));
    }

    // parameters to fetch the users
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    // Fetch all the users with defined parameters
    const users = await User.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);

    // Extract the password
    const userWithoutPasswd = users.map((user) => {
        const { password, ...rest } = user._doc;
        return rest;
    });

    // get the total number of users
    const totalUsers = await User.countDocuments();

    // Get change in no. of users since last month
    const now = new Date();
    const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
        createdAt: { $gte: oneMonthAgo }
    });

    // Send the response for this
    res.status(200).json({
        users: userWithoutPasswd,
        totalUsers,
        lastMonthUsers
    });
    } catch (error) {
        next(error);
    }
}