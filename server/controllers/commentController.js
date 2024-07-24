// Importing required Modules

// Importing out custom models
const Comment = require("../models/commentModel");

// Importing our custom middlewares
const { errorHandler } = require("../middlewares/errorHandler");

// Controller function to Add a new comment
exports.addNewComment = async (req, res, next) => {
	try {
		// Grab the incoming data
		const { content, postId, userId } = req.body;

		// Check if the user is authorised to create a comment
		if (userId !== req.user.id) {
			return next(
				errorHandler(403, "You are not authorised to add a comment.")
			);
		}

		// Create a new comment based on the data
		const newComment = new Comment({
			content,
			postId,
			userId,
		});

		// Save the comment created to database
		const savedComment = await newComment.save();

		// return the saved comment as response
		res.status(201).json(savedComment);
	} catch (error) {
		next(error);
	}
};

// Controller function to Get a comment
exports.getComment = async (req, res, next) => {
	try {
		// Get all the comments for a particular post
		const comments = await Comment.find({ postId: req.params.postId }).sort({
			createdAt: -1,
		});

		// return the obtained data
		res.status(200).json(comments);
	} catch (error) {
		next(error);
	}
};

// Controller function to Update a comment
exports.updateComment = async (req, res, next) => {
	try {
		// Grab the comment to be liked
		const comment = await Comment.findById(req.params.commentId);

		// show error if no comment exist
		if (!comment) {
			return next(errorHandler(404, "Comment not found."));
		}

        // check if the person is author of comment or Admin
        if(comment.userId !== req.user.id && !req.user.isAdmin){
            return next(errorHandler(403, "Not allowed to edit comment."));
        } 

		// Update the comment after finding it by ID
		const updatedComment = await Comment.findByIdAndUpdate(
			req.params.commentId,
			{ content: req.body.content },
			{ new: true }
		);

		// Ṣend the updated comment as a response
		res.status(200).json(updatedComment);
	} catch (error) {
		next(error);
	}
};

// Controller function to Like a comment
exports.likeComment = async (req, res, next) => {
	try {
		// Grab the comment to be liked
		const comment = await Comment.findById(req.params.commentId);

		// show error if no comment exist
		if (!comment) {
			return next(errorHandler(404, "Comment not found."));
		}

		// Check if the user already liked to comment or not
		const userIdx = comment.likes.indexOf(req.user.id);
		if (userIdx === -1) {
			comment.numberOfLike += 1; 			// increase the no. of likes by 1
			comment.likes.push(req.user.id); 	// like the comment
		} else {
			comment.numberOfLike -= 1; 			// decrease the no. of likes by 1
			comment.likes.splice(userIdx, 1); 	// unlike the comment
		}

		// save the updated comment state
		await comment.save();

		// send the comment as response back
		res.status(200).json(comment);
	} catch (error) {
		next(error);
	}
};

// Controller function to Delete a comment
exports.deleteComment = async (req, res, next) => {
	try {
		// Grab the comment to be liked
		const comment = await Comment.findById(req.params.commentId);

		// show error if no comment exist
		if (!comment) {
			return next(errorHandler(404, "Comment not found."));
		}

        // check if the person is author of comment or Admin
        if(comment.userId !== req.user.id && !req.user.isAdmin){
            return next(errorHandler(403, "Not allowed to edit comment."));
        }

		// Delete the comment from DB
		await Comment.findByIdAndDelete(req.params.commentId);

		// send the response after deletion
		res.status(200).json("Comment Deleted.");
	} catch (error) {
		next(error);
	}
};
