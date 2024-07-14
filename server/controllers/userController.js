// Importing Required Modules
const bcrypt = require("bcryptjs");

// Importing our custom data models
const User = require("../models/userModel");

// Importing our Custom middlewares
const { errorHandler } = require("../middlewares/errorHandler");


// Creating a Get User controller function
exports.getUsers = async (req, res, next) => {
	try {
		// Check if user is admin or not
		if (!req.user.isAdmin) {
			return next(
				errorHandler(403, "You are not allowed to access this content.")
			);
		}

		// parameters to fetch the users
		const startIndex = parseInt(req.query.startIndex) || 0;
		const limit = parseInt(req.query.limit) || 9;
		const sortDirection = req.query.sort === "asc" ? 1 : -1;

		// Fetch all the users with defined parameters
		const users = await User.find()
			.sort({ createdAt: sortDirection })
			.skip(startIndex)
			.limit(limit);

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
			createdAt: { $gte: oneMonthAgo },
		});

		// Send the response for this
		res.status(200).json({
			users: userWithoutPasswd,
			totalUsers,
			lastMonthUsers,
		});
	} catch (error) {
		next(error);
	}
};


// Creating a Delete User controller function => handles deleting users by Admin
exports.deleteUser = async (req, res, next) => {
	// Check if user is admin or not
    if (!req.user.isAdmin) {
        return next(
            errorHandler(403, "You are not allowed to access this content.")
        );
    }

	// Delete the user details
	try {
		await User.findByIdAndDelete(req.params.userId);
		res.status(200).json("User has been Deleted.");
	} catch (error) {
		next(error);
	}
};
